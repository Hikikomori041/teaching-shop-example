import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getMe } from '../api/auth'

interface User {
    id: number
    username: string
    email: string
    is_staff: boolean
}

interface AuthContextType {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (token: string, user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const validateToken = async () => {
            const storedToken = localStorage.getItem('token')
            if (!storedToken) {
                setIsLoading(false)
                return
            }

            try {
                const user = await getMe(storedToken)
                setToken(storedToken)
                setUser(user)
                localStorage.setItem('user', JSON.stringify(user))
            } catch {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            } finally {
                setIsLoading(false)
            }
        }

        validateToken()
    }, [])

    const login = (newToken: string, newUser: User) => {
        setToken(newToken)
        setUser(newUser)
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthContextProvider')
    }
    return context
}
