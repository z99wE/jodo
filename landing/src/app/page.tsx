
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 glass-panel">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary neon-glow flex items-center justify-center" aria-label="Jodo Logo">
              <span className="font-bold text-white tracking-tighter" aria-hidden="true">J</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Jodo
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#docs" className="hover:text-white transition-colors">Docs</a>
          </div>
          <div>
            <a 
              href="/jodo-extension.zip" 
              download
              aria-label="Download Jodo Extension"
              className="px-5 py-2.5 rounded-full bg-zinc-800 text-sm font-medium text-white border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 transition-all"
            >
              Get Extension
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-40 pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh] text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-8">
              <span>The Everyday AI Innovator</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
              Jodo simplifies the <br className="hidden md:block" />
              <span className="text-gradient">complex Indian web.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
              The internet wasn&apos;t built for everyone. Jodo is an AI co-pilot that autonomously navigates confusing websites—from IRCTC to local government portals—so anyone can participate in Digital India.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a 
                href="/jodo-extension.zip" 
                download
                aria-label="Download Jodo Extension zip file"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-semibold flex items-center justify-center gap-2 neon-glow hover:bg-purple-500 transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download Extension
              </a>
              <a 
                href="#docs" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-white font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98]"
              >
                Read the Docs
              </a>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Everyday life, made better.</h2>
              <p className="text-zinc-400 text-lg max-w-2xl">Jodo breaks down digital barriers. We parse complex DOMs, analyze intent, and execute actions, turning frustrating web tasks into simple, conversational experiences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="glass-panel rounded-3xl p-8 flex flex-col h-full group hover:border-primary/50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-8 group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:text-primary transition-colors text-zinc-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Tame Complex Portals</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Struggling with Tatkal booking or EPFO claims? Jodo autonomously navigates dense, confusing UI on your behalf with a transparent logic trace.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-panel rounded-3xl p-8 flex flex-col h-full group hover:border-blue-500/50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-8 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-colors text-zinc-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Bundled Local AI</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  No API key? No problem. Jodo falls back to a lightning-fast, bundled local AI model that runs directly on your machine to ensure reliable execution.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-panel rounded-3xl p-8 flex flex-col h-full group hover:border-pink-500/50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-8 group-hover:bg-pink-500/20 group-hover:border-pink-500/50 group-hover:text-pink-400 transition-colors text-zinc-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Digital Bridge</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Overcome digital literacy barriers. Jodo translates intimidating visual interfaces into accessible, actionable tasks for everyone.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 bg-black/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="font-bold text-primary text-xs">J</span>
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">Jodo</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Jodo Agentic OS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
