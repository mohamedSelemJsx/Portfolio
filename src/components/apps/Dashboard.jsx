import React, { useState, useRef } from 'react'
import { LayoutDashboard, Upload, Plus, Trash2, Edit3, Check, X, RefreshCw } from 'lucide-react'
import Window from '../Window'
import { useDesktop } from '../../context/DesktopContext'
import { DEFAULT_PROJECTS, GRADIENTS } from '../../context/DesktopContext'

const EMOJIS = ['🛍️','🏢','📅','🤖','💼','🎨','🔬','🚀','💡','🌐','📱','🖥️','⚙️','🏗️','📊','🎯','🔧','🌟','💎','🏆']

export default function DashboardWindow() {
  const [tab, setTab] = useState('wallpaper')

  const tabs = [
    { id: 'wallpaper', label: '🖼️ Wallpaper' },
    { id: 'resume', label: '📄 Resume/CV' },
    { id: 'projects', label: '📁 Projects' },
    { id: 'reset', label: '🔄 Reset' },
  ]

  const toolbar = (
    <div className="flex gap-1 overflow-x-auto">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`tb-btn whitespace-nowrap ${tab === t.id ? 'bg-[#b0cfe8] border-[#4a7fb5]' : ''}`}
          onClick={() => setTab(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )

  return (
    <Window id="dashboard" title="Dashboard — Portfolio Manager" icon={<LayoutDashboard className="w-4 h-4 text-white" />} toolbar={toolbar} defaultW={540} defaultH={460}>
      <div className="p-4 bg-[#f5f5f5] min-h-full">
        {tab === 'wallpaper' && <WallpaperTab />}
        {tab === 'resume' && <ResumeTab />}
        {tab === 'projects' && <ProjectsTab />}
        {tab === 'reset' && <ResetTab />}
      </div>
    </Window>
  )
}

/* ─── Wallpaper Tab ─── */
function WallpaperTab() {
  const { wallpaper, updateWallpaper } = useDesktop()
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(wallpaper)

  const pick = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const apply = () => {
    if (preview) updateWallpaper(preview)
  }

  const reset = () => {
    setPreview(null)
    updateWallpaper(null)
  }

  return (
    <div>
      <h3 className="text-sm font-bold mb-3 text-[#0055ea]">🖼️ Desktop Wallpaper</h3>

      <div
        className="w-full h-40 border-2 border-dashed border-[#7f9db9] rounded mb-3 overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer relative"
        onClick={() => inputRef.current?.click()}
      >
        {preview
          ? <img src={preview} alt="Wallpaper preview" className="w-full h-full object-cover" />
          : <div className="text-center text-gray-500">
              <Upload className="w-8 h-8 mx-auto mb-1" />
              <p className="text-xs">Click to upload wallpaper</p>
              <p className="text-[10px] text-gray-400">JPG, PNG, GIF, WebP</p>
            </div>
        }
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={pick} />

      <div className="flex gap-2">
        <button className="tb-btn flex items-center gap-1" onClick={() => inputRef.current?.click()}>
          <Upload className="w-3 h-3" /> Choose Image
        </button>
        {preview && (
          <button className="tb-btn flex items-center gap-1 bg-[#0050ee] text-white border-[#003caa] hover:bg-[#0040cc]" onClick={apply}>
            <Check className="w-3 h-3" /> Apply Wallpaper
          </button>
        )}
        <button className="tb-btn flex items-center gap-1" onClick={reset}>
          <RefreshCw className="w-3 h-3" /> Reset Default
        </button>
      </div>
    </div>
  )
}

/* ─── Resume Tab ─── */
function ResumeTab() {
  const { resumeImages, updateResume, showToast } = useDesktop()
  const inputRef = useRef(null)

  const BUILTIN = [
    '/Portfolio/assets/resume1-CAqDqhOT.jpg',
    '/Portfolio/assets/resume2-_5E7IAJ6.jpg',
    '/Portfolio/assets/resume3-DCNtQpMf.jpg',
  ]

  const [pages, setPages] = useState(resumeImages || BUILTIN)

  const addPages = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const readers = files.map(file => new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = ev => resolve(ev.target.result)
      reader.readAsDataURL(file)
    }))
    Promise.all(readers).then(newImgs => {
      setPages(p => [...p, ...newImgs])
      showToast(`Added ${newImgs.length} page(s)`)
    })
  }

  const removePage = (idx) => setPages(p => p.filter((_, i) => i !== idx))

  const apply = () => updateResume(pages)

  const reset = () => { setPages(BUILTIN); updateResume(null) }

  return (
    <div>
      <h3 className="text-sm font-bold mb-3 text-[#0055ea]">📄 Resume / CV Pages</h3>
      <p className="text-[11px] text-gray-500 mb-3">Upload your CV pages as images (JPG/PNG). Each file = one page.</p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {pages.map((src, i) => (
          <div key={i} className="relative group">
            <img src={src} alt={`Page ${i+1}`} className="w-full h-24 object-cover rounded border border-gray-300" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
              <span className="text-white text-[10px]">Page {i+1}</span>
            </div>
            <button
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removePage(i)}
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}

        <div
          className="h-24 border-2 border-dashed border-[#7f9db9] rounded flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 text-gray-400"
          onClick={() => inputRef.current?.click()}
        >
          <Plus className="w-6 h-6" />
          <span className="text-[10px] mt-1">Add page</span>
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={addPages} />

      <div className="flex gap-2">
        <button className="tb-btn flex items-center gap-1 bg-[#0050ee] text-white border-[#003caa] hover:bg-[#0040cc]" onClick={apply}>
          <Check className="w-3 h-3" /> Save CV
        </button>
        <button className="tb-btn flex items-center gap-1" onClick={reset}>
          <RefreshCw className="w-3 h-3" /> Reset to Default
        </button>
      </div>
    </div>
  )
}

