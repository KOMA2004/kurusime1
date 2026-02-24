import { screen, fireEvent } from "@testing-library/react";
import PauseToggle from "../components/atoms/PauseToggle";
import { renderWithChakra } from "../test/test-utils";


describe("PauseToggle", () => {
  test("再生ボタンを押すと play が呼ばれる", () => {
    const playMock = jest.fn().mockResolvedValue(undefined);
    const pauseMock = jest.fn();

    const audio = {
      paused: true,
      play: playMock,
      pause: pauseMock,
    } as unknown as HTMLAudioElement;

    const audioRef = { current: audio };

    renderWithChakra(
      <PauseToggle isPlaying={false} audioRef={audioRef} />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(playMock).toHaveBeenCalled();
  });

  test("停止ボタンを押すと pause が呼ばれる", () => {
    const playMock = jest.fn().mockResolvedValue(undefined);
    const pauseMock = jest.fn();

    const audio = {
      paused: false,
      play: playMock,
      pause: pauseMock,
    } as unknown as HTMLAudioElement;

    const audioRef = { current: audio };

    renderWithChakra(
      <PauseToggle isPlaying={true} audioRef={audioRef} />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(pauseMock).toHaveBeenCalled();
  });
});