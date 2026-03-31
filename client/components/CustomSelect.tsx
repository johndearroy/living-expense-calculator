'use client'

import { useState, useRef, useEffect } from 'react'

type Option = {
  value: string | number
  label: string
}

type Props = {
  label?: string
  value: string | number
  options: Option[]
  onChange: (val: string | number) => void
  disabled?: boolean
}

export default function CustomSelect({ label, value, options, onChange, disabled = false }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs text-slate-500 font-medium">{label}</span>
      )}
      <div ref={ref} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          className={`w-full flex items-center justify-between border rounded-md px-3 py-2 text-sm text-left transition-colors bg-white
            ${disabled ? 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50' : 'border-slate-200 text-slate-800 hover:border-amber-400 cursor-pointer'}
            ${open ? 'border-amber-400 ring-2 ring-amber-100' : ''}
          `}
        >
          <span>{selected?.label || 'Select...'}</span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors
                  ${opt.value === value
                    ? 'bg-amber-50 text-amber-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}