/**
 * Motion graphic identitas: orbit tipografi, crosshair, sinyal, dan monogram.
 * SVG + transform CSS saja—ringan, tajam di semua resolusi, dan responsif.
 */
export default function KineticPortrait({ profile }) {
  return (
    <div
      className="kinetic-portrait"
      data-pointer-scene
      data-scroll-scene
      data-scene-depth="0.65"
      role="img"
      aria-label={profile.avatarUrl ? `Potret ${profile.name}` : `Monogram ${profile.name}`}
    >
      <div className="kinetic-portrait__stage">
        <svg className="kinetic-portrait__svg" viewBox="0 0 320 280" aria-hidden="true">
          <g className="kinetic-crosshair">
            <path d="M160 16V264M16 140H304" />
            <rect x="154" y="134" width="12" height="12" />
          </g>

          <g className="kinetic-orbit kinetic-orbit--outer">
            <circle cx="160" cy="140" r="119" pathLength="100" />
            <circle className="kinetic-orbit__accent" cx="160" cy="140" r="119" pathLength="100" />
          </g>

          <g className="kinetic-orbit kinetic-orbit--type">
            <defs>
              <path id="kinetic-orbit-path" d="M160 140m-101 0a101 101 0 1 1 202 0a101 101 0 1 1-202 0" />
            </defs>
            <text>
              <textPath href="#kinetic-orbit-path" startOffset="0%">
                DESIGN · CODE · MOTION · UI ENGINEERING · DESIGN · CODE · MOTION ·
              </textPath>
            </text>
          </g>

          <g className="kinetic-orbit kinetic-orbit--inner">
            <circle cx="160" cy="140" r="75" pathLength="100" />
            <rect x="155" y="60" width="10" height="10" />
            <rect x="155" y="210" width="10" height="10" />
          </g>
        </svg>

        <div className="kinetic-core">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
          ) : (
            <span className="font-display text-[2.7rem] leading-none tracking-[-0.06em] text-paper sm:text-5xl">
              {profile.monogram}
            </span>
          )}
        </div>

        <span className="kinetic-satellite kinetic-satellite--one" />
        <span className="kinetic-satellite kinetic-satellite--two" />
        <span className="kinetic-coordinate kinetic-coordinate--top">X / 01</span>
        <span className="kinetic-coordinate kinetic-coordinate--bottom">Y / 07</span>
        <span className="kinetic-scan" />
      </div>
    </div>
  )
}
