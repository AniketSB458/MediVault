import { useEffect, useState } from 'react'

interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!active) return

    const startTimer = setTimeout(() => {
      setVisible(true)
    }, 10)

    const endTimer = setTimeout(() => {
      setVisible(false)
      if (onComplete) onComplete()
    }, 1800)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(endTimer)
    }
  }, [active, onComplete])

  if (!visible) return null

  const colors = ['#3185E8', '#4DBB7A', '#FFD66B', '#FF927D', '#9333EA', '#06B6D4']

  return (
    <div 
      style={{
        position: 'fixed',
        left: '50%',
        top: '40%',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)'
      }}
      aria-hidden="true"
    >
      {Array.from({ length: 42 }).map((_, i) => {
        const x = ((i * 37) % 440) - 220
        const y = -(((i * 23) % 200) + 100)
        const rot = (i * 73) % 360
        const color = colors[i % colors.length]
        const size = (i % 6) + 6

        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              position: 'absolute',
              width: size,
              height: size * 1.4,
              backgroundColor: color,
              borderRadius: 3,
              transform: `rotate(${rot}deg)`,
              animation: 'confetti-pop 1.6s cubic-bezier(0.25, 1, 0.5, 1) forwards',
              ['--tx' as string]: `${x}px`,
              ['--ty' as string]: `${y + 350}px`,
              ['--rot' as string]: `${rot + 720}deg`
            }}
          />
        )
      })}
    </div>
  )
}
