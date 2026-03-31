'use client'

import type { CalculateInput, City, CityPreset, Band } from '@/lib/types'
import Section from './Section'
import Field from './Field'
import CustomSelect from './CustomSelect'

type Props = {
  cities: City[]
  form: CalculateInput
  onChange: (updated: Partial<CalculateInput>) => void
  onCityChange: (cityId: number) => void
  onBandChange: (band: Band) => void
  onCalculate: () => void
  onReset: () => void
  preset: CityPreset | null
  loading: boolean
}

const BUDGET_RANGES = [
  { label: '600-700', lower: 600, upper: 700 },
  { label: '800-900', lower: 800, upper: 900 },
  { label: '900-1000', lower: 900, upper: 1000 },
  { label: '1000-1200', lower: 1000, upper: 1200 },
  { label: '1200-1400', lower: 1200, upper: 1400 },
]

const HOUSING_TYPES = [
  { value: 'Shared room', label: 'Shared room' },
  { value: 'Studio',      label: 'Studio'      },
  { value: '1-bed',       label: '1-bed'        },
  { value: '2-bed',       label: '2-bed'        },
]

const BAND_OPTIONS: { value: Band; label: string }[] = [
  { value: 'low',     label: 'Low'     },
  { value: 'typical', label: 'Typical' },
  { value: 'high',    label: 'High'    },
]

