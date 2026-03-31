'use client'

import { useState } from 'react'

type Props = {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function Section({ title, children, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-slate-200 rounded-lg bg-white mb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
      >
        <span>{title}</span>
        <span className="text-slate-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  )
}