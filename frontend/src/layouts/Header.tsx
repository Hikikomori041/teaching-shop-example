import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth()

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-xl font-bold text-primary">
                        Boutique Couture
                    </Link>

                    <nav className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-gray-600">Hello, {user?.username}</span>
                                <Link to="/orders" className="text-gray-600 hover:text-primary">
                                    My Orders
                                </Link>
                                {user?.is_staff && (
                                    <Link to="/admin-panel" className="text-gray-600 hover:text-primary">
                                        Admin
                                    </Link>
                                )}
                                <button onClick={logout} className="text-gray-600 hover:text-primary">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-primary">
                                    Login
                                </Link>
                                <Link to="/register" className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover">
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
