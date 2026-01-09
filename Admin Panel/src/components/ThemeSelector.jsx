import React, { useEffect, useState } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { initFirebase, getDbInstance, isFirebaseConfigured } from '../services/firebase'
import { toast } from 'react-hot-toast'

// Palettes provided by the user — includes hex values and a brief description
const PALETTES = [
  {
    id: 'soft-pastel',
    label: 'Soft Pastel + White',
    desc: 'Clean, elegant — recommended',
    background: '#F9FAFB',
    primary: '#6366F1',
    secondary: '#EC4899',
    text: '#111827',
    accent: '#22C55E'
  },
  {
    id: 'dark-neon',
    label: 'Dark + Neon Accent',
    desc: 'Bold tech look',
    background: '#0F172A',
    primary: '#38BDF8',
    accent: '#A855F7',
    text: '#E5E7EB'
  },
  {
    id: 'beige-rose',
    label: 'Beige + Rose',
    desc: 'Elegant & friendly',
    background: '#FAF7F2',
    primary: '#E11D48',
    secondary: '#374151',
    text: '#1F2937'
  },
  {
    id: 'fresh-minimal',
    label: 'Fresh & Minimal',
    desc: 'Green + White',
    background: '#FFFFFF',
    primary: '#10B981',
    secondary: '#6B7280',
    accent: '#F59E0B',
    text: '#111827'
  },
  // Additional palettes
  {
    id: 'midnight-sun',
    label: 'Midnight Sun',
    desc: 'Deep blues with warm highlights',
    background: '#071023',
    primary: '#0EA5E9',
    secondary: '#F97316',
    accent: '#FDE68A',
    text: '#E6EEF6'
  },
  {
    id: 'oceanic',
    label: 'Oceanic Breeze',
    desc: 'Calm blues and sea greens',
    background: '#F0FBFF',
    primary: '#06B6D4',
    secondary: '#065F46',
    accent: '#7DD3FC',
    text: '#06313B'
  },
  {
    id: 'sunset',
    label: 'Sunset Gradient',
    desc: 'Warm sunset tones',
    background: '#FFF7ED',
    primary: '#FB7185',
    secondary: '#F59E0B',
    accent: '#F97316',
    text: '#3F3F46'
  },
  {
    id: 'vintage',
    label: 'Vintage Earth',
    desc: 'Muted earth palette',
    background: '#F6F1EC',
    primary: '#92400E',
    secondary: '#6B7280',
    accent: '#C084FC',
    text: '#2B2B2B'
  },
  {
    id: 'monochrome',
    label: 'Monochrome Professional',
    desc: 'Sleek grayscale',
    background: '#FFFFFF',
    primary: '#111827',
    secondary: '#6B7280',
    accent: '#CBD5E1',
    text: '#0F172A'
  },
  {
    id: 'corporate-blue',
    label: 'Corporate Blue',
    desc: 'Trusted and clean',
    background: '#F8FAFF',
    primary: '#2563EB',
    secondary: '#1E293B',
    accent: '#60A5FA',
    text: '#0F172A'
  },
  {
    id: 'modern-teal',
    label: 'Modern Teal',
    desc: 'Contemporary teal and charcoal',
    background: '#F8FFFD',
    primary: '#0891B2',
    secondary: '#0F172A',
    accent: '#06B6D4',
    text: '#04202E'
  }
]

