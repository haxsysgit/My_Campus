'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { api } from '@/lib/api'

const mockFriends = [
  { id: '1', name: 'Sarah Johnson', initials: 'SJ', building: 'Library', color: 'bg-green-100' },
  { id: '2', name: 'Mike Patel', initials: 'MP', building: 'Grove Building', color: 'bg-yellow-100' },
  { id: '3', name: 'Jane Doe', initials: 'JD', building: 'College Building', color: 'bg-purple-100' },
]

export default function FriendsPage() {
  const router = useRouter()
  const [friends, setFriends] = useState(mockFriends)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true)
      try {
        const data = await api.getFriendsLocations()
        if (data.friends && data.friends.length > 0) {
          setFriends(data.friends)
        }
      } catch (err) {
        console.log('Using mock data')
      } finally {
        setLoading(false)
      }
    }
    fetchFriends()
  }, [])

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
        <h1 className="text-xl font-bold text-text-primary">Friend Locations</h1>
      </div>

      {/* Map Placeholder */}
      <div className="relative bg-green-100 h-[360px] mx-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-semibold text-text-secondary">Campus Map</span>
        </div>
        
        {/* Friend pins on map */}
        {friends.map((friend, index) => (
          <div 
            key={friend.id}
            className="absolute"
            style={{ left: 100 + index * 80, top: 120 + index * 40 }}
          >
            <div className={`w-10 h-10 ${friend.color} rounded-full flex items-center justify-center border-2 border-white shadow-md`}>
              <span className="text-xs font-bold">{friend.initials}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Friends List */}
      <div className="px-5 py-4">
        <h3 className="text-base font-bold text-text-primary mb-3">Active Friends</h3>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-bg-card rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div 
                key={friend.id}
                className="bg-bg-card rounded-xl p-3 flex items-center gap-3"
              >
                <div className={`w-11 h-11 ${friend.color} rounded-full flex items-center justify-center`}>
                  <span className="text-sm font-bold">{friend.initials}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">{friend.name}</p>
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <span>📍</span> {friend.building}
                  </p>
                </div>
                <div className="w-2 h-2 bg-accent-green rounded-full" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
