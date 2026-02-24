import { useEffect, useRef } from "react"

type Args = {
  audioRef: React.RefObject<HTMLAudioElement | null>
  autoPlayKey?: number
}

export function useAutoPlay({ audioRef, autoPlayKey }: Args) {
  const didMountRef = useRef(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    if (autoPlayKey === undefined) return

    audio.play().catch(() => {})
  }, [audioRef, autoPlayKey])
}