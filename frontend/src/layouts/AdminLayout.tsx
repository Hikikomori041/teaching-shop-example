import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LoadingSpinner } from '../components'

export default function AdminLayout() {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }

        if (!user?.is_staff) {
            navigate('/')
        }
    }, [user, isAuthenticated, navigate])

    if (!isAuthenticated || !user?.is_staff) {
        return <LoadingSpinner />
    }

    return <Outlet />
}
