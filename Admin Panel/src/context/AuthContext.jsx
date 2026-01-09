import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { initFirebase, getAuthInstance, isFirebaseConfigured } from '../services/firebase'
import { toast } from 'react-hot-toast'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [configured] = useState(() => isFirebaseConfigured())

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }
    initFirebase()
    const a = getAuthInstance()
    const unsub = onAuthStateChanged(a, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [configured])

  const login = async (email, password) => {
    if (!configured) {
      toast.error('Firebase not configured. Cannot sign in here.')
      throw new Error('Firebase not configured')
    }
    const a = getAuthInstance()
    try {
      await signInWithEmailAndPassword(a, email, password)
      toast.success('Signed in')
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const logout = async () => {
    if (!configured) {
      toast('Not signed in')
      return
    }
    const a = getAuthInstance()
    await signOut(a)
    toast.success('Signed out')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, configured }}>
      {children}
    </AuthContext.Provider>
  )
}
