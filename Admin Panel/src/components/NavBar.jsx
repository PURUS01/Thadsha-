import React, { useEffect, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isFirebaseConfigured, initFirebase, getDbInstance } from '../services/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function NavBar() {
  const { user, logout, configured } = useAuth()
  const nav = useNavigate()
  const [photoURL, setPhotoURL] = useState(null)
  const [initials, setInitials] = useState('TA')
  const [isOpen, setIsOpen] = useState(false)

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
          const i = (user.displayName || user.email || '').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase() || 'TA'
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
    <nav className="sticky top-4 z-50 mx-4 lg:mx-auto max-w-7xl mb-8">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo area */}
            <div className="flex items-center gap-4">
              <Link to="/dashboard/profile" className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur-[2px]"></div>
                {photoURL ? (
                  <img src={photoURL} alt="Profile" className="relative w-11 h-11 rounded-full object-cover border-2 border-slate-900" />
                ) : (
                  <div className="relative w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-slate-900">{initials}</div>
                )}
              </Link>
              <div className="hidden sm:block">
                <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Thadsha Admin</div>
                <div className="text-xs text-indigo-400 font-medium tracking-wide">Content & Theme Manager</div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {['Dashboard', 'Profile', 'Skills', 'Projects', 'Theme'].map((item) => (
                <NavLink
                  key={item}
                  to={`/dashboard${item === 'Dashboard' ? '' : '/' + item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                    ${isActive
                      ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'}`
                  }
                  end={item === 'Dashboard'}
                >
                  {item}
                </NavLink>
              ))}

              <div className="w-px h-6 bg-white/10 mx-2"></div>

              {user ? (
                <button
                  onClick={async () => { await logout(); nav('/login') }}
                  className="ml-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-rose-500/20"
                >
                  Sign out
                </button>
              ) : (
                <Link to="/login" className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">Sign in</Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Not Configured Warning */}
        {!configured && (
          <div className="bg-amber-500/10 border-t border-amber-500/20 px-4 py-1.5 text-center">
            <span className="text-xs font-medium text-amber-200 tracking-wide">⚠️ Firebase not configured</span>
          </div>
        )}

        {/* Mobile Menu */}
        <div className={`md:hidden bg-slate-900 border-t border-white/5 transition-all duration-300 ease-in-out origin-top ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="p-4 space-y-2">
            {['Dashboard', 'Profile', 'Skills', 'Projects', 'Theme'].map((item) => (
              <NavLink
                key={item}
                onClick={() => setIsOpen(false)}
                to={`/dashboard${item === 'Dashboard' ? '' : '/' + item.toLowerCase()}`}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 
                  ${isActive
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
                }
                end={item === 'Dashboard'}
              >
                {item}
              </NavLink>
            ))}
            {user ? (
              <button
                onClick={async () => { await logout(); nav('/login') }}
                className="w-full mt-4 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-4 py-3 rounded-lg text-sm font-medium transition-colors border border-rose-500/20 text-left"
              >
                Sign out
              </button>
            ) : (
              <Link to="/login" className="block w-full mt-4 bg-indigo-500 text-white px-4 py-3 rounded-lg text-sm font-medium text-center shadow-lg shadow-indigo-500/20">Sign in</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
