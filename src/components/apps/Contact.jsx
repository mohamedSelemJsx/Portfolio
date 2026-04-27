import React, { useState } from 'react'
import { Mail } from 'lucide-react'
import Window from '../Window'
import { useDesktop } from '../../context/DesktopContext'

export default function ContactWindow() {
  const { showToast, isMobile } = useDesktop()
  const [form, setForm] = useState({ email: '', name: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const send = async () => {
    if (!form.email || !form.name || !form.subject || !form.message) {
      showToast('Please fill all fields')
      return
    }
    setSending(true)
    showToast('Sending message...')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'b2300632-f2c3-4a8a-90a8-4910a641463f',
          name: form.name, email: form.email,
          subject: form.subject, message: form.message,
          from_name: 'Portfolio Contact Form',
        }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('Message sent successfully! ✓')
        setForm({ email: '', name: '', subject: '', message: '' })
      } else {
        showToast('Failed to send. Please try again.')
      }
    } catch {
      showToast('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const toolbar = (
    <div className="flex gap-1 flex-wrap">
      <button className="tb-btn" onClick={send} disabled={sending}>{sending ? '⏳...' : '📤 Send'}</button>
      <button className="tb-btn" onClick={() => { setForm({ email: '', name: '', subject: '', message: '' }); showToast('Form cleared') }} disabled={sending}>📝 New</button>
      {!isMobile && (
        <a href="https://www.linkedin.com/in/mohamed-t-selem/" target="_blank" rel="noopener noreferrer" className="tb-btn ml-auto">in LinkedIn</a>
      )}
    </div>
  )

  return (
    <Window id="contact" title="Contact Me" icon={<Mail className="w-4 h-4 text-white" />} toolbar={toolbar} defaultW={480} defaultH={380}>
      <div className="p-3">
        {[
          { label: 'To:', type: 'text', name: 'to', value: 'mohamed.t.selem@gmail.com', readOnly: true },
          { label: 'From:', type: 'email', name: 'email', placeholder: 'Your email' },
          { label: 'Name:', type: 'text', name: 'name', placeholder: 'Your name' },
          { label: 'Subject:', type: 'text', name: 'subject', placeholder: 'Subject' },
        ].map(field => (
          <div key={field.name} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-2">
            <label className="w-full sm:w-14 text-[11px] font-bold shrink-0">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={field.readOnly ? field.value : form[field.name]}
              onChange={field.readOnly ? undefined : change}
              placeholder={field.placeholder}
              readOnly={field.readOnly}
              disabled={sending && !field.readOnly}
              className={`xp-input w-full ${field.readOnly ? 'bg-gray-100' : ''}`}
            />
          </div>
        ))}
        <textarea
          name="message"
          value={form.message}
          onChange={change}
          placeholder="Write your message..."
          className="xp-textarea w-full"
          disabled={sending}
        />
      </div>
      <div className="px-3 py-2 bg-gray-100 border-t border-gray-300 text-[10px]">
        <strong>Contact:</strong> mohamed.t.selem@gmail.com | +963 993064852
      </div>
    </Window>
  )
}
