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
  const [resumeFile, setResumeFile] = useState(null)
  const [resumePreview, setResumePreview] = useState(null)
  const [resumeName, setResumeName] = useState('')

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
        setResumePreview(data.resumeURL || null)
        setResumeName(data.resumeName || '')
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
    setResumeFile(null)
    setResumePreview(null)
    setResumeName('')
  }

  const removeSelectedImage = () => {
    if (photoPreview && photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview)
    }
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const [loading, setLoading] = useState(false)

  const save = async () => {
    if (loading) return
    setLoading(true)
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

      // upload resume to Cloudinary (if provided)
      let uploadedResume = null
      if (resumeFile) {
        try {
          uploadedResume = await uploadToCloudinary(resumeFile)
          if (uploadedResume && uploadedResume.secure_url) {
            payload.resumeURL = uploadedResume.secure_url
            payload.resumeName = resumeFile.name
          }
        } catch (err) {
          console.warn('Resume upload failed', err)
          toast.error('Resume upload failed')
        }
      }

      // try to init Firebase and persist
      const init = initFirebase()
      if (!init) {
        // Firebase not configured: surface the Cloudinary URL so user can copy/use it
        if (payload.photoURL) {
          toast.success('Image uploaded to Cloudinary but Firebase not configured — URL copied to console')
        } else {
          toast.error('Firebase not configured. Cannot save profile.')
        }
        return
      }

      const db = getDbInstance()
      await setDoc(doc(db, 'profile', id), payload, { merge: true })
      toast.success('Profile saved')
      clearForm()
      fetch()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save profile')
    } finally {
      setLoading(false)
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <NavBar />

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        {/* Left Side: Header & Info */}
        <div className="lg:w-1/3 space-y-6">
          <div className="sticky top-32">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Profile Manager</h1>
            <p className="text-slate-400 text-sm mb-6">
              Update your personal information and biography. This information will be displayed on your portfolio's main landing area.
            </p>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-indigo-500 overflow-hidden flex items-center justify-center">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-slate-600">
                      {firstName?.[0]}{lastName?.[0]}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{firstName || 'User'} {lastName || ''}</div>
                  <div className="text-indigo-400 text-sm">{position || 'No position set'}</div>
                </div>
              </div>



              <div className="mt-6 flex gap-3">
                <button onClick={save} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : 'Save Changes'}
                </button>

              </div>

              <div className="mt-4 flex gap-3">
                <button onClick={clearForm} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg font-medium transition-colors text-sm">
                  Clear
                </button>
                <button onClick={remove} className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 py-2 rounded-lg font-medium transition-colors text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
            Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">First Name</label>
              <input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="e.g. John"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Last Name</label>
              <input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="e.g. Doe"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Position / Title</label>
              <input
                value={position}
                onChange={e => setPosition(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="e.g. Senior Full Stack Developer"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">About Me</label>
              <textarea
                value={about}
                onChange={e => setAbout(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 resize-none h-32"
                placeholder="Write a brief professional biography..."
                rows={4}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Address / Location</label>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="contact@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Mobile Number</label>
              <input
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Profile Image - Responsive Fix */}
            <div className="md:col-span-2 pt-4 border-t border-white/5 mt-4">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-3">Profile Image</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-600/50">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 bg-slate-700/50 rounded-full overflow-hidden flex items-center justify-center border-2 border-slate-600 group-hover:border-indigo-500 transition-colors shadow-lg">
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="object-cover w-full h-full" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  {photoPreview && (
                    <button type="button" onClick={removeSelectedImage} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1.5 shadow-lg hover:bg-rose-600 transition-colors z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="flex-1 w-full">
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
                    className="block w-full text-sm text-slate-400
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-500 file:text-white
                        hover:file:bg-indigo-600
                        cursor-pointer transition-all
                      "
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Supports JPG, PNG and WEBP. Recommended size: 500x500px.
                  </p>
                </div>
              </div>
            </div>

            {/* Resume Upload - New Section */}
            <div className="md:col-span-2 pt-4 border-t border-white/5 mt-4">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-3">Curriculum Vitae (PDF)</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-600/50">
                <div className="relative group shrink-0">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center border-2 border-slate-600 group-hover:border-indigo-500 transition-colors shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l4 4a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      setResumeFile(f)
                      setResumeName(f.name)
                    }}
                    className="block w-full text-sm text-slate-400
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-500 file:text-white
                        hover:file:bg-indigo-600
                        cursor-pointer transition-all
                      "
                  />
                  {resumePreview && !resumeFile && (
                    <div className="mt-2 text-sm text-indigo-400 flex items-center gap-2">
                      <span className="text-slate-500">Current:</span>
                      <a href={resumePreview} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-300 transition-colors flex items-center gap-1">
                        {resumeName || 'View PDF'}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                  {resumeFile && (
                    <div className="mt-2 text-xs font-medium text-emerald-400">
                      Selected: {resumeFile.name}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    Upload your CV/Resume in PDF format.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

