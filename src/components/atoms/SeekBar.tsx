import { Slider, Text } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { formatTime } from '../../lib/formatTime'

type Props = {
  duration: number
  audioRef: React.RefObject<HTMLAudioElement | null>
  currentTime: number
  setCurrentTime: (v: number) => void
  setIsSeeking: (v: boolean) => void
}

function SeekBar({
  duration,
  audioRef,
  currentTime,
  setCurrentTime,
  setIsSeeking,
}: Props) {
  const [seekTime, setSeekTime] = useState<number | null>(null)

  const seekTimeRef = useRef<number | null>(null)
  const currentTimeRef = useRef<number>(0)

  useEffect(() => {
    seekTimeRef.current = seekTime
  }, [seekTime])

  useEffect(() => {
    currentTimeRef.current = currentTime
  }, [currentTime])

  const shownTime = seekTime ?? currentTime

  const seekValue = useMemo(
    () => [Math.min(shownTime, duration || 0)],
    [shownTime, duration],
  )

  const commit = useCallback(() => {
    const audio = audioRef.current
    const v = seekTimeRef.current ?? currentTimeRef.current

    if (audio) audio.currentTime = v
    setCurrentTime(v)
    setSeekTime(null)
    setIsSeeking(false)
  }, [audioRef, setCurrentTime, setIsSeeking])

  useEffect(() => {
    if (seekTime === null) return

    window.addEventListener('pointerup', commit)
    window.addEventListener('pointercancel', commit)

    return () => {
      window.removeEventListener('pointerup', commit)
      window.removeEventListener('pointercancel', commit)
    }
  }, [seekTime, commit])

  return (
    <>
      <Text data-testid="seekbar-shown-time" fontSize="sm" w="52px" textAlign="right">
        {formatTime(shownTime)}
      </Text>

      <Slider.Root data-testid="seekbar-root"
        flex="1"
        min={0}
        max={Math.max(duration, 0.0001)}
        step={0.1}
        value={seekValue}
        onValueChange={(e) => {
          const v = e.value[0] ?? 0
          setSeekTime(v)
        }}
        onPointerDownCapture={() => {
          setIsSeeking(true)
          setSeekTime(currentTime)
        }}

        onPointerUpCapture={commit}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>

      <Text fontSize="sm" w="52px">
        {formatTime(duration)}
      </Text>
    </>
  )
}

export default SeekBar