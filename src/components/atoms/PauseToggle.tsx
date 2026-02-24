import { IconButton } from '@chakra-ui/react'

import { LuPause, LuPlay } from 'react-icons/lu'

type Props = {
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>
}

function PauseToggle({isPlaying, audioRef}:Props) {
  
  const togglePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      try {
        await audio.play()
      } catch {console.log()}
    } else {
      audio.pause()
    }
  }

  return (
    <IconButton
      aria-label={isPlaying ? 'pause' : 'play'}
      onClick={togglePlayPause}
      size="sm"
    >
      {isPlaying ? <LuPause /> : <LuPlay />}
    </IconButton>
  )
}

export default PauseToggle
