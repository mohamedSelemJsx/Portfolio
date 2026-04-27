import React from 'react'
import { useDesktop } from '../context/DesktopContext'
import {
  User, FolderOpen, Mail, FileText, Gamepad2, Palette, Terminal,
  Link2, GitBranch, LayoutDashboard,
} from 'lucide-react'
import Taskbar from './Taskbar'
import AboutWindow from './apps/About'
import ResumeWindow from './apps/Resume'
import ProjectsWindow from './apps/Projects'
import ContactWindow from './apps/Contact'
import MinesweeperWindow from './apps/Minesweeper'
import PaintWindow from './apps/Paint'
import CmdWindow from './apps/Cmd'
import DashboardWindow from './apps/Dashboard'

const DEFAULT_WALLPAPER = '/Portfolio/assets/wallpaper-eJk4OFKn.jpg'

const DESKTOP_ICONS = [
  { id: 'about', label: 'About Me', Icon: User },
  { id: 'resume', label: 'My Resume', Icon: FileText },
  { id: 'projects', label: 'My Projects', Icon: FolderOpen },
  { id: 'contact', label: 'Contact Me', Icon: Mail },
  { id: 'minesweeper', label: 'Minesweeper', Icon: Gamepad2 },
  { id: 'paint', label: 'Paint', Icon: Palette },
  { id: 'cmd', label: 'CMD', Icon: Terminal },
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'linkedin', label: 'LinkedIn', Icon: Link2, external: 'https://www.linkedin.com/in/mohamed-t-selem/' },
  { id: 'github', label: 'GitHub', Icon: GitBranch, external: 'https://github.com/mohamedSelemJsx' },
]

export default function Desktop() {
  const { openWindow, setStartMenuOpen, wallpaper, toast, isMobile } = useDesktop()

  const handleIconActivate = (icon) => {
    if (icon.external) { window.open(icon.external, '_blank'); return }
    openWindow(icon.id)
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundImage: `url(${wallpaper || DEFAULT_WALLPAPER})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={() => setStartMenuOpen(false)}
    >
      {/* Desktop icons */}
      <div className={`${isMobile ? 'grid grid-cols-4 gap-1 p-2' : 'flex flex-col flex-wrap gap-1 p-2 sm:p-2.5 max-h-[calc(100vh-40px)]'}`}
           style={isMobile ? {} : { width: 'fit-content' }}>
        {DESKTOP_ICONS.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon}
            isMobile={isMobile}
            onActivate={handleIconActivate}
          />
        ))}
      </div>

      {/* Windows */}
      <AboutWindow />
      <ResumeWindow />
      <ProjectsWindow />
      <ContactWindow />
      <MinesweeperWindow />
      <PaintWindow />
      <CmdWindow />
      <DashboardWindow />

      {/* Taskbar */}
      <Taskbar />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-12 right-4 bg-[#222] text-white text-xs px-3 py-2 rounded shadow-lg toast-show z-[99999]">
          {toast}
        </div>
      )}
    </div>
  )
}

function DesktopIcon({ icon, isMobile, onActivate }) {
  const { Icon, label } = icon
  return (
    <div
      className={`flex flex-col items-center cursor-pointer rounded p-1 sm:p-1.5 hover:bg-blue-500/40 active:bg-blue-500/60 select-none ${isMobile ? 'min-w-[70px]' : 'w-[80px] sm:w-[90px]'}`}
      onClick={isMobile ? () => onActivate(icon) : undefined}
      onDoubleClick={!isMobile ? () => onActivate(icon) : undefined}
    >
      <div className={`${isMobile ? 'w-8 h-8' : 'w-9 h-9 sm:w-10 sm:h-10'} mb-0.5 sm:mb-1 flex items-center justify-center`}>
        <Icon className="w-full h-full text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,1)]" />
      </div>
      <span className={`text-white text-center drop-shadow-[1px_1px_2px_rgba(0,0,0,1)] leading-tight ${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-[11px]'}`}>
        {label}
      </span>
    </div>
  )
}
