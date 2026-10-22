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
