import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, getDoc, updateDoc, deleteField } from 'firebase/firestore'
import { initFirebase, getDbInstance, isFirebaseConfigured } from '../services/firebase'
import { Toaster, toast } from 'react-hot-toast'

export default function SkillsManager() {
  const [skills, setSkills] = useState([])
  const [val, setVal] = useState('')
  const [editingSkillId, setEditingSkillId] = useState(null)
  const [technologies, setTechnologies] = useState([])
  const [techName, setTechName] = useState('')
  const [editingTechId, setEditingTechId] = useState(null)

  // Fetch Skills from 'skills' collection
  const fetch = async () => {
    if (!isFirebaseConfigured()) return
    initFirebase()
    const db = getDbInstance()
    const snap = await getDocs(collection(db, 'skills'))
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    setSkills(items)
  }

  // Fetch Technologies from 'technologies' collection
  const fetchTechs = async () => {
    if (!isFirebaseConfigured()) return
    initFirebase()
    const db = getDbInstance()
    const snap = await getDocs(collection(db, 'technologies'))
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    setTechnologies(items)
  }

  useEffect(() => { fetch(); fetchTechs() }, [])

  const [loading, setLoading] = useState(false)

  // --- Skills Logic ---
  const add = async () => {
    if (!val) return
    if (!isFirebaseConfigured()) { toast.error('Firebase not configured'); return }
    setLoading(true)
    try {
      const db = getDbInstance()
      if (editingSkillId) {
        await setDoc(doc(db, 'skills', editingSkillId), { name: val }, { merge: true })
        toast.success('Updated Skill')
      } else {
        await addDoc(collection(db, 'skills'), { name: val, createdAt: Date.now() })
        toast.success('Added Skill')
      }
      setVal('')
      setEditingSkillId(null)
      fetch()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save skill')
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    if (!isFirebaseConfigured()) { toast.error('Firebase not configured'); return }
    if (loading) return
    setLoading(true)
    try {
      const db = getDbInstance()
      await deleteDoc(doc(db, 'skills', id))
      toast.success('Deleted Skill')
      fetch()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  const editSkill = (item) => {
    setEditingSkillId(item.id)
    setVal(item.name || '')
  }

  // --- Technologies Logic ---
  const addTech = async () => {
    if (!techName) return
    if (!isFirebaseConfigured()) { toast.error('Firebase not configured'); return }
    setLoading(true)
    try {
      const db = getDbInstance()
      if (editingTechId) {
        await setDoc(doc(db, 'technologies', editingTechId), { name: techName }, { merge: true })
        toast.success('Updated Technology')
      } else {
        await addDoc(collection(db, 'technologies'), { name: techName, createdAt: Date.now() })
        toast.success('Added Technology')
      }
      setTechName('')
      setEditingTechId(null)
      fetchTechs()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save tech')
    } finally {
      setLoading(false)
    }
  }

  const removeTech = async (id) => {
    if (!isFirebaseConfigured()) { toast.error('Firebase not configured'); return }
    if (loading) return
    setLoading(true)
    try {
      const db = getDbInstance()
      await deleteDoc(doc(db, 'technologies', id))
      toast.success('Deleted Technology')
      fetchTechs()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  const editTech = (item) => {
    setEditingTechId(item.id)
    setTechName(item.name || '')
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <NavBar />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column: Skills */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
              Skills (Core)
            </h3>
            <span className="text-xs text-slate-400 px-2 py-1 bg-white/5 rounded-full border border-white/5">{skills.length} Items</span>
          </div>

          <div className="flex gap-2 mb-6">
            <input
              className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-600 disabled:opacity-50"
              value={val}
              onChange={e => setVal(e.target.value)}
              placeholder="e.g. React.js, Node.js"
              disabled={loading}
            />
            <button
              onClick={add}
              disabled={loading || !val}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (val || editingSkillId) ? <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full mr-2" /> : null}
              {editingSkillId ? 'Update' : 'Add'}
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {skills.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm border-2 border-dashed border-slate-800 rounded-xl">
                No skills added yet.
              </div>
            )}
            {skills.map(s => (
              <div key={s.id} className="group flex items-center justify-between bg-slate-800/40 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-all hover:bg-slate-800/60">
                <div className="font-medium text-slate-200 ml-2">{s.name}</div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => editSkill(s)} className="p-2 text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => remove(s.id)} className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Technologies */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
              Tools & Technologies
            </h3>
            <span className="text-xs text-slate-400 px-2 py-1 bg-white/5 rounded-full border border-white/5">{technologies.length} Items</span>
          </div>

          <div className="flex gap-2 mb-6">
            <input
              className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600 disabled:opacity-50"
              value={techName}
              onChange={e => setTechName(e.target.value)}
              placeholder="e.g. VS Code, Git, Figma"
              disabled={loading}
            />
            <button
              onClick={addTech}
              disabled={loading || !techName}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-xl font-medium transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (techName || editingTechId) ? <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full mr-2" /> : null}
              {editingTechId ? 'Update' : 'Add'}
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {technologies.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm border-2 border-dashed border-slate-800 rounded-xl">
                No technologies added yet.
              </div>
            )}
            {technologies.map(t => (
              <div key={t.id} className="group flex items-center justify-between bg-slate-800/40 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-all hover:bg-slate-800/60">
                <div className="font-medium text-slate-200 ml-2">{t.name}</div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => editTech(t)} className="p-2 text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => removeTech(t.id)} className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
