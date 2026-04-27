import React, { useState } from 'react'
import { DesktopProvider } from './context/DesktopContext'
import LoadingScreen from './components/LoadingScreen'
import LoginScreen from './components/LoginScreen'
import Desktop from './components/Desktop'

export default function App() {
  const [phase, setPhase] = useState('loading') // loading | login | desktop

  return (
    <DesktopProvider>
      {phase === 'loading' && <LoadingScreen onDone={() => setPhase('login')} />}
      {phase === 'login' && <LoginScreen onLogin={() => setPhase('desktop')} />}
      {phase === 'desktop' && <Desktop />}
    </DesktopProvider>
  )
}
