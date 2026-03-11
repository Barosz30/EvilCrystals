import { useState, useEffect } from 'react'
import Lottie from 'lottie-react'

interface LottieCharacterProps {
  /** URL do pliku JSON (Lottie) – np. /animations/mage-idle.json lub pełny URL */
  url: string
  /** Klasy kontenera (rozmiar, pozycja) */
  className?: string
  /** Czy zapętlać animację */
  loop?: boolean
}

/**
 * Ładuje animację Lottie z URL i odtwarza ją.
 * Używaj dla maga, namiotu lub efektów – gdy url jest ustawiony w scene/config.
 */
export function LottieCharacter({ url, className = '', loop = true }: LottieCharacterProps) {
  const [data, setData] = useState<object | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setError(null)
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`
    fetch(fullUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      })
    return () => {
      cancelled = true
    }
  }, [url])

  if (error) {
    return (
      <div className={className} title={`Błąd ładowania animacji: ${error}`}>
        <span className="text-amber-100/60 text-xs">[Animacja niedostępna]</span>
      </div>
    )
  }

  if (!data) {
    return <div className={className} aria-busy="true" />
  }

  return (
    <Lottie
      animationData={data}
      loop={loop}
      className={className}
      style={{ width: '100%', height: '100%', margin: 0 }}
    />
  )
}
