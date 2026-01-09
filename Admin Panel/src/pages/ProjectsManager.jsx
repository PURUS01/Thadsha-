import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { initFirebase, getDbInstance, isFirebaseConfigured } from '../services/firebase'
import { uploadToCloudinary } from '../services/cloudinary'
import { Toaster, toast } from 'react-hot-toast'

export default function ProjectsManager(){
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const fetch = async () => {
    if (!isFirebaseConfigured()) return
    initFirebase()
    const db = getDbInstance()
    const snap = await getDocs(collection(db, 'projects'))
    setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(()=>{ fetch() }, [])

  const clearForm = () => {
    setName('')
    setDescription('')
    setUrl('')
    setEditingId(null)
    if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const removeSelectedImage = () => {
    if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const populateForEdit = (item) => {
    setEditingId(item.id)
    setName(item.name || '')
    setDescription(item.description || '')
    setUrl(item.url || '')
    setPhotoPreview(item.imageURL || null)
  }

  const save = async () => {
    if (!name) { toast.error('Name is required'); return }
    if (!isFirebaseConfigured()) { toast.error('Firebase not configured'); return }
    try {
      const id = editingId || `${Date.now()}`
      const payload = { name, description, url }

      // upload to Cloudinary if a new file is selected
      let uploaded = null
      if (photoFile) {
        try {
          uploaded = await uploadToCloudinary(photoFile)
          if (uploaded && uploaded.secure_url) payload.imageURL = uploaded.secure_url
        } catch (err) {
          console.warn('Cloudinary upload failed', err)
          toast.error('Image upload failed')
        }
      } else {
        // when editing and no new file, keep existing image URL if present in preview
        if (editingId && photoPreview && !photoPreview.startsWith('blob:')) {
          payload.imageURL = photoPreview
        }
      }

      // try to init Firebase; if not configured surface cloudinary url instead
      const init = initFirebase()
      if (!init) {
        if (payload.imageURL) {
          toast.success('Image uploaded to Cloudinary but Firebase not configured — URL logged to console')
          console.log('Cloudinary image URL (not saved to Firestore):', payload.imageURL)
        } else {
          toast.error('Firebase not configured. Cannot save project.')
        }
        return
      }

      const db = getDbInstance()
      await setDoc(doc(db, 'projects', id), payload)
      toast.success(editingId ? 'Updated' : 'Created')
      clearForm()
      fetch()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save project')
    }
  }

  const remove = async (id)=>{
    if (!isFirebaseConfigured()) { toast.error('Firebase not configured'); return }
    try {
      const db = getDbInstance()
      await deleteDoc(doc(db, 'projects', id))
      toast.success('Deleted')
      fetch()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster />
      <NavBar />
      <div className="bg-slate-900/40 p-4 rounded mt-6">
        <h3 className="font-semibold mb-2">Projects</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2 text-sm text-slate-300">Create or edit a project</div>
            <input className="p-2 rounded bg-slate-700 w-full mb-2" value={name} onChange={e=>setName(e.target.value)} placeholder="Project name" />
            <textarea className="p-2 rounded bg-slate-700 w-full mb-2" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Project description" rows={4} />
            <input className="p-2 rounded bg-slate-700 w-full mb-2" value={url} onChange={e=>setUrl(e.target.value)} placeholder="Project URL" />

            <div className="flex items-center gap-3">
              <div>
                <label className="block text-sm mb-1">Project Image</label>
                <input type="file" accept="image/*" onChange={e=>{
                  const f = e.target.files?.[0]
                  if (!f) return
                  if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
                  setPhotoFile(f)
                  setPhotoPreview(URL.createObjectURL(f))
                }} className="text-sm" />
              </div>
              <div className="relative">
                <div className="w-24 h-24 bg-slate-700 rounded overflow-hidden flex items-center justify-center">
                  {photoPreview ? (
                    <img src={photoPreview} alt="preview" className="object-cover w-full h-full" />
                  ) : (
                    <div className="text-xs text-slate-400">No image</div>
                  )}
                </div>
                {photoPreview && (
                  <button type="button" onClick={removeSelectedImage} title="Remove selected image" className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={save} className="bg-indigo-500 px-4 py-2 rounded">{editingId ? 'Update' : 'Create'}</button>
              <button onClick={clearForm} className="bg-slate-700 px-4 py-2 rounded">Clear</button>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Saved Projects</h4>
            <ul className="space-y-3">
              {projects.map(p => (
                <li key={p.id} className="bg-slate-800 p-3 rounded flex gap-3">
                  <div className="w-20 h-20 bg-slate-700 rounded overflow-hidden">
                    {p.imageURL ? <img src={p.imageURL} className="w-full h-full object-cover" alt={p.name} /> : <div className="text-xs text-slate-400 p-2">No image</div>}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-slate-300">{p.description}</div>
                    {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-400">Open</a>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={()=>populateForEdit(p)} className="bg-amber-500 px-3 py-1 rounded text-sm">Edit</button>
                    <button onClick={()=>remove(p.id)} className="bg-rose-500 px-3 py-1 rounded text-sm">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
