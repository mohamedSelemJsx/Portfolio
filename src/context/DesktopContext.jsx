import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const DesktopContext = createContext(null)

const DEFAULT_PROJECTS = [
  { id: 1, name: 'AKIL Company', type: 'E-commerce', url: 'https://akilcompany.com/', gradient: 'from-[#667eea] to-[#764ba2]', emoji: '🛍️' },
  { id: 2, name: 'ATME Dienstleistung', type: 'Corporate', url: 'https://www.atmedienstleistung.com/', gradient: 'from-[#f093fb] to-[#f5576c]', emoji: '🏢' },
  { id: 3, name: 'Reservation System', type: 'Booking', url: 'http://termin.o-hamamwuppertal.de/', gradient: 'from-[#4facfe] to-[#00f2fe]', emoji: '📅' },
  { id: 4, name: 'Real Estate CRM Bot', type: 'n8n Automation', url: null, gradient: 'from-[#43e97b] to-[#38f9d7]', emoji: '🤖' },
]

const GRADIENTS = [
  'from-[#667eea] to-[#764ba2]',
  'from-[#f093fb] to-[#f5576c]',
  'from-[#4facfe] to-[#00f2fe]',
  'from-[#43e97b] to-[#38f9d7]',
  'from-[#fa709a] to-[#fee140]',
  'from-[#a18cd1] to-[#fbc2eb]',
  'from-[#ffecd2] to-[#fcb69f]',
  'from-[#ff9a9e] to-[#fad0c4]',
]

export { DEFAULT_PROJECTS, GRADIENTS }

function loadConfig(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export function DesktopProvider({ children }) {
  const [windows, setWindows] = useState([])
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [wallpaper, setWallpaper] = useState(() => loadConfig('portfolio_wallpaper', null))
  const [projects, setProjects] = useState(() => loadConfig('portfolio_projects', DEFAULT_PROJECTS))
  const [resumeImages, setResumeImages] = useState(() => loadConfig('portfolio_resume', null))

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }, [])

  const openWindow = useCallback((id) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id)
      if (existing) {
        return prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: Math.max(...prev.map(x => x.zIndex)) + 1 } : w)
      }
      return [...prev, { id, minimized: false, maximized: false, zIndex: prev.length + 1 }]
    })
    setStartMenuOpen(false)
  }, [])

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }, [])

  const minimizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w))
  }, [])

  const maximizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w))
  }, [])

  const restoreWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: Math.max(...prev.map(x => x.zIndex)) + 1 } : w))
  }, [])

  const focusWindow = useCallback((id) => {
    setWindows(prev => {
      const max = Math.max(...prev.map(x => x.zIndex))
      return prev.map(w => w.id === id ? { ...w, zIndex: max + 1 } : w)
    })
  }, [])

  const toggleStartMenu = useCallback(() => setStartMenuOpen(v => !v), [])

  const updateWallpaper = useCallback((dataUrl) => {
    setWallpaper(dataUrl)
    localStorage.setItem('portfolio_wallpaper', JSON.stringify(dataUrl))
    showToast('Wallpaper updated!')
  }, [showToast])

  const updateProjects = useCallback((newProjects) => {
    setProjects(newProjects)
    localStorage.setItem('portfolio_projects', JSON.stringify(newProjects))
    showToast('Projects updated!')
  }, [showToast])

  const updateResume = useCallback((images) => {
    setResumeImages(images)
    localStorage.setItem('portfolio_resume', JSON.stringify(images))
    showToast('Resume updated!')
  }, [showToast])

  return (
    <DesktopContext.Provider value={{
      windows, openWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow,
      startMenuOpen, toggleStartMenu, setStartMenuOpen,
      toast, showToast,
      wallpaper, updateWallpaper,
      projects, updateProjects,
      resumeImages, updateResume,
      isMobile,
    }}>
      {children}
    </DesktopContext.Provider>
  )
}

export function useDesktop() {
  return useContext(DesktopContext)
}