/* ─── Projects Tab ─── */
function ProjectsTab() {
  const { projects, updateProjects } = useDesktop()
  const [list, setList] = useState(projects)
  const [editing, setEditing] = useState(null) // null | index

  const draft = editing !== null ? list[editing] : null

  const update = (idx, field, val) => setList(l => l.map((p, i) => i === idx ? { ...p, [field]: val } : p))

  const add = () => {
    const newProj = { id: Date.now(), name: 'New Project', type: 'Web', url: '', gradient: GRADIENTS[list.length % GRADIENTS.length], emoji: '🌐' }
    setList(l => [...l, newProj])
    setEditing(list.length)
  }

  const remove = (idx) => { setList(l => l.filter((_, i) => i !== idx)); if (editing === idx) setEditing(null) }

  const save = () => updateProjects(list)

  return (
    <div>
      <h3 className="text-sm font-bold mb-3 text-[#0055ea]">📁 Projects Manager</h3>

      <div className="space-y-2 mb-3 max-h-64 overflow-y-auto pr-1">
        {list.map((proj, i) => (
          <div key={proj.id ?? i} className="bg-white border border-gray-200 rounded p-2">
            {editing === i ? (
              <div className="space-y-1.5">
                {/* Emoji & Gradient row */}
                <div className="flex gap-2">
                  <div>
                    <label className="text-[9px] text-gray-500 block mb-0.5">Emoji</label>
                    <select className="xp-input w-16 text-base" value={proj.emoji} onChange={e => update(i, 'emoji', e.target.value)}>
                      {EMOJIS.map(em => <option key={em} value={em}>{em}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-gray-500 block mb-0.5">Color</label>
                    <select className="xp-input w-full" value={proj.gradient} onChange={e => update(i, 'gradient', e.target.value)}>
                      {GRADIENTS.map((g, gi) => <option key={gi} value={g}>Color {gi+1}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 block mb-0.5">Project Name</label>
                  <input className="xp-input w-full" value={proj.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Project name" />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 block mb-0.5">Type / Category</label>
                  <input className="xp-input w-full" value={proj.type} onChange={e => update(i, 'type', e.target.value)} placeholder="E.g. E-commerce, SaaS" />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 block mb-0.5">Live URL (leave empty for Private)</label>
                  <input className="xp-input w-full" value={proj.url ?? ''} onChange={e => update(i, 'url', e.target.value || null)} placeholder="https://..." />
                </div>
                <button className="tb-btn text-[10px] flex items-center gap-1" onClick={() => setEditing(null)}>
                  <Check className="w-3 h-3" /> Done
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded bg-gradient-to-br ${proj.gradient} flex items-center justify-center text-base shrink-0`}>
                  {proj.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{proj.name}</p>
                  <p className="text-[10px] text-gray-400">{proj.type}</p>
                </div>
                <button className="tb-btn p-1" onClick={() => setEditing(i)} title="Edit">
                  <Edit3 className="w-3 h-3" />
                </button>
                <button className="tb-btn p-1 text-red-500" onClick={() => remove(i)} title="Delete">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="tb-btn flex items-center gap-1" onClick={add}>
          <Plus className="w-3 h-3" /> Add Project
        </button>
        <button className="tb-btn flex items-center gap-1 bg-[#0050ee] text-white border-[#003caa] hover:bg-[#0040cc]" onClick={save}>
          <Check className="w-3 h-3" /> Save All
        </button>
      </div>
    </div>
  )
}

/* ─── Reset Tab ─── */
function ResetTab() {
  const { updateWallpaper, updateProjects, updateResume, showToast } = useDesktop()

  const resetAll = () => {
    localStorage.removeItem('portfolio_wallpaper')
    localStorage.removeItem('portfolio_projects')
    localStorage.removeItem('portfolio_resume')
    updateWallpaper(null)
    updateProjects(DEFAULT_PROJECTS)
    updateResume(null)
    showToast('All settings reset to defaults!')
  }

  return (
    <div>
      <h3 className="text-sm font-bold mb-3 text-[#0055ea]">🔄 Reset Settings</h3>
      <p className="text-[11px] text-gray-500 mb-4">
        This will reset your wallpaper, resume, and projects back to the original defaults stored in the app.
        Your uploaded images will be removed from local storage.
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded p-2">
          <span className="text-xs">🖼️ Wallpaper</span>
          <button className="tb-btn text-[10px]" onClick={() => updateWallpaper(null)}>Reset</button>
        </div>
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded p-2">
          <span className="text-xs">📄 Resume/CV</span>
          <button className="tb-btn text-[10px]" onClick={() => updateResume(null)}>Reset</button>
        </div>
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded p-2">
          <span className="text-xs">📁 Projects</span>
          <button className="tb-btn text-[10px]" onClick={() => updateProjects(DEFAULT_PROJECTS)}>Reset</button>
        </div>
      </div>

      <button
        className="tb-btn flex items-center gap-1 bg-red-500 text-white border-red-700 hover:bg-red-600"
        onClick={resetAll}
      >
        <RefreshCw className="w-3 h-3" /> Reset Everything to Defaults
      </button>
    </div>
  )
}
