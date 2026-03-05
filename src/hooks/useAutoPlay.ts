import { useEffect, useRef } from "react"

type Args = {
  audioRef: React.RefObject<HTMLAudioElement | null>
  autoPlayKey?: number //音楽リストを押すとこの数字が変わり自動再生される。
}

export function useAutoPlay({ audioRef, autoPlayKey }: Args) {
  const didMountRef = useRef(false) //初回起動フラグ

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!didMountRef.current) { //読み込まれてすぐに自動再生されないようにするためのギミック
      didMountRef.current = true
      return
    }
    if (autoPlayKey === undefined) return

    audio.play().catch(() => {})
  }, [audioRef, autoPlayKey])
}