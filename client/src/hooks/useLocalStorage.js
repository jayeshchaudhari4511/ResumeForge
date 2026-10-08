/* ─────────────────────────────────────────────────────────────
   hooks/useLocalStorage.js
   A drop-in replacement for useState that persists its value
   in localStorage under `key`.

   Usage:
     const [value, setValue] = useLocalStorage('my-key', defaultValue)

   Features:
   • Reads from localStorage on first render (hydration)
   • Writes to localStorage on every state change via useEffect
   • Falls back to `defaultValue` if the key is missing or JSON
     parse fails (handles stale / corrupted storage gracefully)
   • Serialises with JSON.stringify / JSON.parse — supports
     strings, numbers, booleans, objects, and arrays
───────────────────────────────────────────────────────────── */
import { useState, useEffect } from 'react'

const STORAGE_PREFIX = 'resumeforge_'

/**
 * @template T
 * @param {string} key            - localStorage key (prefix is added automatically)
 * @param {T}      defaultValue   - fallback value when key is absent or invalid
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]}
 */
export function useLocalStorage(key, defaultValue) {
  const storageKey = STORAGE_PREFIX + key

  /* ── Lazy initialiser: read once from localStorage ── */
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw === null) return defaultValue
      return JSON.parse(raw)
    } catch {
      // Corrupted data — reset to default
      console.warn(`[useLocalStorage] Failed to parse key "${storageKey}". Using default.`)
      return defaultValue
    }
  })

  /* ── Sync to localStorage whenever value changes ── */
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value))
    } catch (err) {
      // Storage quota exceeded or private-browsing restriction
      console.warn(`[useLocalStorage] Failed to save key "${storageKey}":`, err)
    }
  }, [storageKey, value])

  return [value, setValue]
}

/* ─────────────────────────────────────────────────────────────
   clearResumeStorage()
   Helper to wipe all resumeforge_ keys — call on Reset.
───────────────────────────────────────────────────────────── */
export function clearResumeStorage() {
  try {
    Object.keys(window.localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => window.localStorage.removeItem(k))
  } catch (err) {
    console.warn('[clearResumeStorage] Failed:', err)
  }
}
