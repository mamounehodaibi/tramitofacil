import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PROCEDURES } from "@/lib/procedures";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ValidationResult = {
  documentId: string;
  filename: string;
  status: "accepted" | "needs_review" | "rejected";
  notes: string;
};

// Mirrors the shape the model is asked to return, so a malformed response
// fails loudly instead of silently shipping bad guidance to the user.
type ModelResponse = {
  results: ValidationResult[];
};

const MAX_FILES = 8;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB per file
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

// Rate limits: a generous per-minute cap to absorb legitimate bursts (someone
// uploading several documents at once), and a tighter per-hour cap to bound
// worst-case Anthropic API cost from a single IP.
const RATE_LIMITS = [
  { limit: 6, windowMs: 60 * 1000 },
  { limit: 20, windowMs: 60 * 60 * 1000 },
];

// If the caller is signed in (Supabase session cookie present), save the
// uploaded files + results so they show up in /cuenta later. Guests get the
// exact same validation experience — this is purely additive and never
// blocks or changes the response if it fails or if Supabase isn't
// configured yet.
async function persistIfSignedIn(
  procedureId: string,
  files: File[],
  results: ValidationResult[],
  demo: boolean
) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await Promise.all(
      files.map(async (file, i) => {
        const result = results[i];
        if (!result) return;

        const path = `${user.id}/${procedureId}/${Date.now()}-${i}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(path, file, { contentType: file.type });
        if (uploadError) {
          console.error("Storage upload failed:", uploadError.message);
          return;
        }

        const { error: insertError } = await supabase
          .from("document_validations")
          .insert({
            user_id: user.id,
            procedure_id: procedureId,
            document_id: result.documentId,
            filename: result.filename,
            storage_path: path,
            status: result.status,
            notes: result.notes,
            demo,
          });
        if (insertError) {
          console.error("Saving validation row failed:", insertError.message);
        }
      })
    );
  } catch (err) {
    // Never let a persistence failure break document validation itself.
    console.error("persistIfSignedIn error:", err);
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  for (const { limit, windowMs } of RATE_LIMITS) {
    const result = checkRateLimit(`validate:${ip}:${windowMs}`, { limit, windowMs });
    if (!result.ok) {
      return NextResponse.json(
        { errorCode: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } }
      );
    }
  }

  const formData = await req.formData();
  const procedureId = formData.get("procedureId")?.toString() ?? "nie";
  const requirements = PROCEDURES[procedureId];

  if (!requirements) {
    return NextResponse.json({ errorCode: "unknown_procedure" }, { status: 400 });
  }

  const files = formData.getAll("files") as File[];
  if (files.length === 0) {
    return NextResponse.json({ errorCode: "no_files" }, { status: 400 });
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { errorCode: "too_many_files", max: MAX_FILES },
      { status: 400 }
    );
  }

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { errorCode: "file_too_large", filename: file.name },
        { status: 400 }
      );
    }
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { errorCode: "invalid_file_type", filename: file.name },
        { status: 400 }
      );
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // No key configured (e.g. local dev without .env set up yet) — return a
  // clearly-labeled mock so the UI is demoable without live API calls.
  if (!apiKey) {
    const mockResults: ValidationResult[] = files.map((f, i) => ({
      documentId: requirements[i % requirements.length]?.id ?? "unknown",
      filename: f.name,
      status: i % 3 === 0 ? "needs_review" : "accepted",
      notes:
        "[DEMO MODE — no ANTHROPIC_API_KEY set] This is a placeholder result. Set ANTHROPIC_API_KEY in .env.local to run real validation.",
    }));
    await persistIfSignedIn(procedureId, files, mockResults, true);
    return NextResponse.json({ results: mockResults, demo: true });
  }

  const anthropic = new Anthropic({ apiKey });

  const imageBlocks = await Promise.all(
    files.map(async (file) => {
      const bytes = Buffer.from(await file.arrayBuffer());
      const mediaType = file.type || "image/jpeg";
      return {
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: mediaType as "image/jpeg" | "image/png" | "image/webp",
          data: bytes.toString("base64"),
        },
      };
    })
  );

  const requirementsList = requirements
    .map((r) => `- ${r.id}: ${r.label} — ${r.description}`)
    .join("\n");

  const systemPrompt = `You are a document-checklist assistant for Spanish immigration paperwork. You are NOT a lawyer and must never give legal advice — only check documents against the literal requirements list provided.

Required documents for this procedure:
${requirementsList}

For each uploaded image, match it to the closest requirement id from the list above (or "unknown" if it doesn't match any), and classify it as:
- "accepted": clearly matches the requirement and looks complete/legible
- "needs_review": might match but has an issue (blurry, possibly expired, missing a page, mismatched name, etc.) — say exactly what to check
- "rejected": clearly does not match any requirement, or is unusable (wrong document, unreadable)

Respond ONLY with valid JSON matching this exact shape, no other text:
{"results": [{"documentId": "...", "filename": "...", "status": "accepted|needs_review|rejected", "notes": "short, plain-language explanation"}]}`;

  const userContent = [
    ...imageBlocks,
    {
      type: "text" as const,
      text: `Filenames in order: ${files.map((f) => f.name).join(", ")}. Validate each against the requirements list and respond with the JSON format specified.`,
    },
  ];

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from model");
    }

    const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned) as ModelResponse;

    await persistIfSignedIn(procedureId, files, parsed.results, false);

    return NextResponse.json({ results: parsed.results, demo: false });
  } catch (err) {
    console.error("Document validation error:", err);
    return NextResponse.json(
      { errorCode: "validation_failed" },
      { status: 500 }
    );
  }
}
