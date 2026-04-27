import React, { useState } from 'react'
import { FileText } from 'lucide-react'
import Window from '../Window'
import { useDesktop } from '../../context/DesktopContext'

const BUILTIN_PAGES = [
  '/Portfolio/assets/resume1-CAqDqhOT.jpg',
  '/Portfolio/assets/resume2-_5E7IAJ6.jpg',
  '/Portfolio/assets/resume3-DCNtQpMf.jpg',
]

export default function ResumeWindow() {
  const { showToast, resumeImages } = useDesktop()
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)

  const pages = resumeImages || BUILTIN_PAGES
  const total = pages.length

  const download = () => {
    pages.forEach((src, i) => {
      const a = document.createElement('a')
      a.href = src
      a.download = `Mohamed_Selem_Resume_Page_${i + 1}.${src.startsWith('data:') ? 'png' : 'jpg'}`
      a.click()
    })
    showToast('Resume downloaded!')
  }

  const print = () => {
    const win = window.open('', '_blank')
    win.document.write(`<html><head><title>Mohamed Selem - Resume</title>
      <style>body{margin:0;padding:0}img{width:100%;max-width:800px;display:block;margin:0 auto;page-break-after:always}img:last-child{page-break-after:avoid}@media print{img{max-width:100%}}</style>
      </head><body>${pages.map(src => `<img src="${src}" />`).join('')}</body></html>`)
    win.document.close()
    win.print()
    showToast('Sending to printer...')
  }

  const toolbar = (
    <div className="flex gap-1 flex-wrap items-center">
      <button className="tb-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>◀</button>
      <span className="text-[10px] px-1">{page} / {total}</span>
      <button className="tb-btn" onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page >= total}>▶</button>
      <span className="w-px h-4 bg-gray-300 mx-0.5" />
      <button className="tb-btn" onClick={() => setZoom(z => Math.max(50, z - 25))}>−</button>
      <span className="text-[10px] px-1">{zoom}%</span>
      <button className="tb-btn" onClick={() => setZoom(z => Math.min(200, z + 25))}>+</button>
      <button className="tb-btn" onClick={() => setZoom(100)}>Reset</button>
      <span className="w-px h-4 bg-gray-300 mx-0.5" />
      <button className="tb-btn" onClick={download}>⬇ Download</button>
      <button className="tb-btn" onClick={print}>🖨 Print</button>
    </div>
  )

  return (
    <Window id="resume" title="My Resume" icon={<FileText className="w-4 h-4 text-white" />} toolbar={toolbar} defaultW={560} defaultH={520}>
      <div className="bg-gray-200 flex justify-center p-3 min-h-full">
        <img
          src={pages[page - 1]}
          alt={`Resume page ${page}`}
          style={{ width: `${zoom}%`, maxWidth: 700, height: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        />
      </div>
    </Window>
  )
}
