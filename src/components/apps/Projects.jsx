import React from 'react'
import { FolderOpen } from 'lucide-react'
import Window from '../Window'
import { useDesktop } from '../../context/DesktopContext'

export default function ProjectsWindow() {
  const { projects, showToast, isMobile } = useDesktop()

  const toolbar = (
    <div className="flex flex-col sm:flex-row gap-1">
      <div className="flex gap-1">
        <button className="tb-btn" onClick={() => showToast('Back')}>◀</button>
        <button className="tb-btn" onClick={() => showToast('Forward')}>▶</button>
        <button className="tb-btn" onClick={() => showToast('Refresh')}>↻</button>
      </div>
      {!isMobile && (
        <div className="flex items-center gap-1 flex-1">
          <span className="text-[10px]">Address:</span>
          <input
            type="text"
            value="https://myprojects.com"
            readOnly
            className="flex-1 px-1.5 py-0.5 border border-[#7f9db9] text-[10px] min-w-0"
          />
          <button className="tb-btn">Go</button>
        </div>
      )}
    </div>
  )

  return (
    <Window id="projects" title="My Projects" icon={<FolderOpen className="w-4 h-4 text-white" />} toolbar={toolbar} defaultW={500} defaultH={400}>
      <div className={`bg-[#0a0a0a] text-white p-3 sm:p-4 ${isMobile ? 'min-h-screen' : 'min-h-full'}`}>
        <h2 className="text-base sm:text-lg mb-3 sm:mb-4">My Projects</h2>
        <div className={`grid gap-3 sm:gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {projects.map((proj, i) => (
            <div key={proj.id ?? i} className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#333]">
              <div className={`h-20 sm:h-24 bg-gradient-to-br ${proj.gradient} flex items-center justify-center text-2xl sm:text-3xl`}>
                {proj.emoji}
              </div>
              <div className="p-2.5 sm:p-3">
                <h3 className="text-sm mb-1">{proj.name}</h3>
                <p className="text-[10px] text-gray-500 mb-2">{proj.type}</p>
                {proj.url
                  ? <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline">Visit →</a>
                  : <span className="text-[10px] text-green-400">Private</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  )
}
