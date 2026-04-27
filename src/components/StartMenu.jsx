import React from 'react'
import {
  User, FolderOpen, Mail, FileText, Gamepad2, Palette, Terminal,
  Link2, GitBranch, LayoutDashboard, LogOut, Power,
} from 'lucide-react'
import { useDesktop } from '../context/DesktopContext'

const MENU_ITEMS = [
  { id: 'about', label: 'About Me', Icon: User },
  { id: 'resume', label: 'My Resume', Icon: FileText },
  { id: 'projects', label: 'My Projects', Icon: FolderOpen },
  { id: 'contact', label: 'Contact Me', Icon: Mail },
  { id: 'minesweeper', label: 'Minesweeper', Icon: Gamepad2 },
  { id: 'paint', label: 'Paint', Icon: Palette },
  { id: 'cmd', label: 'CMD', Icon: Terminal },
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
]

export default function StartMenu() {
  const { openWindow, setStartMenuOpen } = useDesktop()

  const open = (id) => { openWindow(id); setStartMenuOpen(false) }

  return (
    <div className="absolute bottom-9 left-0 w-64 sm:w-72 shadow-2xl border border-[#003c74] rounded-tr-lg overflow-hidden z-50 select-none">
      {/* Header */}
      <div className="sm-header-gradient flex items-center gap-3 px-3 py-2">
        <div className="w-10 h-10 rounded-full bg-[#2266cc] border-2 border-white flex items-center justify-center shrink-0">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm">Mohamed Selem</div>
          <div className="text-[#c0d0ff] text-[10px]">Web Developer</div>
        </div>
      </div>

      {/* Programs */}
      <div className="bg-white">
        {MENU_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className="w-full flex items-center gap-3 px-3 py-2 text-[12px] hover:bg-[#316ac5] hover:text-white transition-colors text-left"
            onClick={() => open(id)}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </div>

      <div className="border-t border-gray-300" />

      {/* External links */}
      <div className="bg-white">
        <a
          href="https://www.linkedin.com/in/mohamed-t-selem/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-3 py-2 text-[12px] hover:bg-[#316ac5] hover:text-white transition-colors"
          onClick={() => setStartMenuOpen(false)}
        >
          <Link2 className="w-4 h-4 shrink-0 text-[#0077b5]" />
          LinkedIn
        </a>
        <a
          href="https://github.com/mohamedSelemJsx"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-3 py-2 text-[12px] hover:bg-[#316ac5] hover:text-white transition-colors"
          onClick={() => setStartMenuOpen(false)}
        >
          <GitBranch className="w-4 h-4 shrink-0" />
          GitHub
        </a>
      </div>

      {/* Footer */}
      <div className="sm-footer-gradient flex items-center justify-end gap-2 px-3 py-1.5">
        <button className="sm-foot-btn" onClick={() => setStartMenuOpen(false)}>
          <LogOut className="w-3.5 h-3.5" /> Log Off
        </button>
        <button className="sm-foot-btn-off" onClick={() => window.location.reload()}>
          <Power className="w-3.5 h-3.5" /> Shut Down
        </button>
      </div>
    </div>
  )
}
