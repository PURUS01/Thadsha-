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
    <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
          Color Palettes
        </h3>
        <span className="text-xs text-slate-400 px-3 py-1 rounded-full bg-white/5 border border-white/5">
          {editablePalettes.length} Presets
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editablePalettes.map(p => (
            <div
              key={p.id}
              className={`relative group p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${active === p.id
                ? 'bg-indigo-500/10 border-indigo-500/50 shadow-indigo-500/10'
                : 'bg-slate-800/40 border-white/5 hover:border-white/10 hover:bg-slate-800/60'}`}
            >
              {/* Active Indicator Icon - Fixed Positioning */}
              {active === p.id && (
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-lg shadow-emerald-500/20 z-10 scale-100 animate-fade-in">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Color Preview */}
              <div className="h-16 rounded-lg overflow-hidden mb-4 flex border border-white/5 shadow-inner relative">
                <div className="flex-1 h-full" style={{ background: p.background }} title="Background" />
                <div className="w-12 h-full" style={{ background: p.primary }} title="Primary" />
                <div className="w-8 h-full" style={{ background: p.secondary }} title="Secondary" />
                <div className="w-4 h-full" style={{ background: p.accent }} title="Accent" />
              </div>

              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-white text-sm">{p.label}</div>
                  <div className="text-xs text-slate-400">{p.desc}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleEdit(p.id); }}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title={p.editing ? "Done" : "Edit Colors"}
                  >
                    {p.editing ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                  </button>
                  {p.editing && (
                    <button
                      onClick={(e) => { e.stopPropagation(); resetPalette(p.id); }}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
                      title="Reset details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Edit Mode */}
              {p.editing ? (
                <div className="mt-4 pt-4 border-t border-white/5 grid gap-3 animate-fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={p.label} onChange={e => updatePaletteField(p.id, 'label', e.target.value)} className="col-span-2 text-xs bg-slate-900/50 border border-white/10 rounded px-2 py-1.5 text-white focus:border-indigo-500 outline-none" placeholder="Label name" />
                    <input value={p.desc} onChange={e => updatePaletteField(p.id, 'desc', e.target.value)} className="col-span-2 text-xs bg-slate-900/50 border border-white/10 rounded px-2 py-1.5 text-white focus:border-indigo-500 outline-none" placeholder="Description" />
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: 'background', label: 'Bg' },
                      { key: 'primary', label: 'Pri' },
                      { key: 'secondary', label: 'Sec' },
                      { key: 'accent', label: 'Acc' },
                      { key: 'text', label: 'Txt' },
                    ].map((color) => (
                      <div key={color.key} className="flex items-center gap-2">
                        <span className="text-[10px] w-6 text-slate-500 uppercase font-bold">{color.label}</span>
                        <div className="relative flex-1 flex items-center bg-slate-900/50 rounded border border-white/10 p-1">
                          <input
                            type="color"
                            value={p[color.key] || '#ffffff'}
                            onChange={e => updatePaletteField(p.id, color.key, e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                          />
                          <input
                            value={p[color.key] || ''}
                            onChange={e => updatePaletteField(p.id, color.key, e.target.value)}
                            className="flex-1 bg-transparent border-none text-xs text-slate-300 ml-2 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <button
                    onClick={() => save(p.id)}
                    disabled={active === p.id}
                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-all duration-200 
                       ${active === p.id
                        ? 'bg-emerald-500/10 text-emerald-400 cursor-default border border-emerald-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}
                  >
                    {active === p.id ? 'Active Theme' : 'Apply Theme'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
