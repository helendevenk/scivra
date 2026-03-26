'use client';

/**
 * Animated Hero background — science-themed 3D visual elements.
 * Core visual: rotating wireframe cube + atom + helix + wave.
 * Pure CSS + SVG, no dependencies. Respects prefers-reduced-motion.
 */
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden motion-reduce:hidden" aria-hidden>
      {/* Base gradient — stronger */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-primary/[0.01] to-transparent" />

      {/* Perspective grid — 3D floor effect */}
      <div
        className="absolute bottom-0 left-0 h-[40%] w-full opacity-[0.04] dark:opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(var(--primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* === 3D WIREFRAME CUBE — center-right, the hero element === */}
      <svg
        className="absolute top-[10%] right-[8%] size-[280px] md:size-[360px] opacity-[0.08] dark:opacity-[0.14]"
        viewBox="0 0 200 200"
      >
        <g style={{ transformOrigin: '100px 100px' }} className="animate-[spin_20s_linear_infinite]">
          {/* Front face */}
          <polygon points="60,60 140,60 140,140 60,140" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-primary" />
          {/* Back face (offset for 3D) */}
          <polygon points="80,40 160,40 160,120 80,120" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-primary" opacity="0.5" />
          {/* Connecting edges */}
          <line x1="60" y1="60" x2="80" y2="40" stroke="currentColor" strokeWidth="0.8" className="text-primary" opacity="0.5" />
          <line x1="140" y1="60" x2="160" y2="40" stroke="currentColor" strokeWidth="0.8" className="text-primary" opacity="0.5" />
          <line x1="140" y1="140" x2="160" y2="120" stroke="currentColor" strokeWidth="0.8" className="text-primary" opacity="0.5" />
          <line x1="60" y1="140" x2="80" y2="120" stroke="currentColor" strokeWidth="0.8" className="text-primary" opacity="0.5" />
          {/* Vertex dots */}
          {[[60,60],[140,60],[140,140],[60,140],[80,40],[160,40],[160,120],[80,120]].map(([x,y], i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" className="text-primary" opacity="0.6">
              <animate attributeName="r" values="2;3.5;2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      </svg>

      {/* === ATOM (Physics) - top left, bigger & more visible === */}
      <svg
        className="absolute -top-5 -left-5 size-[280px] md:size-[350px] opacity-[0.07] dark:opacity-[0.12] animate-[spin_22s_linear_infinite]"
        viewBox="0 0 300 300"
      >
        <ellipse cx="150" cy="150" rx="130" ry="45" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
        <ellipse cx="150" cy="150" rx="130" ry="45" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-primary" transform="rotate(60 150 150)" />
        <ellipse cx="150" cy="150" rx="130" ry="45" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" transform="rotate(120 150 150)" />
        <circle cx="150" cy="150" r="10" fill="currentColor" className="text-primary" opacity="0.3" />
        {/* Electrons with glow */}
        <circle r="5" fill="currentColor" className="text-primary" opacity="0.7">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#hero-orbit1" />
          </animateMotion>
        </circle>
        <circle r="4" fill="currentColor" className="text-primary" opacity="0.5">
          <animateMotion dur="2.8s" repeatCount="indefinite">
            <mpath href="#hero-orbit2" />
          </animateMotion>
        </circle>
        <circle r="3.5" fill="currentColor" className="text-primary" opacity="0.4">
          <animateMotion dur="3.3s" repeatCount="indefinite">
            <mpath href="#hero-orbit3" />
          </animateMotion>
        </circle>
        <ellipse id="hero-orbit1" cx="150" cy="150" rx="130" ry="45" fill="none" />
        <ellipse id="hero-orbit2" cx="150" cy="150" rx="130" ry="45" fill="none" transform="rotate(60 150 150)" />
        <ellipse id="hero-orbit3" cx="150" cy="150" rx="130" ry="45" fill="none" transform="rotate(120 150 150)" />
      </svg>

      {/* === 3D SPHERE wireframe — bottom left === */}
      <svg
        className="absolute bottom-[5%] left-[5%] size-[200px] md:size-[250px] opacity-[0.05] dark:opacity-[0.09] animate-[spin_35s_linear_infinite]"
        viewBox="0 0 200 200"
      >
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="currentColor" strokeWidth="0.7" className="text-primary" />
        <ellipse cx="100" cy="100" rx="80" ry="55" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" transform="rotate(90 100 100)" />
        <ellipse cx="100" cy="100" rx="30" ry="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
        <ellipse cx="100" cy="100" rx="60" ry="80" fill="none" stroke="currentColor" strokeWidth="0.4" className="text-primary" transform="rotate(45 100 100)" />
      </svg>

      {/* === ANIMATED WAVE — bottom, more visible === */}
      <svg
        className="absolute bottom-0 left-0 h-[100px] w-full opacity-[0.06] dark:opacity-[0.10]"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
          <animate
            attributeName="d"
            values="M0 50 Q 180 10 360 50 Q 540 90 720 50 Q 900 10 1080 50 Q 1260 90 1440 50;M0 50 Q 180 90 360 50 Q 540 10 720 50 Q 900 90 1080 50 Q 1260 10 1440 50;M0 50 Q 180 10 360 50 Q 540 90 720 50 Q 900 10 1080 50 Q 1260 90 1440 50"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>
        <path fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary" opacity="0.5">
          <animate
            attributeName="d"
            values="M0 50 Q 180 30 360 50 Q 540 70 720 50 Q 900 30 1080 50 Q 1260 70 1440 50;M0 50 Q 180 70 360 50 Q 540 30 720 50 Q 900 70 1080 50 Q 1260 30 1440 50;M0 50 Q 180 30 360 50 Q 540 70 720 50 Q 900 30 1080 50 Q 1260 70 1440 50"
            dur="7s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      {/* === FLOATING PARTICLES — more & brighter === */}
      {[
        { left: '12%', top: '25%', size: 4, dur: 5, delay: 0 },
        { left: '88%', top: '45%', size: 3, dur: 4, delay: 0.8 },
        { left: '22%', top: '65%', size: 3.5, dur: 6, delay: 1.5 },
        { left: '72%', top: '20%', size: 2.5, dur: 4.5, delay: 0.3 },
        { left: '45%', top: '75%', size: 3, dur: 5.5, delay: 2 },
        { left: '92%', top: '70%', size: 4, dur: 6, delay: 0.5 },
        { left: '58%', top: '12%', size: 2, dur: 3.5, delay: 1.8 },
        { left: '35%', top: '40%', size: 3, dur: 5, delay: 1 },
        { left: '78%', top: '60%', size: 2.5, dur: 4.2, delay: 2.2 },
        { left: '8%', top: '50%', size: 3.5, dur: 5.8, delay: 0.7 },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary"
          style={{
            left: p.left,
            top: p.top,
            width: p.size * 2,
            height: p.size * 2,
            opacity: 0,
            animation: `pulse ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Central glow — stronger */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/[0.03] blur-[100px]" />
    </div>
  );
}
