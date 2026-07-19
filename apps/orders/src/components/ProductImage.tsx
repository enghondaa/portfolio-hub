/**
 * A branded placeholder image, drawn from the product name and the app's own
 * tokens rather than a stock photo pack. Each product gets a deterministic
 * warm gradient from a hash of its slug, plus its initials and a coffee-bean
 * mark, so the catalogue looks intentional without sourcing twelve photos.
 */
function hashHue(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

export function ProductImage({
  name,
  imageKey,
  className,
}: {
  name: string;
  imageKey: string;
  className?: string;
}) {
  const hue = hashHue(imageKey);
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
  const a = `hsl(${hue}, 42%, 32%)`;
  const b = `hsl(${(hue + 28) % 360}, 38%, 22%)`;
  const gid = `g-${imageKey}`;

  return (
    <svg viewBox="0 0 400 400" role="img" aria-label={`${name} packaging`} className={className}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${gid})`} />
      <circle cx="200" cy="168" r="70" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
      <path d="M200 108 C 176 138, 176 198, 200 228 C 224 198, 224 138, 200 108 Z" fill="rgba(255,255,255,0.22)" />
      <text
        x="200"
        y="316"
        textAnchor="middle"
        fontFamily="var(--font-heading), serif"
        fontSize="64"
        fontWeight="700"
        fill="rgba(255,255,255,0.92)"
      >
        {initials}
      </text>
      <text
        x="200"
        y="352"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontSize="13"
        letterSpacing="3"
        fill="rgba(255,255,255,0.6)"
      >
        KAHWA SUPPLY
      </text>
    </svg>
  );
}
