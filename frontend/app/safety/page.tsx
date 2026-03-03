'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'

const safetyOptions = [
  { 
    id: 'route', 
    icon: '🛡️', 
    iconBg: 'bg-blue-100',
    title: 'Night Safe Route',
    subtitle: 'Well-lit paths only'
  },
  { 
    id: 'share', 
    icon: '📍', 
    iconBg: 'bg-green-100',
    title: 'Share My Location',
    subtitle: 'With trusted contacts'
  },
  { 
    id: 'security', 
    icon: '📞', 
    iconBg: 'bg-yellow-100',
    title: 'Contact Security',
    subtitle: 'Campus security team'
  },
  { 
    id: 'occupancy', 
    icon: '🏢', 
    iconBg: 'bg-purple-100',
    title: 'Building Occupancy',
    subtitle: 'See how busy areas are'
  },
]

export default function SafetyPage() {
  const router = useRouter()
  const [alerting, setAlerting] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [alertSent, setAlertSent] = useState(false)

  let holdTimer = null
  let progressInterval = null

  const handlePressStart = () => {
    setHoldProgress(0)
    progressInterval = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          triggerAlert()
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const handlePressEnd = () => {
    clearInterval(progressInterval)
    if (holdProgress < 100) {
      setHoldProgress(0)
    }
  }

  const triggerAlert = async () => {
    setAlerting(true)
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await api.sendEmergencyAlert(
              position.coords.latitude,
              position.coords.longitude
            )
            setAlertSent(true)
          },
          async () => {
            // Fallback if geolocation fails
            await api.sendEmergencyAlert(51.5899, -0.2284)
            setAlertSent(true)
          }
        )
      } else {
        await api.sendEmergencyAlert(51.5899, -0.2284)
        setAlertSent(true)
      }
    } catch (err) {
      console.error('Alert failed:', err)
    } finally {
      setAlerting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-center px-5 py-4">
        <h1 className="text-2xl font-bold text-text-primary">Safety Center</h1>
      </div>

      {/* Emergency Button Section */}
      <div className="flex flex-col items-center py-6 px-5">
        {alertSent ? (
          <div className="flex flex-col items-center">
            <div className="w-[200px] h-[200px] bg-accent-green rounded-full flex flex-col items-center justify-center shadow-lg">
              <span className="text-5xl mb-2">✓</span>
              <span className="text-white text-lg font-extrabold">ALERT SENT</span>
              <span className="text-white/60 text-xs mt-1">Help is on the way</span>
            </div>
            <button 
              onClick={() => setAlertSent(false)}
              className="mt-4 text-accent-blue font-medium"
            >
              Reset
            </button>
          </div>
        ) : (
          <>
            <button
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              disabled={alerting}
              className="relative w-[200px] h-[200px] bg-danger-red rounded-full flex flex-col items-center justify-center shadow-2xl transition-transform active:scale-95 disabled:opacity-50"
              style={{
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.5)'
              }}
            >
              {/* Progress ring */}
              {holdProgress > 0 && (
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="100"
                    cy="100"
                    r="96"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeDasharray={`${holdProgress * 6.03} 603`}
                    className="transition-all"
                  />
                </svg>
              )}
              <span className="text-5xl mb-2">🆘</span>
              <span className="text-white text-lg font-extrabold">EMERGENCY</span>
              <span className="text-white/60 text-xs mt-1">Hold to alert</span>
            </button>
            <p className="text-text-secondary text-sm mt-4 text-center">
              Alerts security with your location
            </p>
          </>
        )}
      </div>

      {/* Safety Options */}
      <div className="px-5 py-4">
        <h2 className="text-lg font-bold text-text-primary mb-3">Safety Features</h2>
        <div className="space-y-3">
          {safetyOptions.map((option) => (
            <button
              key={option.id}
              className="w-full bg-bg-card rounded-2xl p-4 flex items-center gap-3"
            >
              <div className={`w-11 h-11 ${option.iconBg} rounded-xl flex items-center justify-center`}>
                <span className="text-xl">{option.icon}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-text-primary">{option.title}</p>
                <p className="text-xs text-text-secondary">{option.subtitle}</p>
              </div>
              <ChevronRight size={20} className="text-text-tertiary" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
