import { useState, useEffect } from 'react'

interface SpriteAnimationProps {
  /** Ścieżka do PNG (np. /sprites/mage-idle.png) */
  src: string
  /** Liczba klatek w jednym rzędzie (horizontal) */
  frameCount: number
  /** Szerokość jednej klatki w px (w pliku) */
  frameWidth: number
  /** Wysokość jednej klatki w px (w pliku) */
  frameHeight: number
  /** Klatki na sekundę (0 = nieruchoma, pierwsza klatka) */
  fps?: number
  /** Klasy kontenera */
  className?: string
  /** Czy zapętlać (domyślnie true) */
  loop?: boolean
  /** Opcjonalny rozmiar wyświetlania (skalowanie) – np. { width: 48, height: 48 } */
  displaySize?: { width: number; height: number }
}

/**
 * Odtwarza animację ze sprite sheetu (jedna linia klatek w PNG).
 * Umieść plik w public/sprites/ i podaj src np. /sprites/mage-idle.png.
 */
export function SpriteAnimation({
  src,
  frameCount,
  frameWidth,
  frameHeight,
  fps = 8,
  className = '',
  loop = true,
  displaySize
}: SpriteAnimationProps) {
  const [frame, setFrame] = useState(0)
  const interval = fps > 0 ? 1000 / fps : 0

  useEffect(() => {
    if (frameCount <= 1 || fps <= 0) return
    const id = setInterval(() => {
      setFrame((prev) => {
        const next = prev + 1
        if (next >= frameCount) return loop ? 0 : prev
        return next
      })
    }, interval)
    return () => clearInterval(id)
  }, [frameCount, interval, loop, fps])

  const clampedFrame = Math.min(frame, frameCount - 1)
  const width = displaySize?.width ?? frameWidth
  const height = displaySize?.height ?? frameHeight
  const backgroundSize = displaySize
    ? `${frameCount * width}px ${height}px`
    : undefined
  const backgroundPosition = displaySize
    ? `-${clampedFrame * width}px 0`
    : `-${clampedFrame * frameWidth}px 0`

  return (
    <div
      className={className}
      style={{
        width,
        height,
        backgroundImage: `url(${src})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition,
        backgroundSize,
        imageRendering: 'crisp-edges'
      }}
      aria-hidden
    />
  )
}
