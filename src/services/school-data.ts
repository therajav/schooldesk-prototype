import { seedAttendance, seedFees, seedStaff, seedStudents } from '../data/seed-data'
import type { AttendanceRecord, FeeRecord, Staff, Student } from '../types'

const KEY = 'schooldesk-demo-v1'
export type DemoState = {
  students: Student[]
  attendance: AttendanceRecord[]
  fees: FeeRecord[]
  staff: Staff[]
  schoolName: string
  academicYear: string
}

export const initialState = (): DemoState => ({
  students: structuredClone(seedStudents),
  attendance: structuredClone(seedAttendance),
  fees: structuredClone(seedFees),
  staff: structuredClone(seedStaff),
  schoolName: 'Munnar Valley Public School',
  academicYear: '2026–27',
})

export function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initialState(), ...JSON.parse(raw) }
  } catch { /* use sample state if browser storage is unavailable */ }
  return initialState()
}

export function saveState(state: DemoState) {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* demo remains usable in memory */ }
}

export function resetState() {
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
  return initialState()
}

export function updateFeePayment(fee: FeeRecord, payment: number): FeeRecord {
  const amountPaid = Math.min(fee.amountDue, fee.amountPaid + payment)
  return { ...fee, amountPaid, status: amountPaid >= fee.amountDue ? 'Paid' : 'Pending' }
}
