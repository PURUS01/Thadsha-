import React from 'react'
import NavBar from '../components/NavBar'
import ThemeSelector from '../components/ThemeSelector'

export default function ThemeManager(){
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <NavBar />
      <div className="mt-6 bg-slate-900/40 p-4 rounded">
        <h3 className="font-semibold mb-2">Theme Manager</h3>
        <div className="mt-2">
          <ThemeSelector />
        </div>
      </div>
    </div>
  )
}
