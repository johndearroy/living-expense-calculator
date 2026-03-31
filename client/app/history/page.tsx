'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getHistory, getHistoryById, deleteHistoryById, deleteAllHistory } from '@/lib/api'

type HistoryItem = {
  id: number
  band: string
  typical_month_total: number
  first_month_total: number
  midpoint_budget: number
  below_ukvi: boolean
  created_at: string
  city?: { id: number; name: string }
}

type HistoryDetail = HistoryItem & {
  input_snapshot: any
  result_snapshot: any
}

const fmt = (n: number) => Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [details, setDetails] = useState<Record<number, HistoryDetail>>({})
  const [detailLoading, setDetailLoading] = useState(false)
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await getHistory()
      setItems(data)
    } catch {
      setError('Could not load history. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  async function handleExpand(id: number) {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    if (details[id]) return
    setDetailLoading(true)
    try {
      const data = await getHistoryById(id)
      setDetails((prev) => ({ ...prev, [id]: data }))
    } catch {
      setError('Could not load details for this record.')
    } finally {
      setDetailLoading(false)
    }
  }

  async function handleDeleteOne(id: number) {
    setDeleting(true)
    try {
      await deleteHistoryById(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
      if (expandedId === id) setExpandedId(null)
    } catch {
      setError('Could not delete this record.')
    } finally {
      setDeleting(false)
    }
  }

  async function handleDeleteAll() {
    setDeleting(true)
    try {
      await deleteAllHistory()
      setItems([])
      setDetails({})
      setExpandedId(null)
      setConfirmDeleteAll(false)
    } catch {
      setError('Could not delete all records.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="bg-white border-b border-slate-200 px-16 py-8">
        <div className="mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">NeoNexor - Calculation History</h1>
            <p className="text-sm text-slate-500 mt-0.5">All past calculations, latest first.</p>
          </div>
          <Link
            href="/"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium border border-amber-200 hover:border-amber-400 rounded-lg px-3 py-2 transition-colors bg-amber-50"
          >
            Back to calculator
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-slate-400 text-sm">Loading...</p>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-lg">
            <p className="text-slate-400 text-sm">No calculations yet.</p>
            <Link href="/" className="mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium">
              Go calculate now
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                {items.length} record{items.length !== 1 ? 's' : ''}
              </p>
              {!confirmDeleteAll ? (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteAll(true)}
                  className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg px-3 py-1.5 transition-colors bg-white"
                >
                  Delete all
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Are you sure?</span>
                  <button
                    type="button"
                    onClick={handleDeleteAll}
                    disabled={deleting}
                    className="text-xs text-white bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-60"
                  >
                    {deleting ? 'Deleting...' : 'Yes, delete all'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteAll(false)}
                    className="text-xs text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100 transition-colors bg-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {items.map((item) => {
                const isOpen = expandedId === item.id
                const detail = details[item.id]

                return (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">

                    {/* summary row */}
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${item.below_ukvi ? 'bg-red-400' : 'bg-green-400'}`}
                        title={item.below_ukvi ? 'Below UKVI baseline' : 'Meets UKVI baseline'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">
                          {item.city?.name || 'Unknown city'}
                          <span className="ml-2 text-xs font-normal text-slate-400 capitalize">
                            {item.band}
                          </span>
                        </p>
                        <p className="text-xs text-slate-400">{fmtDate(item.created_at)}</p>
                      </div>
                      <div className="hidden sm:flex flex-col items-end shrink-0">
                        <p className="text-sm font-semibold text-slate-800">
                          £{fmt(item.typical_month_total)}
                          <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
                        </p>
                        <p className="text-xs text-slate-400">
                          First month £{fmt(item.first_month_total)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleExpand(item.id)}
                        className="ml-2 shrink-0 text-xs border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-600 hover:border-amber-400 hover:text-amber-700 transition-colors bg-slate-50"
                      >
                        {isOpen ? 'Close' : 'Details'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOne(item.id)}
                        disabled={deleting}
                        className="shrink-0 text-xs border border-red-100 rounded-md px-2.5 py-1.5 text-red-400 hover:border-red-400 hover:text-red-600 transition-colors bg-white disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>

                    {/* mobile totals */}
                    <div className="sm:hidden px-4 pb-2 flex gap-4">
                      <p className="text-xs text-slate-500">
                        Typical: <span className="font-semibold text-slate-700">£{fmt(item.typical_month_total)}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        First month: <span className="font-semibold text-slate-700">£{fmt(item.first_month_total)}</span>
                      </p>
                    </div>

                    {/* expanded detail */}
                    {isOpen && (
                      <div className="border-t border-slate-100 px-4 py-4 bg-slate-50">

                        {detailLoading && !detail && (
                          <p className="text-xs text-slate-400">Loading details...</p>
                        )}

                        {detail && (
                          <div className="flex flex-col gap-4">

                            {/* key numbers */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="bg-white border border-slate-200 rounded-lg p-3">
                                <p className="text-xs text-slate-400 mb-0.5">Midpoint budget</p>
                                <p className="text-sm font-semibold text-slate-800">£{fmt(detail.midpoint_budget)}</p>
                              </div>
                              <div className="bg-white border border-slate-200 rounded-lg p-3">
                                <p className="text-xs text-slate-400 mb-0.5">Typical month</p>
                                <p className="text-sm font-semibold text-slate-800">£{fmt(detail.typical_month_total)}</p>
                              </div>
                              <div className="bg-white border border-slate-200 rounded-lg p-3">
                                <p className="text-xs text-slate-400 mb-0.5">First month</p>
                                <p className="text-sm font-semibold text-slate-800">£{fmt(detail.first_month_total)}</p>
                              </div>
                              <div className={`border rounded-lg p-3 ${detail.result_snapshot.below_ukvi ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                                <p className="text-xs text-slate-400 mb-0.5">UKVI baseline</p>
                                <p className={`text-sm font-semibold ${detail.result_snapshot.below_ukvi ? 'text-red-600' : 'text-green-700'}`}>
                                  {detail.result_snapshot.below_ukvi ? 'Below' : 'Meets'} £{fmt(detail.result_snapshot.ukvi_baseline)}
                                </p>
                              </div>
                            </div>

                            {/* breakdown table */}
                            <div>
                              <p className="text-xs font-semibold text-slate-500 mb-2">Expense breakdown</p>
                              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                <table className="w-full text-xs">
                                  <tbody>
                                    {Object.entries(detail.result_snapshot.breakdown as Record<string, number>).map(([key, val]) => (
                                      <tr key={key} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                        <td className="px-3 py-2 text-slate-500 capitalize">
                                          {key.replace(/_/g, ' ')}
                                        </td>
                                        <td className="px-3 py-2 text-right text-slate-700 font-medium">
                                          £{fmt(val)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* tips */}
                            {detail.result_snapshot.tips?.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-slate-500 mb-2">Tips from this calculation</p>
                                <ul className="flex flex-col gap-1.5">
                                  {detail.result_snapshot.tips.map((tip: string, i: number) => (
                                    <li key={i} className="flex gap-2 text-xs text-slate-600">
                                      <span className="text-amber-500 shrink-0">&#8226;</span>
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}