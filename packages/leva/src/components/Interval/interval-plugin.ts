import v8n from 'v8n'
import { IntervalInput } from '../../types'
import { clamp } from '../../utils'
import { InternalNumberSettings } from '../Number/number-plugin'
import { normalizeKeyedNumberSettings } from '../Vector/vector-utils'

export type Interval = IntervalInput['value']
export type InternalInterval = { min: number; max: number }

export type InternalIntervalSettings = {
  bounds: [number, number]
  min: InternalNumberSettings
  max: InternalNumberSettings
}

const number = v8n().number()

export const schema = (o: any, s: any) =>
  v8n().array().length(2).every.number().test(o) && v8n().schema({ min: number, max: number }).test(s)

export const format = (v: Interval) => ({ min: v[0], max: v[1] })

export const sanitize = (
  { min, max }: InternalInterval,
  { bounds: [MIN, MAX] }: InternalIntervalSettings
): Interval => [clamp(Number(min), MIN, Math.max(MIN, max)), clamp(Number(max), Math.min(MAX, min), MAX)]

export const normalize = ({ value, min, max }: IntervalInput) => {
  const boundsSettings = { min, max }
  const settings = normalizeKeyedNumberSettings(format(value), { min: boundsSettings, max: boundsSettings })
  const bounds: [number, number] = [min, max]
  return { value, settings: { ...settings, bounds } }
}
