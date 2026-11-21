import Image from 'next/image'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07090F] select-none">
      {/* Studio Gaussian Blur Aura Background (Lightened & soft) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Spotlight Texture */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen scale-110">
          <Image
            src="/studio-spotlight-bg.jpg"
            alt="Studio Spotlight"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Ambient Center Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] rounded-full bg-[#398BFF]/20 blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[250px] rounded-full bg-white/10 blur-[120px] pointer-events-none" />
        
        {/* Soft Vignette Edge */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#07090F]/30 to-[#07090F]/90 pointer-events-none" />
      </div>

      {/* Center Logo & Kinetic Indicator */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-48 h-48 rounded-full bg-[#247BFF]/25 blur-2xl animate-ping" />
          <div className="relative w-52 sm:w-64 h-16 flex items-center justify-center">
            <Image
              src="/logo-white-text.png"
              alt="EBEE.PK"
              fill
              priority
              sizes="(max-width: 640px) 208px, 256px"
              className="object-contain"
            />
          </div>
        </div>

        {/* Futuristic Kinetic Progress Bar */}
        <div className="mt-8 flex flex-col items-center gap-2.5">
          <div className="w-40 sm:w-48 h-1 rounded-full bg-white/10 overflow-hidden relative border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#247BFF] to-white rounded-full animate-pulse" />
          </div>
          <span className="font-mono text-[10px] text-[#afc6ff] uppercase tracking-widest font-bold animate-pulse">
            INITIALIZING
          </span>
        </div>
      </div>
    </div>
  )
}
