'use client'

import { useEffect, useState } from 'react'

export default function AnimatedStats() {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)

  useEffect(() => {
    const duration = 2000
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setCount1(Math.floor(easeOut * 1200))
      setCount2(Math.floor(easeOut * 6))

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl" style={{ backgroundColor: '#0a1628' }}>
      {[
        { value: `+ ${count1.toLocaleString('fr-FR')}`, label: 'bilans éducatifs réalisés' },
        { value: count2, label: 'simulateurs actifs' },
        { value: '100%', label: 'indépendant et gratuit' },
        { value: 'Gratuit', label: 'pour toujours' },
      ].map((stat, i) => (
        <div key={i} className="text-center" style={i < 3 ? { borderRight: '1px solid rgba(255,255,255,0.06)' } : {}}>
          <div className="text-3xl font-bold text-[#4ade80] mb-2" style={{ fontFamily: 'var(--font-syne)' }}>{stat.value}</div>
          <div className="text-[#64748b] text-xs">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
