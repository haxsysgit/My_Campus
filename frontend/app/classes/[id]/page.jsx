'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, Camera, Check } from 'lucide-react'
import { api } from '@/lib/api'

export default function ClassDetailPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id

  const [classData, setClassData] = useState(null)
  const [students, setStudents] = useState([])
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [checkingIn, setCheckingIn] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        const data = await api.getClassDetail(classId)
        setClassData(data.class_info)
        setStudents(data.students || [])
        setIsCheckedIn(data.is_checked_in || false)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchClassDetail()
  }, [classId])

  const handleCheckIn = async (qrCode) => {
    setCheckingIn(true)
    setError('')
    try {
      await api.checkInWithQR(qrCode)
      setIsCheckedIn(true)
      setShowScanner(false)
      // Refresh data
      const data = await api.getClassDetail(classId)
      setClassData(data.class_info)
      setStudents(data.students || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setCheckingIn(false)
    }
  }

  // Demo check-in for testing
  const handleDemoCheckIn = () => {
    if (classData) {
      handleCheckIn(`CAMPUS:${classData.code}:DEMO:test`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !classData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-danger-red mb-4">{error}</p>
        <button onClick={() => router.back()} className="text-accent-blue font-medium">
          Go Back
        </button>
      </div>
    )
  }

  const headcount = classData?.headcount || { checked_in: 0, total: 0 }
  const percentage = headcount.total > 0 
    ? Math.round((headcount.checked_in / headcount.total) * 100) 
    : 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-bg-card rounded-xl flex items-center justify-center"
        >
          <ChevronLeft size={24} className="text-text-primary" />
        </button>
        <h1 className="text-xl font-bold text-text-primary">Class Details</h1>
      </div>

      {/* Class Info Card */}
      <div className="mx-5 bg-blue-100 rounded-2xl p-5">
        <h2 className="text-xl font-bold text-text-primary mb-3">{classData?.name}</h2>
        
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🕐</span>
            <span className="text-sm text-text-secondary">
              {classData?.start_time} - {classData?.end_time}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg">📍</span>
            <span className="text-sm text-text-secondary">{classData?.room}</span>
          </div>
        </div>

        {/* Attendance Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-text-secondary">Attendance</span>
            <span className="text-sm font-semibold text-text-primary">
              {headcount.checked_in}/{headcount.total}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-green rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Check-in Section */}
      <div className="px-5 py-6 flex flex-col items-center">
        {isCheckedIn ? (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
              <Check size={40} className="text-accent-green" />
            </div>
            <p className="text-lg font-semibold text-accent-green">You're Checked In!</p>
          </div>
        ) : (
          <>
            <div className="w-36 h-36 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-5xl">📱</span>
            </div>
            <button
              onClick={handleDemoCheckIn}
              disabled={checkingIn}
              className="w-full bg-accent-blue text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Camera size={18} />
              {checkingIn ? 'Checking in...' : 'Scan to Check In'}
            </button>
            {error && <p className="text-danger-red text-sm mt-2">{error}</p>}
          </>
        )}
      </div>

      {/* Students Section */}
      <div className="px-5 pb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-base font-bold text-text-primary">Checked In Students</span>
          <span className="text-base font-bold text-accent-green">{headcount.checked_in}</span>
        </div>

        <div className="space-y-2">
          {students.slice(0, 4).map((student, index) => (
            <div 
              key={student.id || index}
              className="bg-bg-card rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-accent-blue rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {student.initials || student.name?.split(' ').map(n => n[0]).join('') || '?'}
                </span>
              </div>
              <span className="text-sm font-medium text-text-primary">{student.name}</span>
            </div>
          ))}
          
          {students.length > 4 && (
            <button className="w-full h-11 border border-gray-200 rounded-xl text-sm text-text-secondary">
              +{students.length - 4} more students
            </button>
          )}

          {students.length === 0 && (
            <p className="text-center text-text-tertiary py-4">No students checked in yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
