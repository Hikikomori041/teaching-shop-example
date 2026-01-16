import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthContextProvider, useAuth } from './AuthContext'

vi.mock('../api/auth', () => ({
    getMe: vi.fn(),
}))

import { getMe } from '../api/auth'

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
    })

    it('should start with unauthenticated state', () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthContextProvider,
        })

        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.user).toBe(null)
        expect(result.current.token).toBe(null)
    })

    it('should login and store token', () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthContextProvider,
        })

        const mockUser = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            is_staff: false,
        }
        const mockToken = 'test-token-123'

        act(() => {
            result.current.login(mockToken, mockUser)
        })

        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.user).toEqual(mockUser)
        expect(result.current.token).toBe(mockToken)
        expect(localStorage.getItem('token')).toBe(mockToken)
        expect(JSON.parse(localStorage.getItem('user')!)).toEqual(mockUser)
    })

    it('should logout and clear token', () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthContextProvider,
        })

        const mockUser = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            is_staff: false,
        }
        const mockToken = 'test-token-123'

        act(() => {
            result.current.login(mockToken, mockUser)
        })

        act(() => {
            result.current.logout()
        })

        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.user).toBe(null)
        expect(result.current.token).toBe(null)
        expect(localStorage.getItem('token')).toBe(null)
        expect(localStorage.getItem('user')).toBe(null)
    })

    it('should restore auth state localStorage', async () => {
        const mockUser = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            is_staff: false,
        }
        const mockToken = 'test-token-123'
        localStorage.setItem('token', mockToken)

        vi.mocked(getMe).mockResolvedValue(mockUser)

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthContextProvider,
        })

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.token).toBe(mockToken)
        expect(result.current.user).toEqual(mockUser)
        expect(getMe).toHaveBeenCalledWith(mockToken)
    })

    it('should clear auth state if token validation fails', async () => {
        const mockToken = 'invalid-token'
        localStorage.setItem('token', mockToken)
        localStorage.setItem('user', JSON.stringify({ id: 1, username: 'old' }))

        vi.mocked(getMe).mockRejectedValue(new Error('Token validation failed'))

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthContextProvider,
        })

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.token).toBe(null)
        expect(result.current.user).toBe(null)
        expect(localStorage.getItem('token')).toBe(null)
        expect(localStorage.getItem('user')).toBe(null)
    })
})
