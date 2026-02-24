import { Box, HStack } from '@chakra-ui/react'
import { useRef } from 'react'
import VolumeMeter from '../atoms/VolumeMeter'
import PauseToggle from '../atoms/PauseToggle'
import SeekBar from '../atoms/SeekBar'
import { useAutoPlay } from '../../hooks/useAutoPlay'
import { useAudioState } from '../../hooks/useAudioState'

type Props = { src: string; autoPlayKey?: number }

export function AudioPlayer({ src, autoPlayKey }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const { isPlaying, duration, currentTime, setCurrentTime, setIsSeeking } = useAudioState({ audioRef, src })

  useAutoPlay({ audioRef, autoPlayKey })

  return (
    <Box pt="2" w="520px">
      <audio ref={audioRef} src={src} preload="metadata" />

      <HStack gap="3" align="center">
        <VolumeMeter audioRef={audioRef} />
        <PauseToggle isPlaying={isPlaying} audioRef={audioRef} />
        <SeekBar
          duration={duration}
          audioRef={audioRef}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          setIsSeeking={setIsSeeking}
        />
      </HStack>
    </Box>
  )
}
