import React, { useEffect, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isFirebaseConfigured, initFirebase, getDbInstance } from '../services/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function NavBar() {
  const { user, logout, configured } = useAuth()
  const nav = useNavigate()
  const [photoURL, setPhotoURL] = useState(null)
  const [ initials, setInitials ] = useState('TA')

  useEffect(() => {
    let mounted = true
    async function loadProfile() {
      setPhotoURL(null)
      if (!user || !isFirebaseConfigured()) return
      try {
        initFirebase()
        const db = getDbInstance()
        const snap = await getDoc(doc(db, 'profile', user.uid))
        if (!mounted) return
        if (snap.exists()) {
          const data = snap.data()
          if (data?.photoURL) setPhotoURL(data.photoURL)
          const fn = (data?.firstName || '')
          const ln = (data?.lastName || '')
          const i = (fn ? fn[0] : '') + (ln ? ln[0] : '')
          setInitials((i || user.email?.[0] || 'TA').toUpperCase())
        } else {
          const i = (user.displayName || user.email || '').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase() || 'TA'
          setInitials(i)
        }
      } catch (err) {
        console.debug('NavBar: failed to load profile', err)
      }
    }
    loadProfile()
    return () => { mounted = false }
  }, [user])

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm p-4 rounded mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/dashboard/profile" className="block">
          {photoURL ? (
            <img src={photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 bg-indigo-500 rounded flex items-center justify-center font-bold">{initials}</div>
          )}
        </Link>
        <div>
          <div className="text-lg font-semibold">Thadsha Admin</div>
          <div className="text-xs text-slate-300">Content & Theme Manager</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NavLink to="/dashboard" className={({isActive}) => `text-sm px-3 py-1 rounded hover:bg-slate-800 ${isActive ? 'bg-slate-700 font-semibold ring-2 ring-offset-1 ring-indigo-500' : ''}`} end>Dashboard</NavLink>
        <NavLink to="/dashboard/profile" className={({isActive}) => `text-sm px-3 py-1 rounded hover:bg-slate-800 ${isActive ? 'bg-slate-700 font-semibold ring-2 ring-offset-1 ring-indigo-500' : ''}`}>Profile</NavLink>
        <NavLink to="/dashboard/skills" className={({isActive}) => `text-sm px-3 py-1 rounded hover:bg-slate-800 ${isActive ? 'bg-slate-700 font-semibold ring-2 ring-offset-1 ring-indigo-500' : ''}`}>Skills</NavLink>
        <NavLink to="/dashboard/projects" className={({isActive}) => `text-sm px-3 py-1 rounded hover:bg-slate-800 ${isActive ? 'bg-slate-700 font-semibold ring-2 ring-offset-1 ring-indigo-500' : ''}`}>Projects</NavLink>
        <NavLink to="/dashboard/theme" className={({isActive}) => `text-sm px-3 py-1 rounded hover:bg-slate-800 ${isActive ? 'bg-slate-700 font-semibold ring-2 ring-offset-1 ring-indigo-500' : ''}`}>Theme</NavLink>
        {user ? (
          <button
            onClick={async () => { await logout(); nav('/login') }}
            className="ml-2 bg-rose-500 px-3 py-1 rounded text-sm"
          >
            Sign out
          </button>
        ) : (
          <Link to="/login" className="ml-2 bg-indigo-500 px-3 py-1 rounded text-sm">Sign in</Link>
        )}
        {!configured && (
          <div className="ml-4 text-xs text-amber-200">Firebase not configured</div>
        )}
      </div>
    </div>
  )
}
