import React from 'react'
import NavBar from '../components/NavBar'
import DashboardOverview from '../components/DashboardOverview'

export default function Dashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <NavBar />

      <header className="mt-6 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-slate-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-indigo-100/80 mt-1">Overview of content, quick actions, and recent updates.</p>
            </div>
            <div className="text-sm opacity-90">Last sync: <span className="font-medium">Just now</span></div>
          </div>
        </div>
      </header>

      <main className="mt-6 space-y-6">
        <DashboardOverview />
      </main>
    </div>
  )
}
