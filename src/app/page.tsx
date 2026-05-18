import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden px-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 text-center max-w-3xl">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent uppercase">
          Megamind <span className="text-accent">X</span> TAPMI
        </h1>
        
        <p className="text-xl md:text-2xl text-white/60 mb-12 font-light leading-relaxed">
          Experience the future of campus interaction through our cutting-edge WebAR portal.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link 
            href="/ar-experience" 
            className="group relative px-10 py-5 bg-accent text-white font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(227,19,19,0.4)]"
          >
            <span className="relative z-10">Launch WebAR Experience</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Link>
          
          <button className="px-10 py-5 glass-panel text-white font-bold transition-all hover:bg-white/10 border-white/20">
            Learn More
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 right-0 text-center text-white/30 text-sm tracking-[0.2em] uppercase">
        Developed by Megamind Studios
      </div>
    </div>
  );
}
