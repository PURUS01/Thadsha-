import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { initFirebase, getDbInstance, isFirebaseConfigured } from '../services/firebase'
import { uploadToCloudinary } from '../services/cloudinary'
import { toast, Toaster } from 'react-hot-toast'

export default function ProfileManager() {
  const { user } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [position, setPosition] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [dob, setDob] = useState('')
  const [about, setAbout] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [docId, setDocId] = useState('main')

  const fetch = async () => {
    if (!isFirebaseConfigured()) return
    initFirebase()
    const db = getDbInstance()
    const id = user?.uid || 'main'
    setDocId(id)
    try {
      const snap = await getDoc(doc(db, 'profile', id))
      if (snap.exists()) {
        const data = snap.data()
        setFirstName(data.firstName || '')
        setLastName(data.lastName || '')
        setPosition(data.position || '')
        setAddress(data.address || '')
        setEmail(data.email || '')
        setMobile(data.mobile || '')
        setDob(data.dob || '')
        setAbout(data.about || '')
        setPhotoPreview(data.photoURL || null)
      }
    } catch (err) {
      console.error('Failed to fetch profile', err)
    }
  }

  useEffect(() => { fetch() }, [user])

  const clearForm = () => {
    setFirstName('')
    setLastName('')
    setPosition('')
    setAddress('')
    setEmail('')
    setMobile('')
    setDob('')
    setAbout('')
    if (photoPreview && photoPreview.startsWith('blob:')) { URL.revokeObjectURL(photoPreview) }
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const removeSelectedImage = () => {
    if (photoPreview && photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview)
    }
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const save = async () => {
    try {
      const id = docId || (user?.uid || 'main')
      const payload = { firstName, lastName, position, address, email, mobile, dob, about }

      // upload image to Cloudinary first (if provided)
      let uploaded = null
      if (photoFile) {
        try {
          uploaded = await uploadToCloudinary(photoFile)
          if (uploaded && uploaded.secure_url) payload.photoURL = uploaded.secure_url
        } catch (err) {
          console.warn('Cloudinary upload failed', err)
          toast.error('Image upload failed')
        }
      }

      // try to init Firebase and persist
      const init = initFirebase()
      if (!init) {
        // Firebase not configured: surface the Cloudinary URL so user can copy/use it
        if (payload.photoURL) {
          toast.success('Image uploaded to Cloudinary but Firebase not configured — URL copied to console')
          console.log('Cloudinary image URL (not saved to Firestore):', payload.photoURL)
        } else {
          toast.error('Firebase not configured. Cannot save profile.')
        }
        return
      }

      const db = getDbInstance()
      await setDoc(doc(db, 'profile', id), payload)
      toast.success('Profile saved')
      clearForm()
      fetch()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save profile')
    }
  }

  const remove = async () => {
    if (!isFirebaseConfigured()) {
      toast.error('Firebase not configured. Cannot delete.')
      return
    }
    try {
      const db = getDbInstance()
      await deleteDoc(doc(db, 'profile', docId))
      toast.success('Deleted')
      clearForm()
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
        <h3 className="font-semibold mb-2">Profile</h3>
        <div className="text-sm text-slate-300 mb-3">This edits a single profile document at <span className="font-mono">profile/{docId}</span></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={firstName} onChange={e=>setFirstName(e.target.value)} className="p-2 rounded bg-slate-700" placeholder="First name" />
          <input value={lastName} onChange={e=>setLastName(e.target.value)} className="p-2 rounded bg-slate-700" placeholder="Last name" />
          <input value={position} onChange={e=>setPosition(e.target.value)} className="p-2 rounded bg-slate-700 col-span-2" placeholder="Position / Title" />
          <input value={address} onChange={e=>setAddress(e.target.value)} className="p-2 rounded bg-slate-700 col-span-2" placeholder="Address" />
          <textarea value={about} onChange={e=>setAbout(e.target.value)} className="p-2 rounded bg-slate-700 col-span-2" placeholder="About me" rows={4} />
          <input value={email} onChange={e=>setEmail(e.target.value)} className="p-2 rounded bg-slate-700" placeholder="Email address" />
          <input value={mobile} onChange={e=>setMobile(e.target.value)} className="p-2 rounded bg-slate-700" placeholder="Mobile number" />
          <input type="date" value={dob} onChange={e=>setDob(e.target.value)} className="p-2 rounded bg-slate-700" />

          <div className="col-span-1 md:col-span-2 flex gap-3 items-center">
            <div>
              <label className="block text-sm mb-1">Profile Image</label>
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
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={save} className="bg-indigo-500 px-4 py-2 rounded">Save</button>
          <button onClick={clearForm} className="bg-slate-700 px-4 py-2 rounded">Clear</button>
          <button onClick={remove} className="bg-rose-500 px-4 py-2 rounded">Delete</button>
        </div>
      </div>
    </div>
  )
}

