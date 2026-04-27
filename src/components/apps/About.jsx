import React from 'react'
import { User } from 'lucide-react'
import Window from '../Window'

export default function AboutWindow() {
  return (
    <Window id="about" title="About Me" icon={<User className="w-4 h-4 text-white" />} defaultW={480} defaultH={360}>
      <div className="p-3 sm:p-4">
        <h2 className="text-[#0055ea] text-base sm:text-lg font-bold border-b-2 border-[#3c8cf8] pb-2 mb-3">
          Mohamed Selem
        </h2>
        <p className="font-bold text-xs sm:text-xs mb-2 sm:mb-2.5">
          Web Developer | React.js Specialist | Automation Expert
        </p>
        <p className="text-[11px] leading-relaxed mb-2.5">
          Creative and results-driven Web Developer with over 5 years of hands-on experience building
          responsive, user-centric web applications using React.js. Adept at implementing modern
          development practices with expertise in Redux Toolkit, Tailwind CSS, and workflow automation
          using n8n. Experienced in integrating RESTful APIs, building AI-powered automation solutions,
          and collaborating with back-end developers to deliver seamless digital solutions. Committed to
          writing clean, maintainable code and contributing effectively to agile teams.
        </p>
        <p className="text-[11px] mb-2">
          <strong>Skills:</strong> React.js, Redux, Tailwind CSS, n8n, REST APIs, Git
        </p>
        <p className="text-[11px] mb-1">
          <strong>Address:</strong> Available for remote work worldwide
        </p>
        <p className="text-[11px]">
          <strong>Email:</strong> mohamed.t.selem@gmail.com
        </p>
      </div>
    </Window>
  )
}
