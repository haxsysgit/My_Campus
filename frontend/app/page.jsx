'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search } from 'lucide-react'

const buildings = [
  { id: 'college', code: 'C', name: 'College', color: '#3B82F6', x: 60, y: 90 },
  { id: 'grove', code: 'G', name: 'Grove', color: '#FF6B6B', x: 260, y: 70 },
  { id: 'library', code: 'L', name: 'Library', color: '#22C55E', x: 200, y: 200 },
  { id: 'mdx_house', code: 'M', name: 'MDX House', color: '#8B5CF6', x: 140, y: 50 },
  { id: 'hatchcroft', code: 'H', name: 'Hatchcroft', color: '#F59E0B', x: 90, y: 180 },
  { id: 'ritterman', code: 'R', name: 'Ritterman', color: '#EC4899', x: 300, y: 140 },
]

const quickActions = [
  { id: 'next', icon: '📍', label: 'Next Class', bg: 'bg-blue-50', href: '/classes' },
  { id: 'pulse', icon: '👥', label: 'ClassPulse', bg: 'bg-green-50', href: '/classes' },
  { id: 'emergency', icon: '🚨', label: 'Emergency', bg: 'bg-red-50', href: '/safety' },
]

export default function HomePage() {
  const router = useRouter()
  const [routeMode, setRouteMode] = useState('fastest')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-accent-blue rounded-xl" />
          <span className="text-xl font-bold text-text-primary">MyCampus</span>
        </div>
        <button className="w-10 h-10 bg-bg-card rounded-full flex items-center justify-center">
          <Bell size={18} className="text-text-primary" />
        </button>
      </div>

      {/* Map Area */}
      <div className="relative bg-green-100 h-[340px] mx-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold text-text-secondary">Middlesex University</span>
        </div>
        
        {/* Current Location */}
        <div 
          className="absolute w-11 h-11 bg-accent-blue rounded-full flex items-center justify-center shadow-lg"
          style={{ left: 170, top: 180 }}
        >
          <span className="text-xl">📍</span>
        </div>

        {/* Building Pins */}
        {buildings.map((bld) => (
          <div key={bld.id} className="absolute" style={{ left: bld.x, top: bld.y }}>
            <div 
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2"
              style={{ borderColor: bld.color }}
            >
              <span className="text-xs font-bold" style={{ color: bld.color }}>{bld.code}</span>
            </div>
            <span 
              className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap"
              style={{ color: bld.color }}
            >
              {bld.name}
            </span>
          </div>
        ))}
      </div>

      {/* Search Section */}
      <div className="px-5 py-4 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-2.5 bg-bg-card rounded-3xl h-12 px-4">
          <Search size={16} className="text-text-tertiary" />
          <input 
            type="text"
            placeholder="Search buildings, rooms..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        {/* Route Toggle */}
        <div className="flex bg-bg-card rounded-3xl h-11 p-1">
          <button 
            onClick={() => setRouteMode('fastest')}
            className={`flex-1 rounded-2xl flex items-center justify-center text-sm font-medium transition-all ${
              routeMode === 'fastest' ? 'bg-accent-blue text-white' : 'text-text-secondary'
            }`}
          >
            Fastest
          </button>
          <button 
            onClick={() => setRouteMode('safest')}
            className={`flex-1 rounded-2xl flex items-center justify-center text-sm font-medium transition-all ${
              routeMode === 'safest' ? 'bg-accent-blue text-white' : 'text-text-secondary'
            }`}
          >
            Safest
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5">
        <h3 className="text-base font-bold text-text-primary mb-3">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => router.push(action.href)}
              className={`${action.bg} rounded-2xl h-20 flex flex-col items-center justify-center gap-2`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-medium text-text-primary">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
