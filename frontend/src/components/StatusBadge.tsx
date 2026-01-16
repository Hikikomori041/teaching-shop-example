type Props = {
    status: 'paid' | 'failed' | 'pending'
}

const statusStyles = {
    paid: 'bg-success-bg text-success-text',
    failed: 'bg-error-bg text-error-text',
    pending: 'bg-warning-bg text-warning-text',
}

export default function StatusBadge({ status }: Props) {
    const label = status.charAt(0).toUpperCase() + status.slice(1)

    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>{label}</span>
}
