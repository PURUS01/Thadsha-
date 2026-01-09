import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, getDoc, updateDoc, deleteField } from 'firebase/firestore'
import { initFirebase, getDbInstance, isFirebaseConfigured } from '../services/firebase'
import { Toaster, toast } from 'react-hot-toast'

export default function SkillsManager(){
  const [skills, setSkills] = useState([])
  const [val, setVal] = useState('')
  const [editingSkillId, setEditingSkillId] = useState(null)
  const [technologies, setTechnologies] = useState([])
  const [techName, setTechName] = useState('')
  const [editingTechId, setEditingTechId] = useState(null)

  const fetch = async () => {
    if (!isFirebaseConfigured()) return
    initFirebase()
    const db = getDbInstance()
    const ref = doc(db, 'skills_and_technologies', 'skills')
    const snap = await getDoc(ref)
    const items = snap.exists() && snap.data().items ? Object.entries(snap.data().items).map(([id, data]) => ({ id, ...data })) : []
    setSkills(items)
  }

  useEffect(()=>{ fetch(); fetchTechs() }, [])

  const fetchTechs = async () => {
    if (!isFirebaseConfigured()) return
    initFirebase()
    const db = getDbInstance()
    const ref = doc(db, 'skills_and_technologies', 'technologies')
    const snap = await getDoc(ref)
    const items = snap.exists() && snap.data().items ? Object.entries(snap.data().items).map(([id, data]) => ({ id, ...data })) : []
    setTechnologies(items)
  }

  const add = async ()=>{
    if(!val) return
    if (!isFirebaseConfigured()) { toast.error('Firebase not configured'); return }
    const db = getDbInstance()
    const ref = doc(db, 'skills_and_technologies', 'skills')
    // ensure document exists
    await setDoc(ref, { items: {} }, { merge: true })
    const id = editingSkillId || `${Date.now()}`
    const updates = {}
    updates[`items.${id}`] = { name: val }
    await updateDoc(ref, updates)
    toast.success(editingSkillId ? 'Updated' : 'Added')
    setVal('')
    setEditingSkillId(null)
    fetch()
  }

  const remove = async (id)=>{
    if (!isFirebaseConfigured()) { toast.error('Firebase not configured'); return }
    const db = getDbInstance()
    const ref = doc(db, 'skills_and_technologies', 'skills')
    const updates = {}
    updates[`items.${id}`] = deleteField()
    await updateDoc(ref, updates)
    toast.success('Deleted')
    fetch()
  }

  const editSkill = (item) => {
    setEditingSkillId(item.id)
    setVal(item.name || '')
  }

  const addTech = async () => {
    if (!techName) return
    if (!isFirebaseConfigured()) { toast.error('Firebase not configured'); return }
    const db = getDbInstance()
    const ref = doc(db, 'skills_and_technologies', 'technologies')
    await setDoc(ref, { items: {} }, { merge: true })
    const id = editingTechId || `${Date.now()}`
    const updates = {}
    updates[`items.${id}`] = { name: techName }
    await updateDoc(ref, updates)
    toast.success(editingTechId ? 'Updated' : 'Added')
    setTechName('')
    setEditingTechId(null)
    fetchTechs()
  }

  const removeTech = async (id) => {
    if (!isFirebaseConfigured()) { toast.error('Firebase not configured'); return }
    const db = getDbInstance()
    const ref = doc(db, 'skills_and_technologies', 'technologies')
    const updates = {}
    updates[`items.${id}`] = deleteField()
    await updateDoc(ref, updates)
    toast.success('Deleted')
    fetchTechs()
  }

  const editTech = (item) => {
    setEditingTechId(item.id)
    setTechName(item.name || '')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster />
      <NavBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-900/40 p-4 rounded">
          <h3 className="font-semibold mb-2">Skills</h3>
            <div className="mb-2 text-sm text-slate-300">Add skills. You can edit or delete entries.</div>
            <div className="flex gap-2">
            <input className="p-2 rounded bg-slate-700 flex-1" value={val} onChange={e=>setVal(e.target.value)} placeholder="New skill" />
            <button onClick={add} className="bg-indigo-500 px-3 rounded">{editingSkillId ? 'Update' : 'Add'}</button>
          </div>
          <ul className="mt-4 space-y-2">
            {skills.map(s=> (
              <li key={s.id} className="flex justify-between bg-slate-800 p-3 rounded">
                <div>{s.name}</div>
                <div className="flex gap-2">
                  <button onClick={()=>editSkill(s)} className="bg-amber-500 px-2 rounded text-sm">Edit</button>
                  <button onClick={()=>remove(s.id)} className="bg-rose-500 px-2 rounded text-sm">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/40 p-4 rounded">
          <h3 className="font-semibold mb-2">Technologies</h3>
          <div className="mb-2 text-sm text-slate-300">Add technologies. You can edit or delete entries.</div>
          <div className="flex gap-2 mb-3">
            <input className="p-2 rounded bg-slate-700 flex-1" value={techName} onChange={e=>setTechName(e.target.value)} placeholder="Technology name" />
            <button onClick={addTech} className="bg-indigo-500 px-3 rounded">{editingTechId ? 'Update' : 'Add'}</button>
          </div>

          <ul className="mt-4 space-y-2">
            {technologies.map(t=> (
              <li key={t.id} className="flex justify-between bg-slate-800 p-3 rounded">
                <div>
                  <div className="font-medium">{t.name}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>editTech(t)} className="bg-amber-500 px-2 rounded text-sm">Edit</button>
                  <button onClick={()=>removeTech(t.id)} className="bg-rose-500 px-2 rounded text-sm">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
