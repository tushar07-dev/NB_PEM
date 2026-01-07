import { renderHook, act } from '@testing-library/react'
import { useAsyncError } from '@/shared/hooks/useAsyncError'

// Mock the error logger
jest.mock('@/shared/services/errorLogger', () => ({
  logError: jest.fn(() => 'mock-error-id'),
}))

describe('useAsyncError', () => {
  it('should initialize with no error', () => {
    const { result } = renderHook(() => useAsyncError())

    expect(result.current.error).toBeNull()
    expect(result.current.isError).toBe(false)
    expect(result.current.errorId).toBeUndefined()
  })

  it('should set error when setError is called', () => {
    const { result } = renderHook(() => useAsyncError())

    act(() => {
      result.current.setError('Test error')
    })

    expect(result.current.error).toEqual(new Error('Test error'))
    expect(result.current.isError).toBe(true)
    expect(result.current.errorId).toBeDefined()
  })

  it('should clear error when clearError is called', () => {
    const { result } = renderHook(() => useAsyncError())

    act(() => {
      result.current.setError('Test error')
    })

    expect(result.current.isError).toBe(true)

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.isError).toBe(false)
    expect(result.current.errorId).toBeUndefined()
  })

  it('should handle successful async operation', async () => {
    const { result } = renderHook(() => useAsyncError())

    const mockAsyncFn = jest.fn().mockResolvedValue('success')

    let returnValue: string | undefined

    await act(async () => {
      returnValue = await result.current.handleAsyncError(mockAsyncFn)
    })

    expect(returnValue).toBe('success')
    expect(result.current.isError).toBe(false)
    expect(mockAsyncFn).toHaveBeenCalled()
  })

  it('should handle failed async operation', async () => {
    const { result } = renderHook(() => useAsyncError())

    const mockAsyncFn = jest.fn().mockRejectedValue(new Error('Async error'))

    let returnValue: string | undefined

    await act(async () => {
      returnValue = await result.current.handleAsyncError(mockAsyncFn)
    })

    expect(returnValue).toBeUndefined()
    expect(result.current.isError).toBe(true)
    expect(result.current.error?.message).toBe('Async error')
    expect(mockAsyncFn).toHaveBeenCalled()
  })
})