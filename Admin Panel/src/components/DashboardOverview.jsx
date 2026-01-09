import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isFirebaseConfigured, getDbInstance } from '../services/firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'

export default function DashboardOverview() {
  const [counts, setCounts] = useState({ projects: 0, skills: 0, technologies: 0, profile: 0 })
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!isFirebaseConfigured()) {
        setLoading(false)
        return
      }
      try {
        const db = getDbInstance()

        // projects count & recent
        const projectsCol = collection(db, 'projects')
        const projSnap = await getDocs(projectsCol)
        const projDocs = projSnap.docs.map(d => ({ id: d.id, ...d.data() }))

        // skills & technologies stored under skills_and_technologies
        const satCol = collection(db, 'skills_and_technologies')
        const satSnap = await getDocs(satCol)
        let skillsCount = 0
        let techCount = 0
        satSnap.forEach(d => {
          const id = d.id
          const items = (d.data() && d.data().items) || {}
          const size = Object.keys(items).length
          if (id === 'skills') skillsCount = size
          if (id === 'technologies') techCount = size
        })

        // profile document exists either under `profile/main`
        const profileDoc = doc(db, 'profile', 'main')
        const profileSnap = await getDoc(profileDoc)
        const profileExists = profileSnap.exists()

        if (!mounted) return
        setCounts({ projects: projDocs.length, skills: skillsCount, technologies: techCount, profile: profileExists ? 1 : 0 })

        // recent projects: show up to 5 most recent by create time if present
        let recent = projDocs.slice(0, 5)
        if (projDocs.length > 1) {
          recent = projDocs
            .sort((a, b) => {
              const ta = a.createdAt ? a.createdAt.seconds || 0 : 0
              const tb = b.createdAt ? b.createdAt.seconds || 0 : 0
              return tb - ta
            })
            .slice(0, 5)
        }
        setRecentProjects(recent)
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => (mounted = false)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Projects" value={counts.projects} loading={loading} tone="indigo">
          <Link to="/dashboard/projects" className="text-sm text-indigo-100 hover:underline">Manage projects</Link>
        </Card>
        <Card title="Skills" value={counts.skills} loading={loading} tone="emerald">
          <Link to="/dashboard/skills" className="text-sm text-emerald-100 hover:underline">Edit skills</Link>
        </Card>
        <Card title="Technologies" value={counts.technologies} loading={loading} tone="violet">
          <Link to="/dashboard/skills" className="text-sm text-violet-100 hover:underline">Edit technologies</Link>
        </Card>
        <Card title="Profile" value={counts.profile} loading={loading} tone="amber">
          <Link to="/dashboard/profile" className="text-sm text-amber-100 hover:underline">Edit profile</Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="p-4 rounded bg-gradient-to-br from-slate-800/60 to-slate-900/60 shadow-lg ring-1 ring-slate-700/40">
            <h4 className="font-semibold mb-3 text-slate-100">Recent Projects</h4>
            {loading ? (
              <div className="text-sm text-slate-300">Loading…</div>
            ) : recentProjects.length === 0 ? (
              <div className="text-sm text-slate-400">No projects yet. Create one to populate this list.</div>
            ) : (
              <ul className="space-y-3">
                {recentProjects.map(p => (
                  <li key={p.id} className="flex items-center justify-between bg-slate-900/30 p-3 rounded hover:translate-y-0.5 transition-transform">
                    <div>
                      <div className="font-medium text-slate-100">{p.name || 'Untitled project'}</div>
                      <div className="text-sm text-slate-300">{p.url || p.description || ''}</div>
                    </div>
                    <Link to={`/dashboard/projects`} className="text-indigo-300 text-sm hover:underline">View all</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="p-4 rounded bg-gradient-to-br from-indigo-700 to-indigo-900 shadow-lg">
            <h4 className="font-semibold text-white">Quick Actions</h4>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <QuickAction to="/dashboard/profile" label="Edit Profile">{iconUser()}</QuickAction>
              <QuickAction to="/dashboard/projects" label="Add Project">{iconPlus()}</QuickAction>
              <QuickAction to="/dashboard/skills" label="Manage Skills">{iconSpark()}</QuickAction>
              <QuickAction to="/dashboard/theme" label="Theme">{iconPalette()}</QuickAction>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, children, loading, tone = 'slate' }) {
  const toneBg = {
    indigo: 'from-indigo-600 to-indigo-800',
    emerald: 'from-emerald-500 to-emerald-700',
    violet: 'from-violet-600 to-violet-800',
    amber: 'from-amber-500 to-amber-700',
    slate: 'from-slate-700 to-slate-900',
  }[tone]

  return (
    <div className={`rounded p-4 bg-gradient-to-br ${toneBg} text-white shadow-md ring-1 ring-white/5` }>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm opacity-90">{title}</div>
          <div className="mt-2 text-2xl font-bold">{loading ? '—' : value}</div>
        </div>
        <div className="opacity-80">{cardIconFor(title)}</div>
      </div>
      <div className="mt-3 text-sm opacity-90">{children}</div>
    </div>
  )
}

function QuickAction({ to, children, label }) {
  return (
    <Link to={to} className="flex items-center space-x-3 p-2 rounded bg-white/6 hover:bg-white/10 transition">
      <div className="w-8 h-8 flex items-center justify-center text-white/90">{children}</div>
      <div className="text-sm text-white">{label}</div>
    </Link>
  )
}

function cardIconFor(title) {
  if (title === 'Projects') return iconFolder()
  if (title === 'Skills') return iconSpark()
  if (title === 'Technologies') return iconCube()
  return iconUser()
}

function iconFolder() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h3l2 2h7a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  )
}

function iconUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 14a4 4 0 10-8 0v1a4 4 0 004 4h0a4 4 0 004-4v-1zM12 10a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  )
}

function iconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function iconSpark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
    </svg>
  )
}

function iconPalette() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3a9 9 0 100 18 3 3 0 013-3h1a2 2 0 000-4h-1a3 3 0 01-3-3V3z" />
    </svg>
  )
}

function iconCube() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    </svg>
  )
}

