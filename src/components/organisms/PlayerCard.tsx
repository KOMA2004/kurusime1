import { Flex, Image, Stack, Text, Button } from '@chakra-ui/react'
import { AudioPlayer } from '../molecules/AudioPlayer'
import type { Track } from '../../type/Track'


type Props = {
  now: Track
  autoPlayKey?: number
}

export function PlayerCard({ now, autoPlayKey }: Props) {
  return (
    <Flex
      align="center"
      gap={4}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      justify="space-between"
    >
      <Flex align="center" gap={4}>
        <Image rounded="md" src={now.cover} alt={now.title} h="24" w="24" />

        <Stack>
          <Text fontSize="xs" color="gray.600" letterSpacing="0.08em">
            Now Playing
          </Text>

          <Flex align="baseline" gap="2">
            <Text fontSize="2xl" fontWeight="bold">
              {now.title}
            </Text>
            <Text fontSize="sm" color="gray.600">
              / {now.artist}
            </Text>
          </Flex>

          <AudioPlayer src={now.src} autoPlayKey={autoPlayKey} />
        </Stack>
      </Flex>

      <Button
        asChild
        size="sm"
        colorPalette="teal"
        disabled={!now.isFree}
      >
        <a href={now.src} download>
          Download
        </a>
      </Button>
    </Flex>
  )
}
