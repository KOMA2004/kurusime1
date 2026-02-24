import { useEffect, useRef, useState } from "react"

type Args = {
  audioRef: React.RefObject<HTMLAudioElement | null>
  src: string
}

export function useAudioState({ audioRef, src }: Args) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const [isSeeking, setIsSeeking] = useState(false)
  const isSeekingRef = useRef(false)
  useEffect(() => {
    isSeekingRef.current = isSeeking
  }, [isSeeking])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.load()
  }, [audioRef, src])

  // audioイベント購読
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoadedMetadata = () => setDuration(audio.duration || 0)
    const onTimeUpdate = () => {
      if (!isSeekingRef.current) setCurrentTime(audio.currentTime || 0)
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("ended", onEnded)
    }
  }, [audioRef])

  return {
    isPlaying,
    duration,
    currentTime,
    setCurrentTime,
    isSeeking,
    setIsSeeking,
  }
}