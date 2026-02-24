import { IconButton, Popover, Portal, Slider } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { LuVolume2, LuVolumeX } from 'react-icons/lu';

type Props = {audioRef: React.RefObject<HTMLAudioElement | null>}

function VolumeMeter({audioRef} : Props) {

  const [volume, setVolume] = useState(40)
  const lastVolume = useRef(40)
  const isMuted = volume === 0

   const [volOpen, setVolOpen] = useState(false)
    const volCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  
    const volOpenNow = () => {
      if (volCloseTimer.current) clearTimeout(volCloseTimer.current)
      setVolOpen(true)
    }
  
    const volCloseLater = () => {
      if (volCloseTimer.current) clearTimeout(volCloseTimer.current)
      volCloseTimer.current = setTimeout(() => setVolOpen(false), 200)
    }
  
    useEffect(() => {
      return () => {
        if (volCloseTimer.current) clearTimeout(volCloseTimer.current)
      }
    }, [])
  
    const toggleMute = () => {
      if (volume === 0) setVolume(Math.max(1, lastVolume.current))
      else {
        lastVolume.current = volume
        setVolume(0)
      }
    }

    useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = Math.min(1, Math.max(0, volume / 100))
  }, [volume, audioRef])


  return (
    <Popover.Root open={volOpen} positioning={{ placement: 'top' }}>
      <Popover.Trigger asChild>
        <IconButton
          size="sm"
          aria-label={isMuted ? 'unmute' : 'mute'}
          onPointerEnter={volOpenNow}
          onPointerLeave={volCloseLater}
          onClick={toggleMute}
        >
          {isMuted ? <LuVolumeX /> : <LuVolume2 />}
        </IconButton>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content
            w="56px"
            p="2"
            minW="unset"
            onPointerEnter={volOpenNow}
            onPointerLeave={volCloseLater}
          >
            <Slider.Root
              h="100px"
              orientation="vertical"
              min={0}
              max={100}
              step={1}
              value={[volume]}
              onValueChange={(e) => {
                const v = e.value[0] ?? 0
                setVolume(v)
                if (v > 0) lastVolume.current = v
              }}
            >
              <Slider.Control>
                <Slider.Track w="8px">
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
              </Slider.Control>
            </Slider.Root>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}

export default VolumeMeter
