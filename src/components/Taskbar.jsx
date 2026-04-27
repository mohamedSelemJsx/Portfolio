import React, { useState, useEffect } from 'react'
import { useDesktop } from '../context/DesktopContext'
import StartMenu from './StartMenu'

const WINDOW_LABELS = {
  about: 'About',
  resume: 'Resume',
  projects: 'Projects',
  contact: 'Contact',
  minesweeper: 'Minesweeper',
  paint: 'Paint',
  cmd: 'CMD',
  dashboard: 'Dashboard',
}

export default function Taskbar() {
  const { windows, toggleStartMenu, startMenuOpen, minimizeWindow, restoreWindow } = useDesktop()
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const openWindows = windows.filter(w => WINDOW_LABELS[w.id])

  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 sm:h-9 flex items-center z-[9999] select-none"
         style={{ background: 'linear-gradient(to bottom, #1f5fb3, #245eae 4%, #2a60ae 6%, #3068b7 10%, #2060b0 94%, #1a58a8 96%, #1650a0 100%)' }}>

      {/* Start button */}
      <button
        className="start-btn-gradient h-full px-3 sm:px-4 flex items-center gap-1.5 text-white font-bold text-sm rounded-tr-lg rounded-br-lg border-r border-[#2d6a2d] shrink-0"
        onClick={toggleStartMenu}
      >
        <span className="text-base">⊞</span>
        <span className="hidden sm:inline">start</span>
      </button>

      {/* Window buttons */}
      <div className="flex-1 flex items-center gap-1 px-1 overflow-x-auto">
        {openWindows.map(win => (
          <button
            key={win.id}
            className={`h-6 px-2 text-[10px] sm:text-[11px] rounded-sm border border-[#1a4a8a] text-white truncate max-w-[110px] sm:max-w-[140px] shrink-0 ${win.minimized ? 'task-item-gradient text-gray-800' : 'task-item-active'}`}
            onClick={() => win.minimized ? restoreWindow(win.id) : minimizeWindow(win.id)}
          >
            {WINDOW_LABELS[win.id] || win.id}
          </button>
        ))}
      </div>

      {/* System tray */}
      <div className="systray-gradient h-full flex items-center px-2 sm:px-3 gap-2 border-l border-[#1040a0] shrink-0">
        <span className="text-white text-[10px] sm:text-xs">{time}</span>
      </div>

      {/* Start menu */}
      {startMenuOpen && <StartMenu />}
    </div>
  )
}
