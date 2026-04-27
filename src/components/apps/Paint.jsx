import React, { useRef, useState, useEffect } from 'react'
import { Palette } from 'lucide-react'
import Window from '../Window'
import { useDesktop } from '../../context/DesktopContext'

const COLORS = ['#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080','#ffffff','#c0c0c0','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff','#ff8040','#804000','#80ff00','#004040']
const TOOLS = ['pencil', 'eraser', 'fill']

export default function PaintWindow() {
  const { showToast, isMobile } = useDesktop()
  const canvasRef = useRef(null)
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(4)
  const [tool, setTool] = useState('pencil')
  const drawing = useRef(false)
  const lastPos = useRef(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, c.width, c.height)
  }, [])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const src = e.touches ? e.touches[0] : e
    return { x: src.clientX - rect.left, y: src.clientY - rect.top }
  }

  const fill = (pos) => {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    const img = ctx.getImageData(0, 0, c.width, c.height)
    const px = (x, y) => (y * c.width + x) * 4
    const x0 = Math.floor(pos.x), y0 = Math.floor(pos.y)
    const target = img.data.slice(px(x0, y0), px(x0, y0) + 4)
    const fillColor = parseInt(color.slice(1), 16)
    const fr = (fillColor >> 16) & 0xff, fg = (fillColor >> 8) & 0xff, fb = fillColor & 0xff
    if (target[0] === fr && target[1] === fg && target[2] === fb) return
    const stack = [[x0, y0]]
    while (stack.length) {
      const [x, y] = stack.pop()
      if (x < 0 || x >= c.width || y < 0 || y >= c.height) continue
      const i = px(x, y)
      if (img.data[i] !== target[0] || img.data[i+1] !== target[1] || img.data[i+2] !== target[2]) continue
      img.data[i] = fr; img.data[i+1] = fg; img.data[i+2] = fb; img.data[i+3] = 255
      stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1])
    }
    ctx.putImageData(img, 0, 0)
  }

  const startDraw = (e) => {
    e.preventDefault()
    const pos = getPos(e)
    if (tool === 'fill') { fill(pos); return }
    drawing.current = true
    lastPos.current = pos
  }

  const draw = (e) => {
    e.preventDefault()
    if (!drawing.current) return
    const pos = getPos(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.lineWidth = tool === 'eraser' ? size * 4 : size
    ctx.lineCap = 'round'
    ctx.stroke()
    lastPos.current = pos
  }

  const stopDraw = () => { drawing.current = false }

  const clear = () => {
    const c = canvasRef.current
    c.getContext('2d').fillStyle = '#ffffff'
    c.getContext('2d').fillRect(0, 0, c.width, c.height)
    showToast('Canvas cleared')
  }

  const save = () => {
    const a = document.createElement('a')
    a.href = canvasRef.current.toDataURL()
    a.download = 'painting.png'
    a.click()
    showToast('Saved!')
  }

  const toolbar = (
    <div className="flex gap-1 flex-wrap items-center">
      {TOOLS.map(t => (
        <button key={t} className={`tb-btn capitalize ${tool === t ? 'bg-[#b0cfe8]' : ''}`} onClick={() => setTool(t)}>{t}</button>
      ))}
      <span className="w-px h-4 bg-gray-300 mx-0.5" />
      <span className="text-[10px]">Size:</span>
      <input type="range" min={1} max={20} value={size} onChange={e => setSize(+e.target.value)} className="w-16" />
      <span className="w-px h-4 bg-gray-300 mx-0.5" />
      <button className="tb-btn" onClick={clear}>Clear</button>
      <button className="tb-btn" onClick={save}>💾 Save</button>
    </div>
  )

  return (
    <Window id="paint" title="Paint" icon={<Palette className="w-4 h-4 text-white" />} toolbar={toolbar} defaultW={560} defaultH={440}>
      <div className="flex h-full">
        {/* Color palette */}
        <div className="bg-[#ece9d8] border-r border-[#aca899] p-1 flex flex-col gap-0.5 shrink-0">
          <div className="w-6 h-6 border-2 border-black rounded-sm mb-1" style={{ background: color }} />
          <div className="grid grid-cols-2 gap-0.5">
            {COLORS.map(c => (
              <div
                key={c}
                className={`w-4 h-4 cursor-pointer border ${color === c ? 'border-black border-2' : 'border-gray-400'}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-300 flex items-start justify-start p-1">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="bg-white cursor-crosshair"
            style={{ touchAction: 'none' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
        </div>
      </div>
    </Window>
  )
}
