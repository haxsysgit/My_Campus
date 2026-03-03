'use client'

import Link from 'next/link'

export function ClassCard({ classData, variant = 'default' }) {
  const { id, code, name, room, start_time, end_time, headcount } = classData
  
  const variantStyles = {
    current: { bg: 'bg-blue-50', divider: 'bg-accent-blue' },
    upcoming: { bg: 'bg-gray-100', divider: 'bg-gray-800' },
    completed: { bg: 'bg-green-50', divider: 'bg-accent-green' },
    default: { bg: 'bg-gray-100', divider: 'bg-gray-400' },
  }
  
  const style = variantStyles[variant] || variantStyles.default
  const attendance = headcount ? `${headcount.checked_in}/${headcount.total}` : '—'
  const percentage = headcount ? Math.round((headcount.checked_in / headcount.total) * 100) : 0

  return (
    <Link href={`/classes/${id}`}>
      <div className={`${style.bg} rounded-2xl p-4 flex items-center gap-3`}>
        {/* Time Column */}
        <div className="flex flex-col items-center gap-0.5 min-w-[50px]">
          <span className="text-sm font-semibold text-text-primary">{start_time}</span>
          <span className="text-xs text-text-tertiary">to</span>
          <span className="text-sm font-medium text-text-secondary">{end_time}</span>
        </div>
        
        {/* Divider */}
        <div className={`w-[3px] h-[50px] rounded ${style.divider}`} />
        
        {/* Class Info */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-text-primary">{code}</span>
            <span className="text-xs text-text-secondary">{room}</span>
          </div>
          <span className="text-sm text-text-secondary">{name}</span>
          
          {/* Attendance Bar */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent-green rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-medium text-text-secondary">{attendance}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
