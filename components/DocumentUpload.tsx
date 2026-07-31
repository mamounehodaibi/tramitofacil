"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { PROCEDURES } from "@/lib/procedures";

type ValidationResult = {
  documentId: string;
  filename: string;
  status: "accepted" | "needs_review" | "rejected";
  notes: string;
};

const STATUS_STYLES: Record<ValidationResult["status"], string> = {
  accepted: "border-emerald-600 text-emerald-700 bg-emerald-50",
  needs_review: "border-stamp text-stamp bg-stamp/5",
  rejected: "border-red-700 text-red-700 bg-red-50",
};

// Mirrors the limits enforced server-side in /api/validate-nie-docs, so
// people get instant feedback instead of waiting on a round trip to be told
// their file was rejected.
const MAX_FILES = 8;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function DocumentUpload({
  procedureId,
}: {
  procedureId: string;
}) {
  const t = useTranslations("upload");
  const tProcedures = useTranslations("procedures");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ValidationResult[] | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const requirements = PROCEDURES[procedureId] ?? [];

  function errorMessageFor(
    code: string | undefined,
    data: { max?: number; filename?: string }
  ): string {
    switch (code) {
      case "rate_limited":
        return t("errorRateLimited");
      case "no_files":
        return t("errorNoFiles");
      case "too_many_files":
        return t("errorTooManyFiles", { max: data.max ?? 8 });
      case "file_too_large":
        return t("errorFileTooLarge", { filename: data.filename ?? "" });
      case "invalid_file_type":
        return t("errorInvalidFileType", { filename: data.filename ?? "" });
      default:
        return t("errorGeneric");
    }
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList);

    for (const file of incoming) {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        setError(t("errorInvalidFileType", { filename: file.name }));
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        setError(t("errorFileTooLarge", { filename: file.name }));
        return;
      }
    }

    setFiles((prev) => {
      const next = [...prev, ...incoming];
      if (next.length > MAX_FILES) {
        setError(t("errorTooManyFiles", { max: MAX_FILES }));
        return prev;
      }
      setError(null);
      return next;
    });
    setResults(null);
  }

  async function submit() {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("procedureId", procedureId);
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/api/validate-nie-docs", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(errorMessageFor(data?.errorCode, data));
        return;
      }
      setResults(data.results);
      setIsDemo(Boolean(data.demo));
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  const statusLabel = (s: ValidationResult["status"]) =>
    s === "accepted"
      ? t("statusAccepted")
      : s === "needs_review"
      ? t("statusReview")
      : t("statusRejected");

  const requirementLabel = (id: string) =>
    requirements.find((r) => r.id === id)?.label ?? id;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="font-utility text-xs tracking-[0.2em] text-stamp uppercase mb-3">
          {tProcedures(`${procedureId}.name` as "nie.name")}
        </p>
        <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
        <p className="text-ink-soft mt-2">{t("subtitle")}</p>
        <p className="text-xs text-ink-soft mt-4 border hairline rounded-lg px-3.5 py-2.5 bg-paper-raised leading-relaxed">
          {t("privacyNote")}
        </p>
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed hairline rounded-[28px] p-12 text-center hover:border-stamp transition-colors cursor-pointer bg-paper-raised"
      >
        <p className="font-medium text-ink">{t("dropzone")}</p>
        <p className="text-sm text-ink-soft mt-1">{t("hint")}</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {files.length > 0 && (
        <ul className="mt-5 space-y-2">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm border hairline rounded-lg px-4 py-2.5 bg-paper-raised"
            >
              <span className="truncate">{f.name}</span>
              <button
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                className="text-ink-soft hover:text-stamp cursor-pointer ml-3 shrink-0"
                aria-label="Remove"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full bg-stamp text-paper font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {loading ? t("analyzing") : t("submit")}
        </button>
      )}

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {isDemo && results && (
        <p className="mt-6 text-xs font-utility text-stamp border border-stamp rounded-lg px-3 py-2 bg-stamp/5">
          {t("demoNotice")}
        </p>
      )}

      {results && (
        <div className="mt-6 space-y-3">
          {results.map((r, i) => (
            <div
              key={i}
              className={`border rounded-lg p-4 ${STATUS_STYLES[r.status]}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-sm">
                  {requirementLabel(r.documentId)}
                </span>
                <span className="font-utility text-[10px] uppercase tracking-wider border rounded-full px-2 py-0.5 shrink-0">
                  {statusLabel(r.status)}
                </span>
              </div>
              <p className="text-xs mt-1.5 truncate opacity-70">{r.filename}</p>
              <p className="text-sm mt-2 leading-relaxed">{r.notes}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-ink-soft mt-8 leading-relaxed">
        {t("disclaimer")}
      </p>
    </div>
  );
}
