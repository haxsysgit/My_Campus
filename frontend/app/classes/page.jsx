'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import { api } from '@/lib/api'
import { ClassCard } from '@/components/ClassCard'

export default function ClassPulsePage() {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const today = new Date()
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dateString = `${dayNames[today.getDay()]}, ${monthNames[today.getMonth()]} ${today.getDate()}`

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await api.getTodaysClasses()
        setClasses(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [])

  const getClassVariant = (classData, index) => {
    const now = new Date()
    const [startHour, startMin] = classData.start_time.split(':').map(Number)
    const [endHour, endMin] = classData.end_time.split(':').map(Number)
    
    const startTime = new Date()
    startTime.setHours(startHour, startMin, 0)
    
    const endTime = new Date()
    endTime.setHours(endHour, endMin, 0)

    if (now >= startTime && now <= endTime) return 'current'
    if (now > endTime) return 'completed'
    if (index === 0 || now < startTime) return 'upcoming'
    return 'default'
  }

  const totalAttendance = classes.reduce((acc, c) => {
    if (c.headcount) {
      acc.checkedIn += c.headcount.checked_in
      acc.total += c.headcount.total
    }
    return acc
  }, { checkedIn: 0, total: 0 })

  const attendanceRate = totalAttendance.total > 0 
    ? Math.round((totalAttendance.checkedIn / totalAttendance.total) * 100) 
    : 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h1 className="text-2xl font-bold text-text-primary">ClassPulse</h1>
        <button 
          onClick={() => router.push('/classes/scan')}
          className="w-11 h-11 bg-accent-blue rounded-xl flex items-center justify-center"
        >
          <Camera size={20} className="text-white" />
        </button>
      </div>

      {/* Today's Classes */}
      <div className="px-5 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-text-primary">Today's Classes</h2>
          <span className="text-sm font-medium text-text-secondary">{dateString}</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-danger-red">{error}</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-secondary">No classes scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {classes.map((classData, index) => (
              <ClassCard 
                key={classData.id} 
                classData={classData} 
                variant={getClassVariant(classData, index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Attendance Stats */}
      <div className="px-5 py-4">
        <h2 className="text-lg font-bold text-text-primary mb-3">Your Attendance</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-2xl p-4 flex flex-col items-center justify-center h-20">
            <span className="text-2xl font-bold text-accent-green">{attendanceRate}%</span>
            <span className="text-xs text-text-secondary">This Week</span>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center justify-center h-20">
            <span className="text-2xl font-bold text-accent-blue">{classes.length}</span>
            <span className="text-xs text-text-secondary">Classes Today</span>
          </div>
        </div>
      </div>
    </div>
  )
}
