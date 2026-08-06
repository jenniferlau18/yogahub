export function LotusFlower({ className = "w-24 h-24", opacity = 0.15 }: { className?: string; opacity?: number }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer petals */}
      <g opacity={opacity} fill="currentColor">
        <path d="M60 10 C45 35 45 55 60 70 C75 55 75 35 60 10Z" />
        <path d="M60 10 C45 35 45 55 60 70 C75 55 75 35 60 10Z" transform="rotate(45 60 60)" />
        <path d="M60 10 C45 35 45 55 60 70 C75 55 75 35 60 10Z" transform="rotate(90 60 60)" />
        <path d="M60 10 C45 35 45 55 60 70 C75 55 75 35 60 10Z" transform="rotate(135 60 60)" />
        <path d="M60 10 C45 35 45 55 60 70 C75 55 75 35 60 10Z" transform="rotate(180 60 60)" />
        <path d="M60 10 C45 35 45 55 60 70 C75 55 75 35 60 10Z" transform="rotate(225 60 60)" />
        <path d="M60 10 C45 35 45 55 60 70 C75 55 75 35 60 10Z" transform="rotate(270 60 60)" />
        <path d="M60 10 C45 35 45 55 60 70 C75 55 75 35 60 10Z" transform="rotate(315 60 60)" />
      </g>
      {/* Inner petals (smaller, offset) */}
      <g opacity={opacity * 1.3} fill="currentColor">
        <path d="M60 30 C50 45 50 52 60 58 C70 52 70 45 60 30Z" />
        <path d="M60 30 C50 45 50 52 60 58 C70 52 70 45 60 30Z" transform="rotate(60 60 60)" />
        <path d="M60 30 C50 45 50 52 60 58 C70 52 70 45 60 30Z" transform="rotate(120 60 60)" />
        <path d="M60 30 C50 45 50 52 60 58 C70 52 70 45 60 30Z" transform="rotate(180 60 60)" />
        <path d="M60 30 C50 45 50 52 60 58 C70 52 70 45 60 30Z" transform="rotate(240 60 60)" />
        <path d="M60 30 C50 45 50 52 60 58 C70 52 70 45 60 30Z" transform="rotate(300 60 60)" />
      </g>
      {/* Center */}
      <circle cx="60" cy="60" r="4" fill="currentColor" opacity={opacity * 2} />
    </svg>
  );
}

/** Yoga pose silhouettes */
export function MeditationPose({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Cross-legged meditation silhouette */}
      <ellipse cx="40" cy="24" rx="10" ry="11" />
      <path d="M30 33 Q20 50 15 58 L22 58 Q28 48 32 37 L40 40 L48 37 Q52 48 58 58 L65 58 Q60 50 50 33Z" />
      <path d="M28 58 Q30 65 40 65 Q50 65 52 58Z" />
    </svg>
  );
}

export function WarriorPose({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Warrior II silhouette */}
      <ellipse cx="40" cy="14" rx="9" ry="10" />
      {/* Arms outstretched */}
      <path d="M33 20 L10 15 L8 20 L30 25Z" />
      <path d="M47 20 L70 15 L72 20 L50 25Z" />
      {/* Body */}
      <path d="M33 24 Q40 32 40 45 Q40 32 47 24Z" />
      {/* Legs in lunge */}
      <path d="M36 42 L22 72 L30 72 L38 50Z" />
      <path d="M44 42 L55 65 L63 65 L46 50Z" />
    </svg>
  );
}

export function TreePose({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Tree pose silhouette */}
      <ellipse cx="40" cy="14" rx="9" ry="10" />
      {/* Arms up */}
      <path d="M38 22 Q30 10 40 6 Q50 12 42 22Z" />
      <circle cx="40" cy="4" r="4" />
      {/* Body */}
      <path d="M34 23 Q40 30 40 42 Q40 30 46 23Z" />
      {/* Standing leg */}
      <path d="M37 40 L32 72 L39 72 L43 42Z" />
      {/* Bent leg */}
      <path d="M40 40 Q52 45 50 55 L44 53 Q45 45 40 43Z" />
    </svg>
  );
}

/** Organic wave divider */
export function WaveDivider({ className = "w-full h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 48" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 24 C200 0 400 48 600 24 C800 0 1000 48 1200 24 L1200 48 L0 48Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Mandala decorative pattern */
export function Mandala({ className = "w-32 h-32", opacity = 0.08 }: { className?: string; opacity?: number }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity={opacity} stroke="currentColor" strokeWidth="1">
        {/* Concentric rings */}
        <circle cx="80" cy="80" r="70" />
        <circle cx="80" cy="80" r="50" />
        <circle cx="80" cy="80" r="30" />
        <circle cx="80" cy="80" r="10" />
        {/* Petal rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 80 + 60 * Math.cos(angle);
          const y1 = 80 + 60 * Math.sin(angle);
          const x2 = 80 + 75 * Math.cos(angle);
          const y2 = 80 + 75 * Math.sin(angle);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          );
        })}
        {/* Center dot pattern */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const cx = 80 + 18 * Math.cos(angle);
          const cy = 80 + 18 * Math.sin(angle);
          return <circle key={i} cx={cx} cy={cy} r="3" fill="currentColor" stroke="none" />;
        })}
      </g>
    </svg>
  );
}
