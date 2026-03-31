type Props = {
  label: string
  name: string
  value: number | string
  onChange: (val: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export default function Field({
  label,
  name,
  value,
  onChange,
  min = 0,
  step = 1,
  className = '',
}: Props) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={name} className="text-xs text-slate-500 font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
      />
    </div>
  )
}