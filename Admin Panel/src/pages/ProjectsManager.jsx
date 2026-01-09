import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { initFirebase, getDbInstance, isFirebaseConfigured } from '../services/firebase'
import { uploadToCloudinary } from '../services/cloudinary'
import { Toaster, toast } from 'react-hot-toast'

export default function ProjectsManager() {
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

  useEffect(() => { fetch() }, [])

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

  const remove = async (id) => {
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <NavBar />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">Projects Manager</h1>
          <div className="text-sm text-slate-400">Manage your portfolio showcase</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl sticky top-32">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                {editingId ? 'Edit Project' : 'Create Project'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Project Name</label>
                  <input
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. E-Commerce Platform"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Description</label>
                  <textarea
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 resize-none h-32"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Brief description of the project..."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Project URL</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </span>
                    <input
                      className="w-full pl-12 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Project Image</label>
                  <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-600/50 hover:bg-slate-800/50 transition-colors">
                    <div className="relative group">
                      <div className="w-24 h-24 bg-slate-700/50 rounded-lg overflow-hidden flex items-center justify-center border border-white/5 shadow-inner">
                        {photoPreview ? (
                          <img src={photoPreview} alt="preview" className="object-cover w-full h-full" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      {photoPreview && (
                        <button type="button" onClick={removeSelectedImage} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg hover:bg-rose-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const f = e.target.files?.[0]
                          if (!f) return
                          if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
                          setPhotoFile(f)
                          setPhotoPreview(URL.createObjectURL(f))
                        }}
                        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 text-slate-400 w-full"
                      />
                      <p className="text-xs text-slate-500 mt-2">Recommended size: 1200x630px. Max 5MB.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={save} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]">
                    {editingId ? 'Update Project' : 'Create Project'}
                  </button>
                  <button onClick={clearForm} className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700/50">
                  <div className="inline-block p-4 rounded-full bg-slate-800/50 mb-4 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-300">No projects yet</h3>
                  <p className="text-slate-500 text-sm mt-1">Fill out the form to add your first project.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {projects.map(p => (
                    <div key={p.id} className="group bg-slate-900/50 backdrop-blur-md border border-white/5 p-4 rounded-xl shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-500/30 transition-all flex gap-4 animate-slide-up">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                        {p.imageURL ? (
                          <img src={p.imageURL} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-1 flex flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-lg text-slate-200 group-hover:text-indigo-400 transition-colors truncate">{p.name}</h4>
                            <p className="text-sm text-slate-400 line-clamp-2 mt-1">{p.description}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => populateForEdit(p)} className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors" title="Edit">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button onClick={() => remove(p.id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="mt-auto pt-3">
                          {p.url && (
                            <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {p.url.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
