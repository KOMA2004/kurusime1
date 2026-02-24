
import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { PlayerCard } from './components/organisms/PlayerCard'
import TrackList from './components/organisms/TrackList'
import { StatusView } from './components/atoms/StatusView'

import type { Track } from './type/Track'
import { getTracks } from './lib/getTracks'

function App() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [nowBGM, setNowBGM] = useState<Track | null>(null)
  const [autoPlayKey, setAutoPlayKey] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>(
    'loading'
  )
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setStatus('loading')
        const data = await getTracks()
        setTracks(data)

        if (data.length === 0) {
          setStatus('empty')
          setNowBGM(null)
          return
        }

        setNowBGM(data[0])
        setStatus('ready')
      } catch (e) {
        setStatus('error')
        setErrorMsg(e instanceof Error ? e.message : String(e))
      }
    })()
  }, [])

  const onSelect = (track: Track) => {
    setNowBGM(track)
    setAutoPlayKey((k) => k + 1)
  }

  if (status !== 'ready' || !nowBGM) {
    return (
      <StatusView
        status={status}
        errorMsg={errorMsg}
      />
    )
  }

  const now = nowBGM

  return (
    <Stack align="center" pt="3">
      <Heading fontSize="2xl">MEMORIAL SHOP ver1.0</Heading>
      <Text>著作権フリーのBGMをダウンロードできます。</Text>

      <Box p={6}>
        <Stack gap={6}>
          <TrackList tracks={tracks} onSelect={onSelect} />
          <PlayerCard now={now} autoPlayKey={autoPlayKey} />
        </Stack>
      </Box>
    </Stack>
  )
}

export default App