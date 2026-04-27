import React, { useState, useCallback } from 'react'
import { Gamepad2 } from 'lucide-react'
import Window from '../Window'
import { useDesktop } from '../../context/DesktopContext'

const ROWS = 9, COLS = 9, MINES = 10

function createBoard() {
  const cells = Array.from({ length: ROWS * COLS }, (_, i) => ({
    id: i, mine: false, revealed: false, flagged: false, count: 0,
  }))
  let placed = 0
  while (placed < MINES) {
    const idx = Math.floor(Math.random() * cells.length)
    if (!cells[idx].mine) { cells[idx].mine = true; placed++ }
  }
  cells.forEach((cell, i) => {
    if (cell.mine) return
    const neighbors = getNeighbors(i)
    cell.count = neighbors.filter(n => cells[n].mine).length
  })
  return cells
}

function getNeighbors(idx) {
  const r = Math.floor(idx / COLS), c = idx % COLS
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
  return dirs.map(([dr,dc]) => {
    const nr = r+dr, nc = c+dc
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return -1
    return nr * COLS + nc
  }).filter(n => n >= 0)
}

export default function MinesweeperWindow() {
  const { isMobile } = useDesktop()
  const [board, setBoard] = useState(createBoard)
  const [status, setStatus] = useState('playing') // playing | won | lost
  const [flags, setFlags] = useState(0)

  const reveal = useCallback((idx) => {
    if (status !== 'playing') return
    setBoard(prev => {
      const next = [...prev]
      if (next[idx].revealed || next[idx].flagged) return prev
      if (next[idx].mine) {
        next.forEach(c => { if (c.mine) c.revealed = true })
        setStatus('lost')
        return next
      }
      const queue = [idx]
      const visited = new Set()
      while (queue.length) {
        const cur = queue.shift()
        if (visited.has(cur) || next[cur].flagged) continue
        visited.add(cur)
        next[cur] = { ...next[cur], revealed: true }
        if (next[cur].count === 0 && !next[cur].mine) {
          getNeighbors(cur).forEach(n => { if (!visited.has(n)) queue.push(n) })
        }
      }
      const won = next.every(c => c.mine || c.revealed)
      if (won) setStatus('won')
      return next
    })
  }, [status])

  const flag = useCallback((e, idx) => {
    e.preventDefault()
    if (status !== 'playing') return
    setBoard(prev => {
      const next = [...prev]
      if (next[idx].revealed) return prev
      const wasFlagged = next[idx].flagged
      next[idx] = { ...next[idx], flagged: !wasFlagged }
      setFlags(f => wasFlagged ? f - 1 : f + 1)
      return next
    })
  }, [status])

  const reset = () => { setBoard(createBoard()); setStatus('playing'); setFlags(0) }

  const COLORS = ['','#0000ff','#008000','#ff0000','#800080','#800000','#008080','#000000','#808080']

  const toolbar = (
    <div className="flex items-center gap-2">
      <span className="text-[10px]">💣 {MINES - flags}</span>
      <button className="tb-btn" onClick={reset}>
        {status === 'won' ? '😎' : status === 'lost' ? '😵' : '🙂'} New Game
      </button>
      {status !== 'playing' && (
        <span className="text-[10px] font-bold" style={{ color: status === 'won' ? 'green' : 'red' }}>
          {status === 'won' ? 'You Win! 🎉' : 'Game Over!'}
        </span>
      )}
    </div>
  )

  return (
    <Window id="minesweeper" title="Minesweeper" icon={<Gamepad2 className="w-4 h-4 text-white" />} toolbar={toolbar} defaultW={300} defaultH={360}>
      <div className="bg-[#c0c0c0] p-2 flex justify-center">
        <div
          className="grid border-2 border-gray-600"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, display: 'grid' }}
        >
          {board.map((cell, i) => (
            <div
              key={i}
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[11px] sm:text-xs font-bold border cursor-pointer select-none
                ${cell.revealed
                  ? 'bg-[#d4d0c8] border-gray-400'
                  : 'bg-[#c0c0c0] border-t-white border-l-white border-b-gray-600 border-r-gray-600 border-2 active:border-gray-400'
                }`}
              style={{ fontWeight: 'bold', color: cell.revealed && !cell.mine ? COLORS[cell.count] : undefined }}
              onClick={() => reveal(i)}
              onContextMenu={(e) => flag(e, i)}
            >
              {cell.revealed
                ? cell.mine ? '💣' : cell.count > 0 ? cell.count : ''
                : cell.flagged ? '🚩' : ''
              }
            </div>
          ))}
        </div>
      </div>
      <div className="text-center text-[10px] text-gray-500 py-1">Right-click / long-press to flag</div>
    </Window>
  )
}