export default function InputPanel({
  cities,
  form,
  onChange,
  onCityChange,
  onBandChange,
  onCalculate,
  onReset,
  preset,
  loading,
}: Props) {
  const midpoint = Math.round((form.budget_lower + form.budget_upper) / 2)
  const rentMid = Math.round((form.rent_lower + form.rent_upper) / 2)
  const rentShare = preset ? Math.round(rentMid / form.people_sharing) : rentMid
  const cityOptions = cities.map((c) => ({ value: c.id, label: c.name }))

  return (
    <div className="flex flex-col gap-0">

      {/* City preset and band */}
      <Section title="1) City preset and band">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <CustomSelect
            label="City"
            value={form.city_id}
            options={cityOptions}
            onChange={(v) => onCityChange(Number(v))}
          />
          <CustomSelect
            label="Housing type"
            value={form?.housing_type || 'Shared room'}
            options={HOUSING_TYPES}
            onChange={(v) => onChange({ housing_type: v as string } as any)}
          />
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <span className="text-xs text-slate-500 font-medium">Band</span>
          <div className="flex gap-4">
            {(['low', 'typical', 'high'] as Band[]).map((b) => (
              <label key={b} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="band"
                  value={b}
                  checked={form.band === b}
                  onChange={() => onBandChange(b)}
                  className="accent-amber-500"
                />
                <span className="text-sm text-slate-700 capitalize">{b}</span>
              </label>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Presets give realistic ranges. You can edit any value below.
        </p>
      </Section>

      {/* Budget range */}
      <Section title="2) Budget range">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field
            label="Budget lower (£/mo)"
            name="budget_lower"
            value={form.budget_lower}
            onChange={(v) => onChange({ budget_lower: v })}
          />
          <Field
            label="Budget upper (£/mo)"
            name="budget_upper"
            value={form.budget_upper}
            onChange={(v) => onChange({ budget_upper: v })}
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {BUDGET_RANGES.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => onChange({ budget_lower: r.lower, budget_upper: r.upper })}
              className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600 hover:border-amber-400 hover:text-amber-700 transition-colors bg-white"
            >
              £{r.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Midpoint used in checks: <span className="font-semibold text-slate-700">£{midpoint}</span>
        </p>
      </Section>

      {/* Housing and household */}
      <Section title="3) Housing and household">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field
            label="People sharing (incl. you)"
            name="people_sharing"
            value={form.people_sharing}
            onChange={(v) => onChange({ people_sharing: v })}
            min={1}
          />
          <Field
            label="Rent lower bound (£/mo)"
            name="rent_lower"
            value={form.rent_lower}
            onChange={(v) => onChange({ rent_lower: v })}
          />
        </div>
        <div className="mb-3">
          <Field
            label="Rent upper bound (£/mo)"
            name="rent_upper"
            value={form.rent_upper}
            onChange={(v) => onChange({ rent_upper: v })}
          />
        </div>
        <div className="flex gap-2 mb-2">
          {[
            { label: 'Lower', val: form.rent_lower },
            { label: 'Mid', val: rentMid },
            { label: 'Upper', val: form.rent_upper },
          ].map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => onChange({ rent_lower: r.val, rent_upper: r.val })}
              className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600 hover:border-amber-400 hover:text-amber-700 transition-colors bg-white"
            >
              {r.label} £{r.val}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Selected: <span className="font-semibold text-slate-700">£{rentShare}</span> (your share)
        </p>
        <div className="mb-3">
          <Field
            label="Deposit (your share) (£)"
            name="deposit"
            value={form.deposit}
            onChange={(v) => onChange({ deposit: v })}
          />
        </div>
        <div className="flex flex-col gap-2 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.bills_included}
              onChange={(e) => onChange({ bills_included: e.target.checked })}
              className="accent-amber-500"
            />
            <span className="text-sm text-slate-700">Bills included in rent</span>
          </label>
        </div>
        {!form.bills_included && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Electricity (£/mo)" name="electricity" value={form.electricity} onChange={(v) => onChange({ electricity: v })} />
            <Field label="Gas (£/mo)" name="gas" value={form.gas} onChange={(v) => onChange({ gas: v })} />
            <Field label="Water (£/mo)" name="water" value={form.water} onChange={(v) => onChange({ water: v })} />
            <Field label="Internet (£/mo)" name="internet" value={form.internet} onChange={(v) => onChange({ internet: v })} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.student_council_tax_exemption}
              onChange={(e) => onChange({ student_council_tax_exemption: e.target.checked })}
              className="accent-amber-500"
            />
            <span className="text-sm text-slate-700">Student council tax exemption</span>
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-amber-500 mt-0.5"
              defaultChecked
            />
            <span className="text-sm text-slate-700">
              I confirm the property has the correct HMO / Additional / Selective licence (or is exempt)
            </span>
          </label>
          <p className="text-xs text-slate-400">
            Not sure? Contact the local council
          </p>
        </div>
      </Section>

      {/* Food and drink */}
      <Section title="4) Food and drink (weekly)">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Groceries (£/week)" name="groceries_weekly" value={form.groceries_weekly} onChange={(v) => onChange({ groceries_weekly: v })} step={0.01} />
          <Field label="Meals out per week" name="meals_out_per_week" value={form.meals_out_per_week} onChange={(v) => onChange({ meals_out_per_week: v })} />
          <Field label="Avg meal out (£)" name="avg_meal_cost" value={form.avg_meal_cost} onChange={(v) => onChange({ avg_meal_cost: v })} step={0.5} />
          <Field label="Coffees per week" name="coffees_per_week" value={form.coffees_per_week} onChange={(v) => onChange({ coffees_per_week: v })} />
          <Field label="Avg coffee (£)" name="avg_coffee_cost" value={form.avg_coffee_cost} onChange={(v) => onChange({ avg_coffee_cost: v })} step={0.1} />
        </div>
      </Section>

      {/* Transport */}
      <Section title="5) Transport">
        <Field
          label="Pass (£/mo) — 0 = none"
          name="transport_pass"
          value={form.transport_pass}
          onChange={(v) => onChange({ transport_pass: v })}
        />
      </Section>

      {/* Other recurring */}
      <Section title="6) Other recurring">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone (£/mo)" name="phone" value={form.phone} onChange={(v) => onChange({ phone: v })} />
          <Field label="Health insurance (£/mo)" name="health_insurance" value={form.health_insurance} onChange={(v) => onChange({ health_insurance: v })} />
          <Field label="Gym (£/mo)" name="gym" value={form.gym} onChange={(v) => onChange({ gym: v })} />
          <Field label="Subscriptions (£/mo)" name="subscriptions" value={form.subscriptions} onChange={(v) => onChange({ subscriptions: v })} />
          <Field label="Clothing (£/mo)" name="clothing" value={form.clothing} onChange={(v) => onChange({ clothing: v })} />
          <Field label="Personal care (£/mo)" name="personal_care" value={form.personal_care} onChange={(v) => onChange({ personal_care: v })} />
          <Field label="Other (£/mo)" name="other_recurring" value={form.other_recurring} onChange={(v) => onChange({ other_recurring: v })} />
        </div>
      </Section>

      {/* Upfront and buffer */}
      <Section title="7) Upfront, amortized and buffer">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Upfront one-off (£)" name="upfront_one_off" value={form.upfront_one_off} onChange={(v) => onChange({ upfront_one_off: v })} />
          <Field label="Amortized one-off (£)" name="amortized_one_off" value={form.amortized_one_off} onChange={(v) => onChange({ amortized_one_off: v })} />
          <Field label="Amortize over (months)" name="amortize_over_months" value={form.amortize_over_months} onChange={(v) => onChange({ amortize_over_months: v })} min={1} />
          <Field label="Buffer (0-1)" name="buffer" value={form.buffer} onChange={(v) => onChange({ buffer: v })} step={0.01} min={0} max={1} />
        </div>
      </Section>

      {/* Action buttons */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onCalculate}
          disabled={loading}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg text-sm transition-colors disabled:opacity-60"
        >
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold py-3 rounded-lg text-sm transition-colors bg-white"
        >
          Reset to preset
        </button>
      </div>
    </div>
  )
}