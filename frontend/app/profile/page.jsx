'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'

const visibilityLevels = [
  { level: 1, title: 'Anonymous', desc: 'No one can see you', icon: '👤' },
  { level: 2, title: 'Class Visible', desc: 'Classmates can see you', icon: '👥' },
  { level: 3, title: 'Friends Visible', desc: 'Friends can see you', icon: '💚' },
]

const friendAvatars = [
  { initials: 'SJ', color: 'bg-green-100' },
  { initials: 'MP', color: 'bg-yellow-100' },
  { initials: 'JD', color: 'bg-purple-100' },
  { initials: 'RK', color: 'bg-blue-100' },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, loading } = useAuth()
  const [visibility, setVisibility] = useState(2)

  useEffect(() => {
    if (user?.visibility_level) {
      setVisibility(user.visibility_level)
    }
  }, [user])

  const handleVisibilityChange = (level) => {
    setVisibility(level)
    // In a real app, we'd call the API to update visibility
  }

  const handleLogout = () => {
    logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const userName = user?.name || 'User'
  const userEmail = user?.email || 'user@mdx.ac.uk'
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-center px-5 py-4">
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center py-4 px-5">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl font-bold text-accent-blue">{initials}</span>
        </div>
        <h2 className="text-xl font-bold text-text-primary">{userName}</h2>
        <p className="text-sm text-text-secondary">{userEmail}</p>
      </div>

      {/* Visibility Settings */}
      <div className="px-5 py-4">
        <h3 className="text-lg font-bold text-text-primary mb-2">Location Visibility</h3>
        <p className="text-sm text-text-secondary mb-4">
          Control who can see your location on campus
        </p>

        <div className="space-y-2.5">
          {visibilityLevels.map((level) => (
            <button
              key={level.level}
              onClick={() => handleVisibilityChange(level.level)}
              className={`w-full rounded-xl p-3.5 flex items-center gap-3 transition-all ${
                visibility === level.level 
                  ? 'bg-blue-100 border-2 border-accent-blue' 
                  : 'bg-bg-card border-2 border-transparent'
              }`}
            >
              <span className="text-xl">{level.icon}</span>
              <div className="flex-1 text-left">
                <p className={`text-sm font-semibold ${
                  visibility === level.level ? 'text-accent-blue' : 'text-text-primary'
                }`}>
                  {level.title}
                </p>
                <p className="text-xs text-text-secondary">{level.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                visibility === level.level 
                  ? 'border-accent-blue bg-accent-blue' 
                  : 'border-gray-300'
              }`}>
                {visibility === level.level && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Friends Section */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-text-primary">Friends</h3>
          <span className="text-sm text-text-secondary">12 connected</span>
        </div>

        <button className="w-full h-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 mb-4">
          <Plus size={16} className="text-text-secondary" />
          <span className="text-sm font-semibold text-text-primary">Add Friend via QR Code</span>
        </button>

        <div className="flex -space-x-2">
          {friendAvatars.map((friend, index) => (
            <div 
              key={index}
              className={`w-9 h-9 ${friend.color} rounded-full flex items-center justify-center border-2 border-white`}
            >
              <span className="text-xs font-semibold text-text-primary">{friend.initials}</span>
            </div>
          ))}
          <button 
            onClick={() => router.push('/friends')}
            className="w-9 h-9 bg-bg-card rounded-full flex items-center justify-center border-2 border-white"
          >
            <span className="text-xs text-text-secondary">+8</span>
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-5 py-6">
        <button
          onClick={handleLogout}
          className="w-full h-12 border border-danger-red text-danger-red font-semibold rounded-xl flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
