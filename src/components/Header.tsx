export function Header() {
  return (
    <header className="relative z-10 py-4 px-4 border-b border-earth-600/50 bg-gradient-to-b from-void-900 to-void-800/95 backdrop-blur-md shadow-lg shadow-black/20">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-center text-forest-400 tracking-widest uppercase drop-shadow-[0_0_12px_rgba(34,197,94,0.4)] title-glow">
          Demon King Idle
        </h1>
        <p className="text-center text-amber-100/90 text-sm sm:text-base mt-2 font-body max-w-md mx-auto leading-relaxed">
          Zbieraj złą energię. Przywołuj stwory. Rajduj ludzkość.
        </p>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-earth-500/60 to-transparent" aria-hidden="true" />
      </div>
    </header>
  )
}
