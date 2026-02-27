import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProfileManager from './pages/ProfileManager'
import SkillsManager from './pages/SkillsManager'
import ProjectsManager from './pages/ProjectsManager'
import ThemeManager from './pages/ThemeManager'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import AnimatedBackground from './components/AnimatedBackground'

export default function App() {
  React.useEffect(() => { }, [])
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Toaster toastOptions={{ duration: 2000, style: { background: '#334155', color: '#fff' } }} />
      <div className="relative z-10">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><ProfileManager /></ProtectedRoute>} />
        <Route path="/dashboard/skills" element={<ProtectedRoute><SkillsManager /></ProtectedRoute>} />
        <Route path="/dashboard/projects" element={<ProtectedRoute><ProjectsManager /></ProtectedRoute>} />
        <Route path="/dashboard/theme" element={<ProtectedRoute><ThemeManager /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
    </div>
  )
}
