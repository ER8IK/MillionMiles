interface HeroProps {
  updatedAt?: string;
}

export function Hero({ }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden" style={{ aspectRatio: "16/7", minHeight: "340px" }}>

      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0f3460]">
        <video
          src="/banner-video.mp4"
          autoPlay muted loop playsInline
          className="w-full h-full object-cover"
        />

        
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-black/60" />

      <div className="relative z-10 flex flex-col items-center justify-center 
                      h-full text-center px-4">


        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold 
                       tracking-tight text-white mb-4 drop-shadow-2xl">
          Find Your
          <br />
          <span className="text-accent">Perfect Drive</span>
        </h1>

        <p className="text-white/70 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Browse premium used vehicles sourced directly from South Korea&apos;s largest
          automotive marketplace.
        </p>

        <a
          href="#listings"
          className="bg-accent hover:bg-accent/90 text-obsidian font-bold 
                     text-sm px-7 py-3 rounded-full transition-all duration-200
                     hover:shadow-[0_0_24px_rgba(201,168,76,0.4)] active:scale-95"
        >
          Browse Cars
        </a>
      </div>
    </section>
  );
}