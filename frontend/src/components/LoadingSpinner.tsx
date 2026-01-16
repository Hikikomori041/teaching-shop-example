type Props = {
    size?: 'sm' | 'md' | 'lg'
    fullScreen?: boolean
}

const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
}

export default function LoadingSpinner({ size = 'lg', fullScreen = true }: Props) {
    const spinner = <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`} />

    if (fullScreen) {
        return <div className="min-h-screen flex items-center justify-center">{spinner}</div>
    }

    return spinner
}
