import React from 'react'
import NavBar from '../components/NavBar'
import DashboardOverview from '../components/DashboardOverview'

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <NavBar />

      <header className="relative rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="relative p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-indigo-100/90 mt-2 text-lg">Overview of content, quick actions, and recent updates.</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-sm font-medium">System Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-8 space-y-8">
        <DashboardOverview />
      </main>
    </div>
  )
}
