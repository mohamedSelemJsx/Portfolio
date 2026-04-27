import React, { useState, useRef, useEffect } from 'react'
import { Terminal } from 'lucide-react'
import Window from '../Window'
import { useDesktop } from '../../context/DesktopContext'

const COMMANDS = {
  help: () => `Available commands:\n  help      - Show this help\n  whoami    - About Mohamed\n  skills    - List skills\n  projects  - List projects\n  contact   - Contact info\n  clear     - Clear screen\n  date      - Show current date`,
  whoami: () => `Mohamed Selem\nWeb Developer | React.js Specialist | Automation Expert\nExperience: 5+ years`,
  skills: () => `React.js | Redux | Tailwind CSS | n8n | REST APIs | Git\nJavaScript | TypeScript | HTML | CSS | Python`,
  projects: () => `1. AKIL Company       - E-commerce\n2. ATME Dienstleistung - Corporate\n3. Reservation System  - Booking\n4. Real Estate CRM Bot - Automation`,
  contact: () => `Email:    mohamed.t.selem@gmail.com\nPhone:    +963 993064852\nLinkedIn: linkedin.com/in/mohamed-t-selem\nGitHub:   github.com/mohamedSelemJsx`,
  date: () => new Date().toLocaleString(),
}

export default function CmdWindow() {
  const { isMobile } = useDesktop()
  const [lines, setLines] = useState(['Microsoft Windows XP [Version 5.1.2600]', '(C) Copyright 1985-2001 Microsoft Corp.', ''])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  const submit = (e) => {
    e.preventDefault()
    const cmd = input.trim().toLowerCase()
    const newLines = [...lines, `C:\\Users\\Mohamed> ${input}`]
    if (cmd === 'clear') {
      setLines([])
    } else if (COMMANDS[cmd]) {
      newLines.push(COMMANDS[cmd](), '')
      setLines(newLines)
    } else if (cmd === '') {
      newLines.push('')
      setLines(newLines)
    } else {
      newLines.push(`'${cmd}' is not recognized as an internal or external command.`, '')
      setLines(newLines)
    }
    setHistory(h => [input, ...h])
    setHistIdx(-1)
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      const idx = histIdx + 1
      if (idx < history.length) { setHistIdx(idx); setInput(history[idx]) }
    } else if (e.key === 'ArrowDown') {
      const idx = histIdx - 1
      if (idx >= 0) { setHistIdx(idx); setInput(history[idx]) } else { setHistIdx(-1); setInput('') }
    }
  }

  return (
    <Window id="cmd" title="C:\\>_" icon={<Terminal className="w-4 h-4 text-white" />} defaultW={520} defaultH={360}>
      <div
        className="bg-black text-[#c0c0c0] font-mono text-[11px] sm:text-[12px] p-2 min-h-full cursor-text"
        style={{ minHeight: isMobile ? 'calc(100vh - 130px)' : 320 }}
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((l, i) => <div key={i}>{l || ' '}</div>)}
        <form onSubmit={submit} className="flex items-center">
          <span>C:\Users\Mohamed&gt;&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-[#c0c0c0] font-mono"
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
        </form>
        <div ref={endRef} />
      </div>
    </Window>
  )
}
