import type { ReactNode, FormEventHandler } from 'react'
import { Link } from 'react-router-dom'

type Props = {
    title: string
    subtitle?: string
    linkText: string
    linkTo: string
    children: ReactNode
    onSubmit: FormEventHandler
}

export default function AuthFormLayout({ title, subtitle, linkText, linkTo, children, onSubmit }: Props) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {subtitle}{' '}
                        <Link to={linkTo} className="font-medium text-primary hover:text-primary-light">
                            {linkText}
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    {children}
                </form>
            </div>
        </div>
    )
}
