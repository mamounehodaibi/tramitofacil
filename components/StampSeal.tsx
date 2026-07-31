export default function StampSeal({
  text,
  sub,
  dir = "ltr",
}: {
  text: string;
  sub: string;
  dir?: "ltr" | "rtl";
}) {
  const id = "stampCirclePath";
  const rotate = dir === "rtl" ? 9 : -9;

  return (
    <svg
      viewBox="0 0 200 200"
      className="w-36 h-36 md:w-44 md:h-44"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <defs>
        <path id={id} d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0" />
      </defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke="var(--stamp)" strokeWidth="2.5" opacity="0.9" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="var(--stamp)" strokeWidth="1" opacity="0.55" />
      <text fontSize="13.5" letterSpacing="3.5" fill="var(--stamp)" fontFamily="var(--font-utility)" fontWeight="600">
        <textPath href={`#${id}`} startOffset="0%">
          {text.toUpperCase()} • {text.toUpperCase()} •
        </textPath>
      </text>
      <text
        x="100"
        y="106"
        textAnchor="middle"
        fontSize="12"
        fill="var(--stamp)"
        fontFamily="var(--font-utility)"
        fontWeight="600"
        letterSpacing="1"
      >
        {sub}
      </text>
      <path d="M 60,118 L 92,140 L 142,78" fill="none" stroke="var(--stamp)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </svg>
  );
}
