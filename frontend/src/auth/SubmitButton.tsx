type Props = {
    loading: boolean
    loadingText: string
    text: string
}

export default function SubmitButton({ loading, loadingText, text }: Props) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:opacity-50"
        >
            {loading ? loadingText : text}
        </button>
    )
}
