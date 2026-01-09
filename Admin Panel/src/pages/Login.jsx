import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, configured } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      nav('/dashboard')
    } catch (err) {
      // login already toasts
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Toaster />
      <form onSubmit={submit} className="w-full max-w-md bg-slate-800/50 p-8 rounded">
        <h2 className="text-2xl font-bold mb-4">Admin Sign in</h2>
        {!configured && (
          <div className="mb-4 p-3 bg-amber-600/10 border border-amber-500 rounded text-amber-200 text-sm">Firebase not configured — login disabled. Fill .env variables to enable authentication.</div>
        )}
        <label className="block text-sm">Email</label>
        <input className="w-full p-2 rounded mb-3 bg-slate-700" value={email} onChange={e => setEmail(e.target.value)} disabled={!configured} />
        <label className="block text-sm">Password</label>
        <input type="password" className="w-full p-2 rounded mb-4 bg-slate-700" value={password} onChange={e => setPassword(e.target.value)} disabled={!configured} />
        <button className="w-full bg-indigo-500 p-2 rounded" disabled={!configured}>Sign in</button>
      </form>
    </div>
  )
}
