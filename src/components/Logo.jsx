export default function Logo({ size = 40, white = false }) {
  const color = white ? '#ffffff' : '#7B2D8B'

  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Center dot */}
        <circle cx="80" cy="80" r="16" fill={color} />
        {/* Ring 1 */}
        <circle cx="80" cy="80" r="36" stroke={color} strokeWidth="8" fill="none" />
        {/* Ring 2 */}
        <circle cx="80" cy="80" r="56" stroke={color} strokeWidth="8" fill="none" />
        {/* Ring 3 */}
        <circle cx="80" cy="80" r="74" stroke={color} strokeWidth="8" fill="none" />
      </svg>
      <div className="flex flex-col leading-none">
        <span
          className="font-black tracking-widest uppercase"
          style={{
            fontSize: size * 0.38,
            color: white ? '#ffffff' : '#7B2D8B',
            letterSpacing: '0.12em',
          }}
        >
          Purple Dot
        </span>
        <span
          className="font-semibold tracking-widest uppercase"
          style={{
            fontSize: size * 0.2,
            color: white ? 'rgba(255,255,255,0.75)' : '#9B4DCA',
            letterSpacing: '0.18em',
          }}
        >
          Financial Inc.
        </span>
      </div>
    </div>
  )
}
