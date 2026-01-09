import React from 'react'
import NavBar from '../components/NavBar'
import ThemeSelector from '../components/ThemeSelector'

export default function ThemeManager() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <NavBar />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Header Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-32">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Theme Manager</h1>
            <p className="text-slate-400 text-sm mb-6">
              Customize the look and feel of your portfolio. Choose from preset palettes or tweak colors nicely.
            </p>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white">Live Preview</div>
                  <div className="text-xs text-slate-400">Changes reflect instantly</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Selected theme settings are synced to your Firestore database. The main portfolio site listens to these changes in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Selector Section */}
        <div className="lg:col-span-8">
          <ThemeSelector />
        </div>
      </div>
    </div>
  )
}
