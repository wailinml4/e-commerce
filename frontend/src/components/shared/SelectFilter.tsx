import type { SelectOption } from '../../types'
import type { ElementType } from 'react'

interface SelectFilterProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  icon?: ElementType
  className?: string
}

const SelectFilter = ({ value, onChange, options, icon: Icon, className = '' }: SelectFilterProps) => {
  return (
    <div className={`relative ${className}`}>
      {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-4 w-4 z-10" />}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-white/15 ${
          Icon ? 'pl-10' : 'px-4'
        } pr-10 py-2.5 text-sm font-medium cursor-pointer`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-gray-900 text-gray-100">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

export default SelectFilter
