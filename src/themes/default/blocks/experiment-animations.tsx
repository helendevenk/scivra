'use client';

/**
 * Animated SVG thumbnails for featured experiments.
 * Pure CSS + SVG, no external dependencies.
 */

export function ProjectileMotionAnim() {
  return (
    <svg viewBox="0 0 400 250" className="size-full" aria-hidden>
      <defs>
        <linearGradient id="pm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(220 60% 15%)" />
          <stop offset="100%" stopColor="hsl(220 50% 25%)" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="400" height="250" fill="url(#pm-sky)" />
      {/* Ground */}
      <line x1="0" y1="220" x2="400" y2="220" stroke="hsl(220 40% 40%)" strokeWidth="1" strokeDasharray="4 4" />
      {/* Grid lines */}
      {[50, 100, 150, 200].map(y => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="hsl(220 30% 30%)" strokeWidth="0.5" opacity="0.3" />
      ))}
      {/* Parabolic path */}
      <path
        d="M 40 200 Q 120 20 340 200"
        fill="none"
        stroke="hsl(190 90% 60%)"
        strokeWidth="2"
        strokeDasharray="6 4"
        opacity="0.6"
      />
      {/* Animated ball along path */}
      <circle r="8" fill="hsl(190 90% 65%)" filter="drop-shadow(0 0 6px hsl(190 90% 60%))">
        <animateMotion
          dur="2.5s"
          repeatCount="indefinite"
          path="M 40 200 Q 120 20 340 200"
        />
      </circle>
      {/* Velocity arrows */}
      <g opacity="0.4">
        <line x1="40" y1="200" x2="80" y2="160" stroke="hsl(40 90% 60%)" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1="200" y1="40" x2="250" y2="40" stroke="hsl(40 90% 60%)" strokeWidth="1.5" />
        <line x1="340" y1="200" x2="370" y2="170" stroke="hsl(40 90% 60%)" strokeWidth="1.5" />
      </g>
      {/* Angle arc */}
      <path d="M 60 200 A 20 20 0 0 0 45 185" fill="none" stroke="hsl(40 90% 60%)" strokeWidth="1" opacity="0.5" />
      <text x="68" y="195" fill="hsl(40 90% 60%)" fontSize="10" opacity="0.6">45°</text>
      {/* Labels */}
      <text x="20" y="240" fill="hsl(220 30% 60%)" fontSize="11" fontFamily="monospace">v₀</text>
      <text x="350" y="240" fill="hsl(220 30% 60%)" fontSize="11" fontFamily="monospace">R</text>
    </svg>
  );
}

