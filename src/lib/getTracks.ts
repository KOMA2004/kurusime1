import { supabase } from "./supabase"
import type { Track } from "../type/Track"

export async function getTracks(): Promise<Track[]> {
  const { data, error } = await supabase
    .from("Tracks")
    .select("*")
    .order("id")

  if (error) {
    return []
  }

  return data ?? []
}