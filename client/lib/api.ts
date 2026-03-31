import axios from 'axios'
import type { City, CityPreset, Band, CalculateInput, CalculationResult } from './types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
})

export async function getCities(): Promise<City[]> {
  const res = await api.get('/cities')
  return res.data.data
}

export async function getCityPreset(cityId: number, band: Band): Promise<CityPreset> {
  const res = await api.get(`/cities/${cityId}/preset`, { params: { band } })
  return res.data.data
}

export async function calculate(input: CalculateInput): Promise<CalculationResult> {
  const res = await api.post('/calculate', input)
  return res.data.data
}

export async function getHistory(): Promise<any[]> {
  const res = await api.get('/history')
  return res.data.data
}

export async function getHistoryById(id: number): Promise<any> {
  const res = await api.get(`/history/${id}`)
  return res.data.data
}

export async function deleteHistoryById(id: number): Promise<void> {
  await api.delete(`/history/${id}`)
}

export async function deleteAllHistory(): Promise<void> {
  await api.delete('/history')
}