

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg aria-hidden="true" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Jodo</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors focus-visible:outline-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors focus-visible:outline-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm">How it Works</a>
            <a href="https://github.com/z99wE/jodo" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors focus-visible:outline-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm">Documentation</a>
          </div>
          <button aria-label="Download Extension" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md focus-visible:outline-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2">
            Download Extension
          </button>
        </nav>
      </header>

      <main>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 blur-[100px] rounded-full mix-blend-multiply transform -skew-y-12"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-8">
            The Agentic OS for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Professional Accessibility
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Navigate complex web interfaces automatically. Jodo bridges the digital divide for Indian professionals by executing workflows via the Accessibility Tree, ensuring you are judged on skill, not interface friction.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button aria-label="Install Chrome Extension" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2">
              Install Chrome Extension
            </button>
            <button aria-label="View on GitHub" className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-50 transition-all shadow-sm focus-visible:outline-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2">
              View on GitHub
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Built for Transparency and Scale</h2>
            <p className="text-lg text-slate-600">Real-time traces, time-series forecasting, and multimodal feedback.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div aria-hidden="true" className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Agentic Navigator</h3>
              <p className="text-slate-600 leading-relaxed">
                Interacts directly with the browser&apos;s Accessibility Tree (AXTree). Bypasses brittle DOM scrapers for reliable, semantic workflow execution on any job portal or SaaS platform.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div aria-hidden="true" className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cognitive Insight Engine</h3>
              <p className="text-slate-600 leading-relaxed">
                Verifiable logic traces for every action. Jodo broadcasts its reasoning in real-time to your screen via WebSockets, eliminating black-box anxiety.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div aria-hidden="true" className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Predictive Career Pathing</h3>
              <p className="text-slate-600 leading-relaxed">
                Powered by the Lag-Llama engine. Jodo analyzes professional time-series data to forecast optimal application windows, maximizing your success rate.
              </p>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-slate-900 text-slate-400 py-12 text-center">
        <p className="mb-4">Designed for the Indian Professional Workforce.</p>
        <p className="text-sm">&copy; {new Date().getFullYear()} Jodo Agentic OS. Open Source.</p>
      </footer>
    </div>
  );
}
