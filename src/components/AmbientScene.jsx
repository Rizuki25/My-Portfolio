/** Latar geometris dekoratif; tidak menangkap pointer maupun mengganggu konten. */
export default function AmbientScene() {
  return (
    <div className="ambient-scene" aria-hidden="true">
      <div className="ambient-orbit ambient-orbit--one" />
      <div className="ambient-orbit ambient-orbit--two" />
      <svg className="ambient-lines" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path d="M-80 690 C 240 500, 350 880, 720 650 S 1210 410, 1530 620" />
        <path d="M-100 720 C 220 530, 380 900, 750 680 S 1240 450, 1560 650" />
      </svg>
      <span className="ambient-cross ambient-cross--one">+</span>
      <span className="ambient-cross ambient-cross--two">+</span>
    </div>
  )
}
