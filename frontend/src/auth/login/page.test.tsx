import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from '../../contexts/AuthContext'
import LoginPage from './page'

const renderLoginPage = () => {
    return render(
        <BrowserRouter>
            <AuthContextProvider>
                <LoginPage />
            </AuthContextProvider>
        </BrowserRouter>
    )
}

describe('LoginPage', () => {
    it('should render login form', () => {
        renderLoginPage()

        expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    })

    it('should show link to register page', () => {
        renderLoginPage()

        expect(screen.getByText('create a new account')).toBeInTheDocument()
    })

    it('should allow typing in form fields', async () => {
        const user = userEvent.setup()
        renderLoginPage()

        const usernameInput = screen.getByPlaceholderText('Username')
        const passwordInput = screen.getByPlaceholderText('Password')

        await user.type(usernameInput, 'testuser')
        await user.type(passwordInput, 'password123')

        expect(usernameInput).toHaveValue('testuser')
        expect(passwordInput).toHaveValue('password123')
    })

    it('should submit form with credentials', async () => {
        const user = userEvent.setup()

        // Mock fetch
        const mockFetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve({
                    token: 'test-token',
                    user: { id: 1, username: 'testuser', email: 'test@example.com' },
                }),
        })
        vi.stubGlobal('fetch', mockFetch)

        renderLoginPage()

        await user.type(screen.getByPlaceholderText('Username'), 'testuser')
        await user.type(screen.getByPlaceholderText('Password'), 'password123')
        await user.click(screen.getByRole('button', { name: 'Sign in' }))

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/auth/login/',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ username: 'testuser', password: 'password123' }),
            })
        )
    })
})
