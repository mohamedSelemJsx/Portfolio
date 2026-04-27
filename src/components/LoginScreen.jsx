import React from 'react'
import { User } from 'lucide-react'

export default function LoginScreen({ onLogin }) {
  return (
    <div className="fixed inset-0 login-gradient flex flex-col items-center justify-center z-40 select-none">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-8 sm:h-10 sm-header-gradient flex items-center px-4">
        <span className="text-white font-bold text-sm">Windows XP</span>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="text-white text-center">
          <div className="text-2xl sm:text-3xl font-light mb-1">Welcome</div>
          <div className="text-sm text-[#c0d0ff]">Click your account to log in</div>
        </div>

        <div
          className="login-card group"
          onClick={onLogin}
        >
          <div className="w-16 h-16 rounded-full border-2 border-white bg-[#2266cc] flex items-center justify-center mb-2 group-hover:border-yellow-300 transition-colors">
            <User className="w-9 h-9 text-white" />
          </div>
          <div className="text-white text-lg font-bold">Mohamed Selem</div>
          <div className="text-[#c0d0ff] text-sm mt-1">Web Developer</div>
          <div className="text-[#aac0ff] text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to log in</div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-10 sm-footer-gradient flex items-center justify-between px-4">
        <span className="text-white text-xs">To begin, click your user account</span>
        <div className="flex gap-2">
          <button className="sm-foot-btn-off text-xs py-0.5" onClick={() => window.location.reload()}>⏻ Shut Down</button>
        </div>
      </div>
    </div>
  )
}
