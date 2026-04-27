import React, { useEffect, useState } from 'react'

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const audio = new Audio('/Portfolio/assets/startup-BKbXUW9c.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {})

    const start = Date.now()
    const duration = 3000
    const tick = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, (elapsed / duration) * 100)
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(tick)
        setTimeout(onDone, 400)
      }
    }, 30)
    return () => clearInterval(tick)
  }, [onDone])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-8 w-72">
        {/* Windows XP logo text */}
        <div className="text-center">
          <div className="text-white text-4xl font-light tracking-widest">
            <span className="text-[#ff4500]">Window</span>
            <span className="text-white">s</span>
            <span className="text-[#00a2ff] text-2xl font-bold ml-2">XP</span>
          </div>
          <div className="text-white text-base italic mt-1">Web Developer</div>
        </div>

        {/* Progress bar */}
        <div className="w-72 mt-4">
          <div className="w-full h-2.5 bg-[#222] rounded-full overflow-hidden border border-[#555]">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(to right, #3da5f5, #0050ee)',
              }}
            />
          </div>
        </div>

        <p className="text-[#888] text-[10px] text-center">
          Please wait while Windows loads...
        </p>
      </div>
    </div>
  )
}