export function DnaHelixAnim() {
  // Pre-compute 8 keyframes of helix positions for SMIL animation
  const NODES = 18;
  const FRAMES = 8;
  const R = 70; // helix radius
  const CX = 200;
  const dur = '4s';

  // For each node, compute x positions at each frame
  const nodeFrames = Array.from({ length: NODES }, (_, i) => {
    const basePhase = i * 0.38;
    const y = 15 + i * 13;
    const colors1 = ['hsl(190 80% 55%)', 'hsl(150 70% 50%)', 'hsl(60 70% 55%)', 'hsl(280 60% 60%)'];
    const colors2 = ['hsl(340 70% 55%)', 'hsl(40 80% 55%)', 'hsl(200 70% 50%)', 'hsl(120 60% 50%)'];
    const c1 = colors1[i % 4];
    const c2 = colors2[i % 4];

    const x1Values: string[] = [];
    const x2Values: string[] = [];
    const r1Values: string[] = [];
    const r2Values: string[] = [];
    const o1Values: string[] = [];
    const o2Values: string[] = [];

    for (let f = 0; f <= FRAMES; f++) {
      const t = (f / FRAMES) * Math.PI * 2;
      const phase = basePhase + t;
      const sin = Math.sin(phase);
      const cos = Math.cos(phase);
      const x1 = Math.round((CX + sin * R) * 10) / 10;
      const x2 = Math.round((CX - sin * R) * 10) / 10;
      const d1 = Math.round(((cos + 1) / 2) * 100) / 100;
      const d2 = Math.round(((-cos + 1) / 2) * 100) / 100;
      x1Values.push(String(x1));
      x2Values.push(String(x2));
      r1Values.push(String(Math.round((2.5 + d1 * 4) * 10) / 10));
      r2Values.push(String(Math.round((2.5 + d2 * 4) * 10) / 10));
      o1Values.push(String(Math.round((0.3 + d1 * 0.7) * 100) / 100));
      o2Values.push(String(Math.round((0.3 + d2 * 0.7) * 100) / 100));
    }

    return { y, c1, c2, x1Values, x2Values, r1Values, r2Values, o1Values, o2Values };
  });

  return (
    <svg viewBox="0 0 400 250" className="size-full" aria-hidden>
      <defs>
        <linearGradient id="dna-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(220 60% 12%)" />
          <stop offset="100%" stopColor="hsl(260 50% 18%)" />
        </linearGradient>
        <filter id="dna-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="400" height="250" fill="url(#dna-bg)" />

      {nodeFrames.map((n, i) => (
        <g key={i}>
          {/* Base pair connector */}
          <line y1={n.y} y2={n.y} stroke="hsl(220 40% 50%)" strokeWidth="1" opacity="0.25">
            <animate attributeName="x1" values={n.x1Values.join(';')} dur={dur} repeatCount="indefinite" />
            <animate attributeName="x2" values={n.x2Values.join(';')} dur={dur} repeatCount="indefinite" />
          </line>
          {/* Strand 1 */}
          <circle cy={n.y} fill={n.c1} filter="url(#dna-glow)">
            <animate attributeName="cx" values={n.x1Values.join(';')} dur={dur} repeatCount="indefinite" />
            <animate attributeName="r" values={n.r1Values.join(';')} dur={dur} repeatCount="indefinite" />
            <animate attributeName="opacity" values={n.o1Values.join(';')} dur={dur} repeatCount="indefinite" />
          </circle>
          {/* Strand 2 */}
          <circle cy={n.y} fill={n.c2} filter="url(#dna-glow)">
            <animate attributeName="cx" values={n.x2Values.join(';')} dur={dur} repeatCount="indefinite" />
            <animate attributeName="r" values={n.r2Values.join(';')} dur={dur} repeatCount="indefinite" />
            <animate attributeName="opacity" values={n.o2Values.join(';')} dur={dur} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Central glow */}
      <ellipse cx="200" cy="125" rx="50" ry="100" fill="hsl(260 60% 50%)" opacity="0.04" />
    </svg>
  );
}

export function ChemEquilibriumAnim() {
  return (
    <svg viewBox="0 0 400 250" className="size-full" aria-hidden>
      <defs>
        <linearGradient id="ce-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(220 60% 12%)" />
          <stop offset="100%" stopColor="hsl(200 50% 20%)" />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill="url(#ce-bg)" />

      {/* Equilibrium arrows */}
      <g opacity="0.6">
        <line x1="160" y1="115" x2="240" y2="115" stroke="hsl(190 80% 55%)" strokeWidth="2" />
        <polygon points="240,115 232,111 232,119" fill="hsl(190 80% 55%)" />
        <line x1="240" y1="135" x2="160" y2="135" stroke="hsl(190 80% 55%)" strokeWidth="2" />
        <polygon points="160,135 168,131 168,139" fill="hsl(190 80% 55%)" />
      </g>

      {/* Reactant molecules (left) */}
      <g>
        <circle cx="80" cy="110" r="14" fill="hsl(190 70% 50%)" opacity="0.8">
          <animate attributeName="cx" values="80;90;80" dur="3s" repeatCount="indefinite" />
        </circle>
        <text x="75" y="114" fill="white" fontSize="12" fontWeight="bold">A</text>
        <circle cx="120" cy="140" r="10" fill="hsl(150 60% 45%)" opacity="0.8">
          <animate attributeName="cx" values="120;110;120" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <text x="116" y="144" fill="white" fontSize="11" fontWeight="bold">B</text>
      </g>

      {/* Product molecules (right) */}
      <g>
        <circle cx="300" cy="105" r="12" fill="hsl(40 70% 50%)" opacity="0.8">
          <animate attributeName="cx" values="300;310;300" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="316" cy="118" r="8" fill="hsl(340 60% 50%)" opacity="0.7">
          <animate attributeName="cx" values="316;322;316" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <text x="293" y="109" fill="white" fontSize="11" fontWeight="bold">AB</text>

        <circle cx="310" cy="155" r="12" fill="hsl(40 70% 50%)" opacity="0.8">
          <animate attributeName="cx" values="310;320;310" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="326" cy="168" r="8" fill="hsl(340 60% 50%)" opacity="0.7">
          <animate attributeName="cx" values="326;332;326" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <text x="303" y="159" fill="white" fontSize="11" fontWeight="bold">AB</text>
      </g>

      {/* Energy indicator */}
      <g opacity="0.4">
        <text x="170" y="95" fill="hsl(190 60% 70%)" fontSize="9" fontFamily="monospace">k₁</text>
        <text x="210" y="160" fill="hsl(190 60% 70%)" fontSize="9" fontFamily="monospace">k₂</text>
      </g>

      {/* Floating particles */}
      {[
        { cx: 60, cy: 80, r: 2, dur: '4s' },
        { cx: 340, cy: 190, r: 1.5, dur: '3.5s' },
        { cx: 50, cy: 180, r: 1, dur: '5s' },
        { cx: 350, cy: 80, r: 2, dur: '4.5s' },
      ].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="hsl(190 60% 60%)" opacity="0.3">
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur={p.dur} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/** Map experiment slug to animation component */
export const experimentAnimations: Record<string, () => React.JSX.Element> = {
  'projectile-motion': ProjectileMotionAnim,
  'dna-structure': DnaHelixAnim,
  'chemical-equilibrium': ChemEquilibriumAnim,
};
