'use client'

import { useState, useEffect, useCallback } from 'react'
import InputPanel from '@/components/InputPanel'
import type { City, CityPreset, Band, CalculateInput, CalculationResult } from '@/lib/types'
import { getCities, getCityPreset, calculate } from '@/lib/api'
import ResultsPanel from '@/components/ResultsPanel'
import EmptyStateSvg from '@/components/EmptyStateSvg'
import Link from 'next/link'

const DEFAULT_FORM: CalculateInput = {
  city_id: 0,
  housing_type: 'Shared room',
  band: 'typical',
  budget_lower: 600,
  budget_upper: 700,
  people_sharing: 2,
  rent_lower: 900,
  rent_upper: 1050,
  deposit: 975,
  bills_included: false,
  electricity: 48,
  gas: 36,
  water: 18,
  internet: 18,
  student_council_tax_exemption: true,
  groceries_weekly: 43.85,
  meals_out_per_week: 2,
  avg_meal_cost: 12,
  coffees_per_week: 5,
  avg_coffee_cost: 3,
  transport_pass: 172,
  phone: 20,
  health_insurance: 0,
  gym: 25,
  subscriptions: 15,
  clothing: 35,
  personal_care: 25,
  other_recurring: 0,
  upfront_one_off: 500,
  amortized_one_off: 0,
  amortize_over_months: 12,
  buffer: 0.1,
}

function presetToForm(preset: CityPreset, cityId: number, band: Band): CalculateInput {
  return {
    city_id: cityId,
    housing_type: 'Shared room',
    band,
    budget_lower: Number(preset.budget_lower),
    budget_upper: Number(preset.budget_upper),
    people_sharing: Number(preset.people_sharing),
    rent_lower: Number(preset.rent_lower),
    rent_upper: Number(preset.rent_upper),
    deposit: Number(preset.deposit),
    bills_included: preset.bills_included,
    electricity: Number(preset.electricity),
    gas: Number(preset.gas),
    water: Number(preset.water),
    internet: Number(preset.internet),
    student_council_tax_exemption: preset.student_council_tax_exemption,
    groceries_weekly: Number(preset.groceries_weekly),
    meals_out_per_week: Number(preset.meals_out_per_week),
    avg_meal_cost: Number(preset.avg_meal_cost),
    coffees_per_week: Number(preset.coffees_per_week),
    avg_coffee_cost: Number(preset.avg_coffee_cost),
    transport_pass: Number(preset.transport_pass),
    phone: Number(preset.phone),
    health_insurance: Number(preset.health_insurance),
    gym: Number(preset.gym),
    subscriptions: Number(preset.subscriptions),
    clothing: Number(preset.clothing),
    personal_care: Number(preset.personal_care),
    other_recurring: Number(preset.other_recurring),
    upfront_one_off: Number(preset.upfront_one_off),
    amortized_one_off: Number(preset.amortized_one_off),
    amortize_over_months: Number(preset.amortize_over_months),
    buffer: Number(preset.buffer),
  }
}

export default function HomePage() {
  const [cities, setCities] = useState<City[]>([])
  const [preset, setPreset] = useState<CityPreset | null>(null)
  const [form, setForm] = useState<CalculateInput>(DEFAULT_FORM)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [initializing, setInitializing] = useState(true)

  // load cities on mount, then load default preset for first city
  useEffect(() => {
    getCities()
      .then(async (data) => {
        if (data.length === 0) return
        setCities(data)
        const firstCity = data[0]
        const p = await getCityPreset(firstCity.id, 'typical')
        setPreset(p)
        setForm(presetToForm(p, firstCity.id, 'typical'))
      })
      .catch(() => setError('Could not load city data. Check that the server is running.'))
      .finally(() => setInitializing(false))
  }, [])

  const loadPreset = useCallback(async (cityId: number, band: Band) => {
    try {
      const p = await getCityPreset(cityId, band)
      setPreset(p)
      setForm(presetToForm(p, cityId, band))
    } catch {
      setError('Could not load preset for this city.')
    }
  }, [])

  const handleCityChange = (cityId: number) => {
    loadPreset(cityId, form.band)
  }

  const handleBandChange = (band: Band) => {
    loadPreset(form.city_id, band)
  }

  const handleChange = (updated: Partial<CalculateInput>) => {
    setForm((prev) => ({ ...prev, ...updated }))
  }

  const handleCalculate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await calculate(form)
      setResult(res)
      // scroll to results on mobile
      if (window.innerWidth < 1024) {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Calculation failed. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (preset) {
      setForm(presetToForm(preset, form.city_id, form.band))
    }
    setResult(null)
    setError('')
  }

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-16 py-8">
        <div className="mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">NeoNexor - Living Expense Calculator</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Estimate monthly living costs and check against UKVI maintenance requirements.
            </p>
          </div>
          <Link
            href="/history"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium border border-amber-200 hover:border-amber-400 rounded-lg px-3 py-2 transition-colors bg-amber-50"
          >
            ⟲ Calculation histories
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left: inputs */}
          <div className="w-full lg:w-5/12 xl:w-4/12">
            <div className="bg-slate-50 rounded-lg">
              <InputPanel
                cities={cities}
                form={form}
                onChange={handleChange}
                onCityChange={handleCityChange}
                onBandChange={handleBandChange}
                onCalculate={handleCalculate}
                onReset={handleReset}
                preset={preset}
                loading={loading}
              />
            </div>
          </div>

          {/* Right: results */}
          <div id="results" className="w-full lg:w-7/12 xl:w-8/12">
            {result ? (
              <ResultsPanel result={result} />
            ) : (
              <div className="h-full min-h-64 flex items-start py-16 justify-center bg-white border border-slate-200 rounded-lg">
                <div className="text-center px-6">
                  <EmptyStateSvg style={{ transform: 'scale(1.25)' }} />
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}