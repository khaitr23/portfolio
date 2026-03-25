/** UW "W" icon — exact path from official UW vector logo, emerald green with glow */
export function UWIcon({ size = 22 }: { size?: number }) {
  // Exact path extracted from W-Logo_Purple_vector.eps (no Y-flip — Illustrator EPS uses top-down Y)
  const d =
    "M 79.2588,0 C 79.2588,0.8584 79.2588,12.2383 79.2588,13.0977 C 80.1152,13.0977 88.4648,13.0977 88.4648,13.0977 L 78.1865,51.3486 C 78.1865,51.3486 65.6094,0.7129 65.4307,0 C 64.7441,0 52.8047,0 52.1279,0 C 51.9404,0.6963 38.332,51.3516 38.332,51.3516 L 28.8662,13.0977 C 28.8662,13.0977 37.5918,13.0977 38.4512,13.0977 C 38.4512,12.2383 38.4512,0.8584 38.4512,0 C 37.5322,0 0.9194,0 0,0 C 0,0.8584 0,12.2383 0,13.0977 C 0.8511,13.0977 8.52,13.0977 8.52,13.0977 C 8.52,13.0977 23.2227,71.9063 23.4004,72.6201 C 24.1079,72.6201 43.3423,72.6201 44.0396,72.6201 C 44.2227,71.9229 53.8916,35.166 53.8916,35.166 C 53.8916,35.166 63.0791,71.9131 63.2559,72.6201 C 63.9629,72.6201 83.1973,72.6201 83.8945,72.6201 C 84.0801,71.918 99.5508,13.0977 99.5508,13.0977 C 99.5508,13.0977 107.15,13.0977 108,13.0977 C 108,12.2383 108,0.8584 108,0 C 107.092,0 80.167,0 79.2588,0 Z";

  return (
    <svg
      width={size}
      height={Math.round(size * 72.6201 / 108)}
      viewBox="0 0 108 72.6201"
      fill="none"
      aria-label="University of Washington"
    >
      <defs>
        {/* Wide outer bloom */}
        <filter id="uw-bloom" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" in="SourceGraphic" result="bloom" />
        </filter>
        {/* Tight inner glow */}
        <filter id="uw-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" in="SourceGraphic" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Wide bloom layer */}
      <path d={d} fill="#10b981" opacity="0.25" filter="url(#uw-bloom)" />
      {/* Mid glow halo */}
      <path d={d} fill="#10b981" opacity="0.35" filter="url(#uw-bloom)" />
      {/* Main filled W with sharp glow */}
      <path d={d} fill="#10b981" filter="url(#uw-glow)" />
      {/* Bright highlight overlay */}
      <path d={d} fill="#a7f3d0" opacity="0.55" />
    </svg>
  );
}

export function GithubIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function LinkedinIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
