
jest.mock("@chakra-ui/react", () => {
  const actual = jest.requireActual("@chakra-ui/react");

  const Slider = {
    Root: ({
      value,
      onValueChange,
      onPointerDownCapture,
      onPointerUpCapture,
      min,
      max,
      step,
      ...props
    }: any) => (
      <div {...props}>
        <input
          data-testid="mock-slider-input"
          type="range"
          min={min ?? 0}
          max={max ?? 100}
          step={step ?? 1}
          value={(value?.[0] ?? 0).toString()}
          onPointerDown={(e) => onPointerDownCapture?.(e)}
          onPointerUp={(e) => onPointerUpCapture?.(e)}
          onChange={(e) => {
            const v = Number((e.target as HTMLInputElement).value);
            onValueChange?.({ value: [v] });
          }}
        />
      </div>
    ),
    Control: ({ children }: any) => <>{children}</>,
    Track: ({ children }: any) => <>{children}</>,
    Range: () => null,
    Thumbs: () => null,
  };

  const Text = ({ children, ...p }: any) => <p {...p}>{children}</p>;

  return { ...actual, Slider, Text };
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import SeekBar from "../components/atoms/SeekBar";

describe("SeekBar", () => {
  test("シークバーを動かすと表示される再生時間が変わる", () => {
    const audio = document.createElement("audio");
    Object.defineProperty(audio, "currentTime", { value: 0, writable: true });
    const audioRef = { current: audio } as React.RefObject<HTMLAudioElement>;

    const setCurrentTime = jest.fn();
    const setIsSeeking = jest.fn();

    render(
      <SeekBar
        duration={120}
        audioRef={audioRef}
        currentTime={10}
        setCurrentTime={setCurrentTime}
        setIsSeeking={setIsSeeking}
      />
    );

    const shown = screen.getByTestId("seekbar-shown-time");
    expect(shown).toHaveTextContent("0:10");

    const input = screen.getByTestId("mock-slider-input");
    fireEvent.pointerDown(input);

    fireEvent.change(input, { target: { value: "20" } });

    expect(shown).toHaveTextContent("0:20");
  });

  test("シーク確定すると audio.currentTime と setCurrentTime が更新される（window pointerup）", () => {
    const audio = document.createElement("audio");
    Object.defineProperty(audio, "currentTime", { value: 0, writable: true });
    const audioRef = { current: audio } as React.RefObject<HTMLAudioElement>;

    const setCurrentTime = jest.fn();
    const setIsSeeking = jest.fn();

    render(
      <SeekBar
        duration={120}
        audioRef={audioRef}
        currentTime={10}
        setCurrentTime={setCurrentTime}
        setIsSeeking={setIsSeeking}
      />
    );

    const input = screen.getByTestId("mock-slider-input");

    fireEvent.pointerDown(input);

    fireEvent.change(input, { target: { value: "20" } });

    fireEvent(window, new Event("pointerup"));

    expect(audio.currentTime).toBe(20);
    expect(setCurrentTime).toHaveBeenCalledWith(20);
    expect(setIsSeeking).toHaveBeenCalledWith(false);
  });

  test("シーク確定すると audio.currentTime と setCurrentTime が更新される（Slider上 pointerup）", () => {
    const audio = document.createElement("audio");
    Object.defineProperty(audio, "currentTime", { value: 0, writable: true });
    const audioRef = { current: audio } as React.RefObject<HTMLAudioElement>;

    const setCurrentTime = jest.fn();
    const setIsSeeking = jest.fn();

    render(
      <SeekBar
        duration={120}
        audioRef={audioRef}
        currentTime={10}
        setCurrentTime={setCurrentTime}
        setIsSeeking={setIsSeeking}
      />
    );

    const input = screen.getByTestId("mock-slider-input");

    fireEvent.pointerDown(input);
    fireEvent.change(input, { target: { value: "20" } });

    fireEvent.pointerUp(input);

    expect(audio.currentTime).toBe(20);
    expect(setCurrentTime).toHaveBeenCalledWith(20);
    expect(setIsSeeking).toHaveBeenCalledWith(false);
  });
});