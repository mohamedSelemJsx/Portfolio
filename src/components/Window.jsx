import React, { useRef, useState, useEffect } from 'react'
import { useDesktop } from '../context/DesktopContext'

export default function Window({ id, title, icon, toolbar, children, defaultW = 520, defaultH = 420 }) {
  const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow, isMobile } = useDesktop()
  const win = windows.find(w => w.id === id)
  const dragRef = useRef(null)
  const [pos, setPos] = useState({ x: 60 + Math.random() * 80, y: 40 + Math.random() * 60 })
  const dragging = useRef(false)
  const dragStart = useRef({ mx: 0, my: 0, wx: 0, wy: 0 })

  if (!win || win.minimized) return null

  const onMouseDown = (e) => {
    if (isMobile || win.maximized) return
    dragging.current = true
    dragStart.current = { mx: e.clientX, my: e.clientY, wx: pos.x, wy: pos.y }
    focusWindow(id)
    const onMove = (ev) => {
      if (!dragging.current) return
      setPos({
        x: dragStart.current.wx + ev.clientX - dragStart.current.mx,
        y: Math.max(0, dragStart.current.wy + ev.clientY - dragStart.current.my),
      })
    }
    const onUp = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const style = isMobile || win.maximized
    ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: '34px', width: '100%', zIndex: win.zIndex, display: 'flex', flexDirection: 'column' }
    : { position: 'fixed', top: pos.y, left: pos.x, width: defaultW, minHeight: 80, zIndex: win.zIndex, display: 'flex', flexDirection: 'column' }

  return (
    <div style={style} className="shadow-2xl border border-[#003c74] rounded-tl-lg rounded-tr-lg overflow-hidden" onClick={() => focusWindow(id)}>
      {/* Title bar */}
      <div
        ref={dragRef}
        className="win-title-gradient flex items-center gap-1 px-1.5 py-1 cursor-move select-none shrink-0"
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-1 flex-1 overflow-hidden">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="text-white text-[11px] font-bold truncate drop-shadow">{title}</span>
        </div>
        <div className="flex gap-0.5 shrink-0">
          <button className="win-btn win-btn-min" onMouseDown={e => e.stopPropagation()} onClick={() => minimizeWindow(id)}>−</button>
          {!isMobile && <button className="win-btn win-btn-max" onMouseDown={e => e.stopPropagation()} onClick={() => maximizeWindow(id)}>☐</button>}
          <button className="win-btn win-btn-close" onMouseDown={e => e.stopPropagation()} onClick={() => closeWindow(id)}>×</button>
        </div>
      </div>

      {/* Menu/toolbar */}
      {toolbar && (
        <div className="bg-[#ece9d8] px-2 py-1.5 border-b border-[#aca899] overflow-x-auto shrink-0">
          {toolbar}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white">{children}</div>
    </div>
  )
}
