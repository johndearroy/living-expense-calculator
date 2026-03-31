'use client'

import DonutChart from './DonutChart'
import type { CalculationResult } from '@/lib/types'

type Props = {
  result: CalculationResult
}

const fmt = (n: number) =>
  n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtInt = (n: number) =>
  Math.round(n).toLocaleString('en-GB')

type BreakdownRow = {
  label: string
  amount: number
  badge?: string
  bold?: boolean
}

export default function ResultsPanel({ result }: Props) {
  const rows: BreakdownRow[] = [
    { label: 'Housing (incl. bills & council)', amount: result.breakdown.housing },
    { label: 'Food & drink', amount: result.breakdown.food_and_drink, badge: result.food_is_high ? 'review' : undefined },
    { label: 'Transport', amount: result.breakdown.transport },
    { label: 'Clothing', amount: result.breakdown.clothing },
    { label: 'Gym', amount: result.breakdown.gym },
    { label: 'Personal care', amount: result.breakdown.personal_care },
    { label: 'Phone', amount: result.breakdown.phone },
    { label: 'Subscriptions', amount: result.breakdown.subscriptions },
    { label: 'Health', amount: result.breakdown.health },
    { label: 'Other', amount: result.breakdown.other },
    { label: 'Amortized one-off', amount: result.breakdown.amortized_one_off },
    { label: 'Typical month total (before income)', amount: result.typical_month_total, bold: true },
    { label: 'First-month grand total (before income)', amount: result.first_month_total },
  ]

  const maxSaving = result.savings_suggestions.length > 0 ? result.savings_suggestions[0].monthly_saving : 1

  const showDeveloperSanityChecks: boolean = false;

  return (
    <div className="flex flex-col gap-4">

      {/* Budget baseline comparison */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        {(result.below_ukvi || result.below_city_minimum) && (
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm font-semibold text-red-600">
              Below UKVI and/or city minimum
            </span>
            <span className="text-xs text-slate-500 text-right max-w-48">
              Increase midpoint by about £{fmtInt(result.budget_gap_from_ukvi)} to meet the stricter baseline.
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-3">
          {/* UKVI */}
          <div className="border border-slate-200 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">UKVI baseline</p>
            <p className="text-xl font-bold text-slate-800">£{fmtInt(result.ukvi_baseline)}</p>
            <p className="text-xs text-slate-400">Stricter baseline</p>
          </div>
          {/* City minimum */}
          <div className="border border-slate-200 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">City starter minimum</p>
            <p className="text-xl font-bold text-slate-800">£{fmtInt(result.city_minimum)}</p>
          </div>
          {/* Midpoint budget */}
          <div className={`border rounded-lg p-3 ${result.below_ukvi ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <p className="text-xs text-slate-500 mb-1">Your midpoint budget</p>
            <p className={`text-xl font-bold ${result.below_ukvi ? 'text-red-600' : 'text-green-700'}`}>
              £{fmtInt(result.midpoint_budget)}
            </p>
            <p className="text-xs text-slate-500">{result.midpoint_pct_of_ukvi}% of stricter baseline</p>
          </div>
        </div>

        <p className="text-xs text-slate-500">{result.budget_range_label}</p>
      </div>

      {/* Monthly totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-1">First month (before income)</p>
          <p className="text-2xl font-bold text-slate-800">£{fmt(result.first_month_total)}</p>
          <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>First-month rent (your share)</span>
              <span>£{fmt(result.first_month_rent_share)}</span>
            </div>
            <div className="flex justify-between">
              <span>Deposit (your share)</span>
              <span>£{fmt(result.deposit)}</span>
            </div>
            <div className="flex justify-between">
              <span>Upfront one-off</span>
              <span>£{fmt(result.upfront_one_off)}</span>
            </div>
            <div className="flex justify-between">
              <span>Other recurring (excl. rent)</span>
              <span>£{fmt(result.typical_month_total - result.typical_rent_share)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-between gap-3">
          <div className="w-full">
            <p className="text-xs text-slate-500 mb-1">Typical month (before income)</p>
            <p className="text-2xl font-bold text-slate-800">£{fmt(result.typical_month_total)}</p>
          </div>
          <DonutChart percentage={result.midpoint_covers_pct_of_typical} />
        </div>
      </div>

      {/* Expense breakdown table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Category</th>
              <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500">Amount / mo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-slate-100 last:border-0 ${row.bold ? 'bg-amber-50' : 'hover:bg-slate-50'}`}
              >
                <td className={`px-4 py-2.5 text-slate-700 ${row.bold ? 'font-semibold' : ''}`}>
                  <span>{row.label}</span>
                  {row.badge && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 rounded px-1.5 py-0.5">
                      {row.badge}
                    </span>
                  )}
                </td>
                <td className={`px-4 py-2.5 text-right ${row.bold ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                  £{fmt(row.amount)} {row?.badge === 'review' && <span>⚠️</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Savings suggestions */}
      {result.savings_suggestions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">How to reach the baseline</h3>
            {result.below_ukvi && (
              <span className="text-xs text-slate-500">
                You are short by £{fmtInt(result.budget_gap_from_ukvi)}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {result.savings_suggestions.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-medium text-slate-700">{s.label}</span>
                  <span className="text-sm font-semibold text-slate-800">£{fmtInt(s.monthly_saving)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min((s.monthly_saving / maxSaving) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-sm text-slate-700">
              Total potential monthly savings:{' '}
              <span className="font-semibold">£{fmtInt(result.total_potential_savings)}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Combine 2-3 of the biggest items to reach the UKVI/city baseline faster.
            </p>
          </div>
        </div>
      )}

      {/* Guidance and tips */}
      {result.tips.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Guidance and tips</h3>
          <ul className="flex flex-col gap-2">
            {result.tips.map((tip, i) => (
              <li key={i} className="text-xs text-slate-600 flex gap-2">
                <span className="text-amber-500 mt-0.5 shrink-0">&#8226;</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Developer sanity checks */}
      {showDeveloperSanityChecks && (
        <details className="bg-white border border-slate-200 rounded-lg">
          <summary className="px-4 py-3 text-xs text-slate-500 cursor-pointer select-none hover:text-slate-700">
            Developer sanity tests
          </summary>
          <div className="px-4 pb-4 border-t border-slate-100">
            <table className="w-full text-xs mt-2">
              <tbody>
                {Object.entries(result.sanity).map(([key, val]) => (
                  <tr key={key} className="border-b border-slate-50">
                    <td className="py-1 text-slate-500">{key.replace(/_/g, ' ')}</td>
                    <td className="py-1 text-right text-slate-700 font-mono">£{fmt(val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

    </div>
  )
}