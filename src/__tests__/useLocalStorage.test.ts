import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLocalStorage, clearResumeStorage } from '../hooks/useLocalStorage'

describe('useLocalStorage hook', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('returns default value when key does not exist in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'))
    expect(result.current[0]).toBe('default-value')
  })

  it('reads existing initial value from localStorage if present', () => {
    window.localStorage.setItem('resumeforge_test-key', JSON.stringify('stored-value'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'))
    expect(result.current[0]).toBe('stored-value')
  })

  it('updates state and persists to localStorage on setValue call', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', { count: 0 }))

    act(() => {
      result.current[1]({ count: 5 })
    })

    expect(result.current[0]).toEqual({ count: 5 })
    expect(JSON.parse(window.localStorage.getItem('resumeforge_test-key') || '')).toEqual({ count: 5 })
  })

  it('handles corrupted JSON in localStorage by falling back to default value', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    window.localStorage.setItem('resumeforge_corrupt-key', '{ invalid json ...')

    const { result } = renderHook(() => useLocalStorage('corrupt-key', 'safe-fallback'))
    expect(result.current[0]).toBe('safe-fallback')
    expect(warnSpy).toHaveBeenCalled()
  })

  it('clearResumeStorage wipes all resumeforge_ keys', () => {
    window.localStorage.setItem('resumeforge_key1', 'val1')
    window.localStorage.setItem('resumeforge_key2', 'val2')
    window.localStorage.setItem('other_app_key', 'keep_me')

    clearResumeStorage()

    expect(window.localStorage.getItem('resumeforge_key1')).toBeNull()
    expect(window.localStorage.getItem('resumeforge_key2')).toBeNull()
    expect(window.localStorage.getItem('other_app_key')).toBe('keep_me')
  })
})
