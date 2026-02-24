// src/__tests__/SeekBar.test.tsx

// ★ 必ず「最上部」に置く（SeekBar を import する前）
// これが下にあるとモックが効かず ContextError になります
jest.mock("@chakra-ui/react", () => {
  const actual = jest.requireActual("@chakra-ui/react");

  // SeekBar が使ってる分だけの簡易 Slider 実装
  // UIの正しさではなく、SeekBarロジックの正しさをテストするためのモック
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
            onValueChange?.({ value: [v] }); // Chakra Slider と同じ形
          }}
        />
      </div>
    ),
    Control: ({ children }: any) => <>{children}</>,
    Track: ({ children }: any) => <>{children}</>,
    Range: () => null,
    Thumbs: () => null,
  };

  // Text も Chakra context 依存があるので簡易化
  const Text = ({ children, ...p }: any) => <p {...p}>{children}</p>;

  return { ...actual, Slider, Text };
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// ★ ここはあなたのプロジェクトに合わせてパスを直す
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

    // シーク開始（SeekBar の onPointerDownCapture が走る）
    const input = screen.getByTestId("mock-slider-input");
    fireEvent.pointerDown(input);

    // 20秒へ移動（SeekBar の onValueChange が走り seekTime が更新される）
    fireEvent.change(input, { target: { value: "20" } });

    // 表示が 0:20 になっていることを確認
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

    // シーク開始
    fireEvent.pointerDown(input);

    // 20秒へ
    fireEvent.change(input, { target: { value: "20" } });

    // SeekBar の実装は seekTime !== null のとき window pointerup でも commit される
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

    // Rootに onPointerUpCapture が付いてるので、input側で pointerUp を起こせば commit が走る
    fireEvent.pointerUp(input);

    expect(audio.currentTime).toBe(20);
    expect(setCurrentTime).toHaveBeenCalledWith(20);
    expect(setIsSeeking).toHaveBeenCalledWith(false);
  });
});