export type AttendanceStatus = 'Present' | 'Absent' | 'Leave'
export type FeeStatus = 'Paid' | 'Pending' | 'Overdue'
export type Student = {
  id: string
  name: string
  admissionNo: string
  className: string
  section: string
  guardian: string
  phone: string
  status: 'Active' | 'Inactive'
  dateOfBirth?: string
  gender?: string
  bloodGroup?: string
  religion?: string
  casteCategory?: string
  address?: string
  parent2Name?: string
  parent2Phone?: string
  parentEmail?: string
  relationship?: string
  idProofType?: string
  idProofLast4?: string
  previousSchool?: string
  previousClass?: string
  previousBoard?: string
  previousResult?: string
  medicalNotes?: string
}
export type AttendanceRecord = {
  studentId: string
  date: string
  status: AttendanceStatus
}
export type FeeRecord = {
  id: string
  studentId: string
  studentName: string
  className: string
  amountDue: number
  amountPaid: number
  dueDate: string
  status: FeeStatus
}
export type Staff = {
  id: string
  name: string
  role: string
  department: string
  email: string
  active: boolean
}
