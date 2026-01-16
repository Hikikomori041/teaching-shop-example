import type { ChangeEventHandler } from 'react'

type Props = {
    id: string
    type: string
    placeholder: string
    value: string
    onChange: ChangeEventHandler<HTMLInputElement>
    position: 'first' | 'middle' | 'last' | 'only'
    required?: boolean
}

const positionClasses = {
    first: 'rounded-t-md',
    middle: '',
    last: 'rounded-b-md',
    only: 'rounded-md',
}

export default function FormField({ id, type, placeholder, value, onChange, position, required = true }: Props) {
    return (
        <div>
            <label htmlFor={id} className="sr-only">
                {placeholder}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                required={required}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${positionClasses[position]} focus:outline-none focus:ring-primary-light focus:border-primary-light focus:z-10 sm:text-sm`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}