export default function ThemeSelector() {
  const [active, setActive] = useState(PALETTES[0].id)
  const [loading, setLoading] = useState(true)
  const [editablePalettes, setEditablePalettes] = useState(PALETTES.map(p => ({ ...p, editing: false })))

  useEffect(() => {
    if (!isFirebaseConfigured()) { setLoading(false); return }
    initFirebase()
    const db = getDbInstance()
    const d = doc(db, 'themes', 'current')
    let unsub
    try {
      unsub = onSnapshot(d, (snap) => {
        if (snap.exists()) {
          const data = snap.data()
          if (data?.paletteId) setActive(data.paletteId)
          else if (data?.palette && data.palette.id) setActive(data.palette.id)
        }
        setLoading(false)
      }, (err) => {
        console.warn('Failed to listen to current theme', err)
        setLoading(false)
      })
    } catch (err) {
      console.warn('Failed to initialize theme listener', err)
      setLoading(false)
    }
    return () => { if (typeof unsub === 'function') unsub() }
  }, [])

  // Set the currently active theme only in 'themes/current' (do not store other themes)
  const save = async (id) => {
    const palette = editablePalettes.find(p => p.id === id) || PALETTES.find(p => p.id === id)
    if (!palette) return
    setActive(id)
    if (!isFirebaseConfigured()) {
      toast.success(`${palette.label} applied locally (Firebase not configured)`)
      return
    }
    try {
      const db = getDbInstance()
      // only update the current theme document with paletteId and full palette details
      await setDoc(doc(db, 'themes', 'current'), { paletteId: id, palette }, { merge: true })
      toast.success('Theme set as current')
    } catch (err) {
      console.error('Failed to set current palette', err)
      toast.error('Failed to update current theme')
    }
  }

  const toggleEdit = (id) => {
    setEditablePalettes(prev => prev.map(p => p.id === id ? { ...p, editing: !p.editing } : p))
  }

  const updatePaletteField = (id, field, value) => {
    setEditablePalettes(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const resetPalette = (id) => {
    const base = PALETTES.find(p => p.id === id)
    if (!base) return
    setEditablePalettes(prev => prev.map(p => p.id === id ? { ...base, id: p.id, editing: true } : p))
    toast.info('Palette reset to initial values')
  }

  return (
    <div className="bg-slate-900/40 p-4 rounded max-h-[60vh] overflow-auto pr-2">
      <h3 className="font-semibold mb-2">Theme Palette</h3>
      {loading ? (
        <div className="text-sm text-slate-300">Loading themes...</div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {editablePalettes.map(p => (
              <div
                key={p.id}
                className={`p-3 rounded w-full text-sm text-left border ${active===p.id? 'ring-2 ring-offset-2 ring-indigo-400 border-indigo-500' : 'border-transparent'} bg-slate-800/30`}
              >
                <div className="h-12 rounded overflow-hidden mb-2 flex items-stretch">
                  <div className="flex-1 min-w-0" style={{ background: p.background }} />
                  <div style={{ width: 56, background: p.primary }} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium truncate">{p.label}</div>
                  <div className="flex items-center gap-2">
                    {p.editing && (
                      <button onClick={() => resetPalette(p.id)} className="text-xs text-amber-200 px-2 py-0.5 rounded hover:bg-slate-800">Reset</button>
                    )}
                    <button onClick={() => toggleEdit(p.id)} className="text-xs text-slate-300 px-2 py-0.5 rounded hover:bg-slate-800">{p.editing ? 'Done' : 'Edit'}</button>
                    {active === p.id && (
                      <div className="absolute -top-2 -right-2 bg-emerald-500 text-xs px-2 py-0.5 rounded-full text-black font-semibold">✓</div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-300 truncate">{p.desc}</div>

                {p.editing && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <input value={p.label} onChange={e=>updatePaletteField(p.id,'label',e.target.value)} className="p-1 rounded bg-slate-700" placeholder="Label" />
                    <input value={p.desc} onChange={e=>updatePaletteField(p.id,'desc',e.target.value)} className="p-1 rounded bg-slate-700" placeholder="Short description" />
                    <div className="flex items-center gap-2">
                      <input type="color" value={p.background} onChange={e=>updatePaletteField(p.id,'background',e.target.value)} className="w-10 h-8 p-0" />
                      <input value={p.background} onChange={e=>updatePaletteField(p.id,'background',e.target.value)} className="p-1 rounded bg-slate-700 flex-1" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="color" value={p.primary} onChange={e=>updatePaletteField(p.id,'primary',e.target.value)} className="w-10 h-8 p-0" />
                      <input value={p.primary} onChange={e=>updatePaletteField(p.id,'primary',e.target.value)} className="p-1 rounded bg-slate-700 flex-1" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="color" value={p.secondary || '#ffffff'} onChange={e=>updatePaletteField(p.id,'secondary',e.target.value)} className="w-10 h-8 p-0" />
                      <input value={p.secondary || ''} onChange={e=>updatePaletteField(p.id,'secondary',e.target.value)} className="p-1 rounded bg-slate-700 flex-1" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="color" value={p.accent || '#ffffff'} onChange={e=>updatePaletteField(p.id,'accent',e.target.value)} className="w-10 h-8 p-0" />
                      <input value={p.accent || ''} onChange={e=>updatePaletteField(p.id,'accent',e.target.value)} className="p-1 rounded bg-slate-700 flex-1" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="color" value={p.text || '#000000'} onChange={e=>updatePaletteField(p.id,'text',e.target.value)} className="w-10 h-8 p-0" />
                      <input value={p.text} onChange={e=>updatePaletteField(p.id,'text',e.target.value)} className="p-1 rounded bg-slate-700 flex-1" />
                    </div>
                  </div>
                )}

                <div className="mt-2">
                  {active === p.id ? (
                    <span className="inline-flex items-center gap-2 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500 text-black font-semibold">✓ Current</span>
                  ) : (
                    <div className="flex items-center gap-2">
                        <button
                          onClick={() => save(p.id)}
                          className="inline-flex items-center gap-2 text-[11px] px-2 py-0.5 rounded-full bg-indigo-600 hover:bg-indigo-500"
                          aria-pressed={false}
                        >
                          Set
                        </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-400">Tip: Click a palette to apply and save it. When Firebase is configured the palette will be saved to Firestore and the portfolio can auto-sync.</div>
        </div>
      )}
    </div>
  )
}
