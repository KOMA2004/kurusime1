import React from 'react'
import { render } from '@testing-library/react'
import { AudioPlayer } from '../components/molecules/AudioPlayer'
import { Provider } from '../components/ui/provider'

//jest.fnで偽の関数を作る
const VolumeMeterMock = jest.fn((_props: unknown) => {
  void _props
  ;<div data-testid="volume" />
})
const PauseToggleMock = jest.fn((_props: unknown) => {
  void _props
  ;<button data-testid="pause" />
})
const SeekBarMock = jest.fn((_props: unknown) => {
  void _props
  ;<div data-testid="seek" />
})

//jest.mockで偽物のコンポーネントを作る
jest.mock('../components/atoms/VolumeMeter', () => ({
  __esModule: true, //昔の型(CommonJS)から変換する
  default: (props: unknown) => VolumeMeterMock(props),
}))

jest.mock('../components/atoms/PauseToggle', () => ({
  __esModule: true,
  default: (props: unknown) => PauseToggleMock(props),
}))

jest.mock('../components/atoms/SeekBar', () => ({
  __esModule: true,
  default: (props: unknown) => SeekBarMock(props),
}))

// hooks をモック
const useAudioStateMock = jest.fn()
const useAutoPlayMock = jest.fn()

jest.mock('../hooks/useAudioState', () => ({
  __esModule: true,
  useAudioState: (args: unknown) => useAudioStateMock(args),
}))

jest.mock('../hooks/useAutoPlay', () => ({
  __esModule: true,
  useAutoPlay: (args: unknown) => useAutoPlayMock(args),
}))

function renderWithChakra(ui: React.ReactElement) {
  return render(<Provider>{ui}</Provider>)
}

beforeEach(() => {
  jest.clearAllMocks()

  // useAudioState の返り値（AudioPlayerが使ってる分だけ）
  useAudioStateMock.mockReturnValue({
    isPlaying: true,
    duration: 123,
    currentTime: 45,
    setCurrentTime: jest.fn(),
    setIsSeeking: jest.fn(),
  })
})

test('audioタグにsrcがセットされる', () => {
  renderWithChakra(<AudioPlayer src="/music/a.wav" />)
  const audio = document.querySelector('audio') as HTMLAudioElement | null
  expect(audio).not.toBeNull() //nullじゃないかを見る
  expect(audio?.getAttribute('src')).toBe('/music/a.wav') //HTMLの属性の値を見る。今回はaudioのsrc。
  expect(audio?.getAttribute('preload')).toBe('metadata')
})

test('useAudioState が audioRef と src で呼ばれる / atoms に必要なpropsが渡る', () => {
  renderWithChakra(<AudioPlayer src="/music/a.wav" autoPlayKey={10} />)

  // hook呼び出し検証
  expect(useAudioStateMock).toHaveBeenCalledTimes(1) //何回呼ばれたかを見る
  const args = useAudioStateMock.mock.calls[0][0] //１回目の１つ目の引数を見る
  expect(args.src).toBe('/music/a.wav')
  expect(args.audioRef).toBeDefined() // Undefinedでないかどうか

  expect(useAutoPlayMock).toHaveBeenCalledTimes(1)
  const autoArgs = useAutoPlayMock.mock.calls[0][0]
  expect(autoArgs.autoPlayKey).toBe(10)
  expect(autoArgs.audioRef).toBeDefined()

  expect(VolumeMeterMock).toHaveBeenCalledTimes(1)
  expect(PauseToggleMock).toHaveBeenCalledTimes(1)
  expect(SeekBarMock).toHaveBeenCalledTimes(1)

  type PauseToggleProps = {
    isPlaying: boolean
    audioRef: React.RefObject<HTMLAudioElement | null>
  }

  type SeekBarProps = {
    duration: number
    currentTime: number
    setCurrentTime: (t: number) => void
    setIsSeeking: (b: boolean) => void
  }

  const pauseProps = PauseToggleMock.mock.calls[0][0] as PauseToggleProps

  expect(pauseProps.isPlaying).toBe(true)
  expect(pauseProps.audioRef).toBeDefined()

  const seekProps = SeekBarMock.mock.calls[0][0] as SeekBarProps
  expect(seekProps.duration).toBe(123)
  expect(seekProps.currentTime).toBe(45)
  expect(typeof seekProps.setCurrentTime).toBe('function')
  expect(typeof seekProps.setIsSeeking).toBe('function')
})
