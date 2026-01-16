import { Link } from 'react-router-dom'

type Props = {
    message: string
    ctaText?: string
    ctaLink?: string
}

export default function EmptyState({ message, ctaText, ctaLink }: Props) {
    return (
        <div className="text-center py-12">
            <p className="text-gray-600 mb-4">{message}</p>
            {ctaText && ctaLink && (
                <Link to={ctaLink} className="inline-block py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover">
                    {ctaText}
                </Link>
            )}
        </div>
    )
}
