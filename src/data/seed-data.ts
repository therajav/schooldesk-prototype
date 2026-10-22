import type { AttendanceRecord, FeeRecord, Staff, Student } from '../types'

const firstNames = ['Aarav','Ananya','Diya','Ishaan','Meera','Arjun','Aadhya','Vihaan','Nila','Dev','Kavya','Rohan','Maya','Advaith','Sara','Nikhil','Anika','Joel','Tara','Rahul']
const lastNames = ['Thomas','Nair','Menon','Joseph','Mathew','Pillai','Varghese','Kumar','Das','George','Kurian','Rajan']
const guardians = ['Anil Thomas','Deepa Nair','Suresh Menon','Mary Joseph','Biju Mathew','Lakshmi Pillai','Reena Varghese','Rajesh Kumar']
const classes = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12']

export const seedStudents: Student[] = Array.from({ length: 60 }, (_, i) => ({
  id: `STU-${String(i + 1).padStart(4, '0')}`,
  name: `${firstNames[i % firstNames.length]} ${lastNames[(i * 3 + 2) % lastNames.length]}`,
  admissionNo: `ADM${String(2020 + (i % 6))}${String(i + 1).padStart(3, '0')}`,
  className: classes[i % classes.length],
  section: ['A','B','C'][i % 3],
  guardian: guardians[i % guardians.length],
  phone: `98${String(10000000 + i * 137).slice(0, 8)}`,
  status: i === 17 ? 'Inactive' : 'Active',
}))

export const seedAttendance: AttendanceRecord[] = seedStudents.map((student, i) => ({
  studentId: student.id,
  date: new Date().toISOString().slice(0, 10),
  status: i % 17 === 0 ? 'Absent' : i % 29 === 0 ? 'Leave' : 'Present',
}))

export const seedFees: FeeRecord[] = seedStudents.slice(0, 32).map((student, i) => {
  const amountDue = [18000, 24000, 32000, 28000][i % 4]
  const amountPaid = i % 5 === 0 ? amountDue : i % 3 === 0 ? amountDue / 2 : i % 4 === 0 ? 0 : amountDue
  return {
    id: `FEE-${String(i + 1).padStart(4, '0')}`,
    studentId: student.id,
    studentName: student.name,
    className: `${student.className} - ${student.section}`,
    amountDue,
    amountPaid,
    dueDate: `2026-${String((i % 9) + 1).padStart(2, '0')}-15`,
    status: amountPaid >= amountDue ? 'Paid' : i % 2 === 0 ? 'Overdue' : 'Pending',
  }
})

export const seedStaff: Staff[] = [
  { id: 'STF-001', name: 'Anita Thomas', role: 'Principal', department: 'Administration', email: 'anita.thomas@example.test', active: true },
  { id: 'STF-002', name: 'Sanjay Nair', role: 'Office Administrator', department: 'Office', email: 'sanjay.nair@example.test', active: true },
  { id: 'STF-003', name: 'Mary Joseph', role: 'Teacher', department: 'Primary', email: 'mary.joseph@example.test', active: true },
  { id: 'STF-004', name: 'Rahul Menon', role: 'Teacher', department: 'Secondary', email: 'rahul.menon@example.test', active: true },
  { id: 'STF-005', name: 'Latha Pillai', role: 'Accountant', department: 'Accounts', email: 'latha.pillai@example.test', active: true },
  { id: 'STF-006', name: 'George Mathew', role: 'Teacher', department: 'Science', email: 'george.mathew@example.test', active: false },
]

export const classRows = classes.map((name, i) => ({
  name,
  sections: ['A', 'B', ...(i < 6 ? ['C'] : [])],
  students: 82 + (i * 7 % 39),
  classTeacher: ['Anita Thomas','Mary Joseph','Rahul Menon','Sanjay Nair'][i % 4],
}))
