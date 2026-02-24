import { Box, Image, ScrollArea, SimpleGrid } from '@chakra-ui/react'
import type { Track } from '../../type/Track'

type Props = {
  tracks: Track[]
  onSelect: (track: Track) => void
}

function TrackList({ onSelect, tracks}: Props) {
  return (
    <ScrollArea.Root height="336px" w="fit-content" mx="auto">
      <ScrollArea.Viewport style={{ paddingInline: '16px' }}>
        <ScrollArea.Content>
          <SimpleGrid columns={5} gap="24px">
            {tracks.map((track) => (
              <Box
                key={track.id}
                h="24"
                w="24"
                borderRadius="md"
                overflow="hidden"
                cursor="pointer"
                onClick={() => onSelect(track)}
                _hover={{ opacity: 0.9 }}
              >
                <Image
                  src={track.cover}
                  alt={track.title}
                  h="full"
                  w="full"
                  objectFit="cover"
                />
              </Box>
            ))}
          </SimpleGrid>
        </ScrollArea.Content>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  )
}

export default TrackList