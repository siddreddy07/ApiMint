export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 font-pixel text-2xl font-bold">
      {/* A struck coin: mint disc with a notched edge. */}
      <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
        <circle cx="12" cy="12" r="11" className="fill-mint" />
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill="none"
          strokeWidth="3"
          strokeDasharray="1.2 2.53"
          className="stroke-[#0b2a22]"
        />
        <circle cx="12" cy="12" r="4" className="fill-[#0b2a22]" />
      </svg>
      ApiMint
    </span>
  )
}
