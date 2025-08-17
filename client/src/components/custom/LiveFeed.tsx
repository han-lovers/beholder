import { useEffect, useRef, useState } from 'react'

interface FeedItem {
  hora: string
  tipo: string
  descripcion: string
}

type LiveFeedProps = {
  onTipoCountChange?: (counts: {
    low: number
    medium: number
    high: number
  }) => void
}

export default function LiveFeed({ onTipoCountChange }: LiveFeedProps) {
  const selectedKey = localStorage.getItem('user_id') || ''
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [counts, setCounts] = useState({ low: 0, medium: 0, high: 0 })

  useEffect(() => {
    if (!selectedKey) return

    const fetchFeed = async () => {
      try {
        const response = await fetch(
          `https://api-257470668223.us-central1.run.app/v1/key_logger/warning/${selectedKey}`
        )
        const data = await response.json()
        const warnings = data.warnings
        console.log(warnings)

        if (Array.isArray(warnings)) {
          const mapped = warnings.map((item) => ({
            hora: item.created_at,
            tipo: item.importance,
            descripcion: item.description || item.descripcion || '',
          }))
          setFeed(mapped)

          const counts = { low: 0, medium: 0, high: 0 }
          mapped.forEach((item) => {
            if (item.tipo === 'low') counts.low++
            else if (item.tipo === 'medium') counts.medium++
            else if (item.tipo === 'high') counts.high++
          })
          setCounts(counts)
        }
      } catch (err) {
        console.error('Error fetching datos:', err)
      }
    }

    fetchFeed()

    const interval = setInterval(fetchFeed, 5000)

    return () => clearInterval(interval)
  }, [selectedKey])

  useEffect(() => {
    if (onTipoCountChange) {
      onTipoCountChange(counts)
    }
  }, [counts, onTipoCountChange])

  return (
    <div className="flex flex-col gap-2 w-full max-w-lg mx-auto p-4">
      {feed.length === 0 && (
        <div className="text-center text-muted-foreground">
          Sin actualizaciones recientes
        </div>
      )}
      {feed.map((item, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 p-3 bg-card rounded shadow border border-gray-200"
        >
          <div className="flex flex-col items-center min-w-[60px]">
            <span className="text-xs text-gray-500 font-mono">
              {new Date(item.hora).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
            <span className="text-xs text-gray-400 mt-1">{item.tipo}</span>
          </div>
          <div className="flex-1 text-left">
            <span className="font-medium">{item.descripcion}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
