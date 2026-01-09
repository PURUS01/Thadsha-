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
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Projects" value={counts.projects} loading={loading} tone="indigo" delay="0">
          <Link to="/dashboard/projects" className="inline-flex items-center text-xs font-medium text-indigo-200 hover:text-white transition-colors group">
            Manage projects <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </Card>
        <Card title="Skills" value={counts.skills} loading={loading} tone="emerald" delay="100">
          <Link to="/dashboard/skills" className="inline-flex items-center text-xs font-medium text-emerald-200 hover:text-white transition-colors group">
            Edit skills <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </Card>
        <Card title="Technologies" value={counts.technologies} loading={loading} tone="violet" delay="200">
          <Link to="/dashboard/skills" className="inline-flex items-center text-xs font-medium text-violet-200 hover:text-white transition-colors group">
            Edit technologies <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </Card>
        <Card title="Profile" value={counts.profile} loading={loading} tone="amber" delay="300">
          <Link to="/dashboard/profile" className="inline-flex items-center text-xs font-medium text-amber-200 hover:text-white transition-colors group">
            Edit profile <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                Recent Projects
              </h4>
              <Link to="/dashboard/projects" className="text-xs font-medium text-slate-400 hover:text-white transition-colors">View All</Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl border border-dashed border-slate-700/50">
                <p>No projects yet.</p>
                <Link to="/dashboard/projects" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">Create your first project</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((p, i) => (
                  <div key={p.id} className="group flex items-center justify-between bg-slate-800/40 border border-white/5 p-4 rounded-xl hover:bg-slate-800/60 transition-all duration-300 hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                        {iconFolder()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">{p.name || 'Untitled project'}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">{p.url || p.description || 'No description'}</div>
                      </div>
                    </div>
                    <Link to={`/dashboard/projects`} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-white transition-all bg-white/5 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl sticky top-32">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-pink-500 rounded-full"></span>
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction to="/dashboard/profile" label="Edit Profile" color="hover:border-purple-500/50 hover:bg-purple-500/10">{iconUser()}</QuickAction>
              <QuickAction to="/dashboard/projects" label="Add Project" color="hover:border-blue-500/50 hover:bg-blue-500/10">{iconPlus()}</QuickAction>
              <QuickAction to="/dashboard/skills" label="Manage Skills" color="hover:border-emerald-500/50 hover:bg-emerald-500/10">{iconSpark()}</QuickAction>
              <QuickAction to="/dashboard/theme" label="Theme" color="hover:border-amber-500/50 hover:bg-amber-500/10">{iconPalette()}</QuickAction>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="bg-slate-900/40 rounded-xl p-4 border border-white/5">
                <div className="text-xs text-indigo-200 font-medium mb-1">PRO TIP</div>
                <p className="text-xs text-slate-400 leading-relaxed">Customize your portfolio theme in the Theme tab to match your personal brand.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, children, loading, tone = 'slate', delay }) {
  const tones = {
    indigo: 'from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 text-indigo-400',
    emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    violet: 'from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-400',
    amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-400',
    slate: 'from-slate-700/50 to-slate-800/50 border-slate-600/50 text-slate-300',
  }[tone]

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${tones} border backdrop-blur-sm shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10 group animate-slide-up`} style={{ animationDelay: `${delay}ms` }}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 group-hover:scale-110 duration-500">
        <div className="scale-150">{cardIconFor(title)}</div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium opacity-80 uppercase tracking-wider">{title}</div>
          <div className="p-2 rounded-lg bg-white/5 border border-white/5 backdrop-blur-md">
            {React.cloneElement(cardIconFor(title), { className: "w-5 h-5" })}
          </div>
        </div>

        <div className="text-4xl font-bold text-white mb-4 tracking-tight">
          {loading ? <span className="animate-pulse">...</span> : value}
        </div>

        <div className="pt-4 border-t border-white/5">
          {children}
        </div>
      </div>
    </div>
  )
}

function QuickAction({ to, children, label, color }) {
  return (
    <Link to={to} className={`flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/40 border border-white/5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group ${color}`}>
      <div className="w-10 h-10 mb-3 rounded-full bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-white/10 transition-colors">
        {React.cloneElement(children, { className: "w-5 h-5" })}
      </div>
      <div className="text-xs font-semibold text-slate-300 group-hover:text-white text-center">{label}</div>
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
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function iconPalette() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  )
}

function iconCube() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}

