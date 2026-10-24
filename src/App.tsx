import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, CalendarCheck, Wallet, ChartNoAxesCombined, ContactRound,
  School, Settings as SettingsIcon, Menu, Search, Bell, ChevronDown, Plus, Download,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, X, Check, Clock3, AlertCircle,
  CircleDollarSign, UserRound, FileText, RotateCcw, Printer, SlidersHorizontal,
  BookOpenCheck, ShieldCheck, CalendarDays, TrendingUp, Sparkles, LogOut, PanelLeftClose,
} from 'lucide-react'
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts'
import { classRows, seedStudents } from './data/seed-data'
import { initialState, loadState, resetState, saveState, updateFeePayment, type DemoState } from './services/school-data'
import type { AttendanceStatus, FeeStatus, Student } from './types'
import TeacherWorkspace from './TeacherWorkspace'

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/teacher', label: 'Teacher workspace', icon: BookOpenCheck },
  { to: '/fees', label: 'Fees', icon: Wallet },
  { to: '/reports', label: 'Reports', icon: ChartNoAxesCombined },
  { to: '/staff', label: 'Staff', icon: ContactRound },
  { to: '/classes', label: 'Classes', icon: School },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
const shortMoney = (value: number) => value >= 100000 ? `₹${(value / 100000).toFixed(1)}L` : money(value)
const today = () => new Date().toISOString().slice(0, 10)

function App() {
  const [data, setData] = useState<DemoState>(() => loadState())
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState('')
  const [year, setYear] = useState(data.academicYear)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => { saveState(data) }, [data])
  useEffect(() => { setMobileNav(false) }, [location.pathname])
  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(id)
  }, [toast])

  const notify = (message: string) => setToast(message)
  const update = (patch: Partial<DemoState>) => setData(current => ({ ...current, ...patch }))
  const reset = () => {
    const fresh = resetState()
    setData(fresh)
    setYear(fresh.academicYear)
    notify('Demo data has been reset.')
  }

  const title = navItems.find(item => item.to === location.pathname)?.label ?? 'SchoolDesk'
  const activeStudents = data.students.filter(s => s.status === 'Active').length
  const paidTotal = data.fees.reduce((sum, fee) => sum + fee.amountPaid, 0)
  const dueTotal = data.fees.reduce((sum, fee) => sum + Math.max(0, fee.amountDue - fee.amountPaid), 0)

  return (
    <div className="app-shell">
      {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><School size={21} strokeWidth={2.4} /></div>
          <div><div className="brand-name">SchoolDesk</div><div className="brand-subtitle">School administration</div></div>
          <button className="icon-button sidebar-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="school-switcher">
          <div className="school-avatar">MV</div>
          <div className="school-switcher-copy"><strong>{data.schoolName}</strong><span>Academic year {year}</span></div>
          <ChevronDown size={15} className="muted-icon"/>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(item => {
            const Icon = item.icon
            return <NavLink key={item.to} to={item.to} end={'end' in item ? item.end : false} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={1.9}/><span>{item.label}</span>
              {item.label === 'Fees' && dueTotal > 0 && <span className="nav-dot"/>}
            </NavLink>
          })}
        </nav>
        <div className="sidebar-spacer"/>
        <div className="help-card">
          <div className="help-icon"><Sparkles size={17}/></div>
          <strong>Getting started</strong>
          <p>Explore the demo to see how school tasks can fit together.</p>
          <button onClick={() => notify('This is a prototype. Ask us about the workflows you would like to test.')}>Explore tips <ArrowUpRight size={14}/></button>
        </div>
        <div className="sidebar-footer"><div className="avatar avatar-blue">AT</div><div className="user-meta"><strong>Anita Thomas</strong><span>Demo principal</span></div><MoreHorizontal size={18} className="muted-icon"/></div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20}/></button>
            <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{title}</strong></div>
          </div>
          <div className="topbar-actions">
            <span className="demo-pill"><span/> Demo mode</span>
            <label className="year-select"><CalendarDays size={15}/><select aria-label="Academic year" value={year} onChange={e => { setYear(e.target.value); update({ academicYear: e.target.value }); notify(`Academic year changed to ${e.target.value}.`) }}><option>2026–27</option><option>2025–26</option><option>2027–28</option></select><ChevronDown size={13}/></label>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify('You are all caught up in this demo.')}><Bell size={18}/><i/></button>
          </div>
        </header>
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard data={data} activeStudents={activeStudents} paidTotal={paidTotal} dueTotal={dueTotal} onNavigate={navigate} notify={notify}/>} />
            <Route path="/students" element={<Students data={data} update={update} notify={notify}/>} />
            <Route path="/attendance" element={<Attendance data={data} update={update} notify={notify}/>} />
            <Route path="/teacher" element={<TeacherWorkspace data={data} onNavigate={navigate} notify={notify}/>} />
            <Route path="/fees" element={<Fees data={data} update={update} notify={notify}/>} />
            <Route path="/reports" element={<Reports data={data} notify={notify}/>} />
            <Route path="/staff" element={<StaffPage data={data} update={update} notify={notify}/>} />
            <Route path="/classes" element={<ClassesPage data={data}/>} />
            <Route path="/settings" element={<Settings data={data} update={update} reset={reset} notify={notify}/>} />
            <Route path="*" element={<Dashboard data={data} activeStudents={activeStudents} paidTotal={paidTotal} dueTotal={dueTotal} onNavigate={() => {}} notify={notify}/>} />
          </Routes>
        </main>
      </div>
      {toast && <div className="toast" role="status"><Check size={17}/>{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X size={15}/></button></div>}
    </div>
  )
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1><p>{description}</p></div>{action && <div className="heading-action">{action}</div>}</div>
}
function Button({ children, variant = 'primary', onClick, type = 'button', disabled = false }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean }) {
  return <button type={type} disabled={disabled} className={`button button-${variant}`} onClick={onClick}>{children}</button>
}
function MetricCard({ label, value, trend, trendLabel, icon: Icon, tone = 'blue', note }: { label: string; value: string; trend?: string; trendLabel?: string; icon: any; tone?: string; note?: string }) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className={`metric-icon tone-${tone}`}><Icon size={18}/></span></div><div className="metric-value">{value}</div><div className="metric-foot">{trend && <span className={`trend ${trend.startsWith('-') ? 'trend-down' : ''}`}><ArrowUpRight size={13}/>{trend}</span>}<span>{trendLabel ?? note}</span></div></div>
}
function SectionCard({ title, subtitle, action, children, className = '' }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`section-card ${className}`}><div className="section-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>{children}</section>
}
function StatusBadge({ value }: { value: string }) {
  const cls = ['Paid','Present','Active'].includes(value) ? 'status-green' : ['Overdue','Absent','Inactive'].includes(value) ? 'status-red' : ['Pending','Leave'].includes(value) ? 'status-amber' : 'status-blue'
  return <span className={`status-badge ${cls}`}><span/>{value}</span>
}
function Avatar({ name, color = 'blue' }: { name: string; color?: string }) {
  const initials = name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()
  return <span className={`avatar avatar-${color}`}>{initials}</span>
}
function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty-state"><div className="empty-icon"><Search size={21}/></div><strong>{title}</strong><p>{text}</p></div>
}

function Dashboard({ data, activeStudents, paidTotal, dueTotal, onNavigate, notify }: { data: DemoState; activeStudents: number; paidTotal: number; dueTotal: number; onNavigate: (path: string) => void; notify: (s: string) => void }) {
  const todayAttendance = data.attendance.filter(a => a.date === today())
  const present = todayAttendance.filter(a => a.status === 'Present').length
  const attendancePct = todayAttendance.length ? Math.round(present / todayAttendance.length * 1000) / 10 : 0
  const collection = [
    { month: 'Apr', amount: 3.4 }, { month: 'May', amount: 4.2 }, { month: 'Jun', amount: 3.8 },
    { month: 'Jul', amount: 5.1 }, { month: 'Aug', amount: 4.7 }, { month: 'Sep', amount: 6.2 },
  ]
  const pie = [{ name: 'Paid', value: data.fees.filter(f => f.status === 'Paid').length, color: '#0f9f78' }, { name: 'Pending', value: data.fees.filter(f => f.status === 'Pending').length, color: '#f5a524' }, { name: 'Overdue', value: data.fees.filter(f => f.status === 'Overdue').length, color: '#e56b6f' }]
  return <div className="page-stack">
    <PageHeading eyebrow="TUESDAY, OCTOBER 22" title="Good morning, Anita 👋" description="Here's what's happening at your school today." action={<Button variant="secondary" onClick={() => notify('Demo summary prepared. Use Reports to download sample data.')}><Download size={16}/> Export summary</Button>}/>
    <div className="notice-banner"><div className="notice-icon"><Sparkles size={17}/></div><div><strong>Welcome to your school overview</strong><p>Explore the sample figures and try a few workflows. All records in this demo are fictional.</p></div><button aria-label="Dismiss notice" onClick={e => e.currentTarget.parentElement?.remove()}><X size={17}/></button></div>
    <div className="metric-grid">
      <MetricCard label="Active students" value={activeStudents.toLocaleString('en-IN')} trend="+4.8%" trendLabel="vs last term" icon={Users} tone="blue"/>
      <MetricCard label="Today's attendance" value={`${attendancePct}%`} trend="+1.6%" trendLabel="vs last week" icon={CalendarCheck} tone="teal"/>
      <MetricCard label="Fees collected" value={shortMoney(paidTotal)} trend="+8.2%" trendLabel="this academic year" icon={CircleDollarSign} tone="purple"/>
      <MetricCard label="Outstanding fees" value={shortMoney(dueTotal)} trend="-3.1%" trendLabel="vs last month" icon={Wallet} tone="orange"/>
    </div>
    <div className="dashboard-grid">
      <SectionCard title="Fee collection" subtitle="Monthly collection · illustrative values" action={<button className="text-action" onClick={() => onNavigate('/reports')}>View report <ArrowUpRight size={14}/></button>}>
        <div className="chart-legend"><span><i className="legend-dot blue-dot"/>Collected (₹ lakh)</span><span className="chart-note">Apr – Sep 2026</span></div>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={collection} margin={{ top: 10, right: 8, left: -15, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f5"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8b95a5', fontSize: 12 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b95a5', fontSize: 11 }} tickFormatter={v => `₹${v}L`}/><Tooltip formatter={(v) => [`₹${v} lakh`, 'Collected']} contentStyle={{ border: '1px solid #e7ebf0', borderRadius: 12, boxShadow: '0 8px 24px #172b4d12' }}/><Bar dataKey="amount" fill="#4f7df3" radius={[5,5,0,0]} barSize={26}/></BarChart></ResponsiveContainer></div>
      </SectionCard>
      <SectionCard title="Fee status" subtitle="Across sample fee records">
        <div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pie} innerRadius={64} outerRadius={86} paddingAngle={4} dataKey="value" stroke="none"><Cell fill="#0f9f78"/><Cell fill="#f5a524"/><Cell fill="#e56b6f"/></Pie><Tooltip/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{data.fees.length}</strong><span>fee records</span></div></div>
        <div className="status-legend">{pie.map(p => <div key={p.name}><span><i style={{ background: p.color }}/>{p.name}</span><strong>{p.value}</strong></div>)}</div>
      </SectionCard>
    </div>
    <div className="dashboard-grid lower-grid">
      <SectionCard title="Recent student records" subtitle="Latest sample profiles" action={<button className="text-action" onClick={() => onNavigate('/students')}>All students <ArrowUpRight size={14}/></button>}>
        <div className="mini-list">{data.students.slice(0,5).map((student, i) => <div className="mini-row" key={student.id}><Avatar name={student.name} color={['blue','purple','teal','orange','pink'][i]}/><div className="mini-person"><strong>{student.name}</strong><span>{student.admissionNo} · {student.className} {student.section}</span></div><StatusBadge value={student.status}/></div>)}</div>
      </SectionCard>
      <SectionCard title="Quick actions" subtitle="Common school office tasks">
        <div className="quick-actions">
          <button onClick={() => onNavigate('/students')}><span className="quick-icon quick-blue"><Plus size={17}/></span><span><strong>Add a student</strong><small>Create a sample student record</small></span><ArrowUpRight size={15}/></button>
          <button onClick={() => onNavigate('/attendance')}><span className="quick-icon quick-teal"><CalendarCheck size={17}/></span><span><strong>Take attendance</strong><small>Update today's class register</small></span><ArrowUpRight size={15}/></button>
          <button onClick={() => onNavigate('/fees')}><span className="quick-icon quick-orange"><Wallet size={17}/></span><span><strong>Record a fee payment</strong><small>Try the simulated payment flow</small></span><ArrowUpRight size={15}/></button>
          <button onClick={() => onNavigate('/reports')}><span className="quick-icon quick-purple"><FileText size={17}/></span><span><strong>Generate a report</strong><small>Explore downloadable summaries</small></span><ArrowUpRight size={15}/></button>
        </div>
      </SectionCard>
    </div>
    <div className="footer-note"><ShieldCheck size={14}/> Demo workspace · sample figures are illustrative and do not represent a real school.</div>
  </div>
}

function Students({ data, update, notify }: { data: DemoState; update: (p: Partial<DemoState>) => void; notify: (s: string) => void }) {
  const [query, setQuery] = useState('')
  const [classFilter, setClassFilter] = useState('All classes')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<Student | null>(null)
  const emptyStudentForm = () => ({ name: '', className: 'Grade 1', section: 'A', guardian: '', phone: '', dateOfBirth: '', gender: '', bloodGroup: '', religion: '', casteCategory: '', address: '', parent2Name: '', parent2Phone: '', parentEmail: '', relationship: 'Parent', idProofType: '', idProofLast4: '', previousSchool: '', previousClass: '', previousBoard: '', previousResult: '', medicalNotes: '' })
  const [form, setForm] = useState(emptyStudentForm)
  const filtered = useMemo(() => data.students.filter(s => `${s.name} ${s.admissionNo} ${s.guardian}`.toLowerCase().includes(query.toLowerCase()) && (classFilter === 'All classes' || s.className === classFilter) && (statusFilter === 'All statuses' || s.status === statusFilter)), [data.students, query, classFilter, statusFilter])
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.guardian.trim() || !/^\d{10}$/.test(form.phone)) { notify('Enter a student name, guardian, and 10-digit phone number.'); return }
    const student: Student = { id: `STU-${Date.now().toString().slice(-6)}`, admissionNo: `ADM${new Date().getFullYear()}${String(data.students.length + 1).padStart(3,'0')}`, ...form, status: 'Active' }
    update({ students: [student, ...data.students], attendance: [...data.attendance, { studentId: student.id, date: today(), status: 'Present' }] })
    setShowForm(false); setForm(emptyStudentForm()); notify('Sample student added.')
  }
  return <div className="page-stack">
    <PageHeading eyebrow="STUDENT DIRECTORY" title="Students" description="Keep student profiles and guardian details organised." action={<Button onClick={() => setShowForm(true)}><Plus size={16}/> Add student</Button>}/>
    <div className="metric-grid three-metrics"><MetricCard label="Total students" value={data.students.length.toLocaleString('en-IN')} icon={Users} tone="blue" note="All sample records"/><MetricCard label="Active students" value={data.students.filter(s=>s.status==='Active').length.toString()} icon={UserRound} tone="teal" note="Currently enrolled"/><MetricCard label="Classes represented" value={new Set(data.students.map(s=>s.className)).size.toString()} icon={School} tone="purple" note="Across grades 1–12"/></div>
    <SectionCard title="All students" subtitle={`${filtered.length} records found`} action={<Button variant="secondary" onClick={() => { const rows = [['Name','Admission No','Class','Section','Guardian','Phone','Status'], ...filtered.map(s=>[s.name,s.admissionNo,s.className,s.section,s.guardian,s.phone,s.status])]; downloadCsv('schooldesk-students.csv', rows); notify('Student list downloaded.') }}><Download size={15}/> Export CSV</Button>}>
      <div className="filter-row"><label className="search-box"><Search size={16}/><input placeholder="Search name, admission no. or guardian..." value={query} onChange={e=>setQuery(e.target.value)}/>{query && <button onClick={()=>setQuery('')} aria-label="Clear search"><X size={14}/></button>}</label><label className="select-box"><SlidersHorizontal size={15}/><select value={classFilter} onChange={e=>setClassFilter(e.target.value)}><option>All classes</option>{classRows.map(c=><option key={c.name}>{c.name}</option>)}</select></label><select className="plain-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All statuses</option><option>Active</option><option>Inactive</option></select></div>
      {filtered.length ? <div className="table-scroll"><table><thead><tr><th>Student</th><th>Admission no.</th><th>Class</th><th>Guardian</th><th>Phone</th><th>Status</th><th/></tr></thead><tbody>{filtered.map((s,i)=><tr key={s.id}><td><div className="table-person"><Avatar name={s.name} color={['blue','purple','teal','orange','pink'][i%5]}/><strong>{s.name}</strong></div></td><td className="muted-cell">{s.admissionNo}</td><td>{s.className} · {s.section}</td><td>{s.guardian}</td><td>{s.phone}</td><td><StatusBadge value={s.status}/></td><td><button className="icon-button tiny" aria-label={`View ${s.name}`} onClick={()=>setSelected(s)}><MoreHorizontal size={17}/></button></td></tr>)}</tbody></table></div> : <EmptyState title="No students found" text="Try another search term or change the filters."/>}
    </SectionCard>
    {showForm && <Modal title="Add student" subtitle="Student admission details · demo only" onClose={()=>setShowForm(false)}><form className="form-grid student-admission-form" onSubmit={submit}>
      <div className="form-section-title"><strong>Student details</strong><span>Basic identity and class placement</span></div>
      <Field label="Student full name" required><input autoFocus value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Student's full name"/></Field>
      <div className="form-grid two-col"><Field label="Date of birth"><input type="date" value={form.dateOfBirth} onChange={e=>setForm({...form,dateOfBirth:e.target.value})}/></Field><Field label="Gender (optional)"><select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option value="">Not provided</option><option>Female</option><option>Male</option><option>Other</option></select></Field></div>
      <div className="form-grid two-col"><Field label="Class"><select value={form.className} onChange={e=>setForm({...form,className:e.target.value})}>{classRows.map(c=><option key={c.name}>{c.name}</option>)}</select></Field><Field label="Division"><select value={form.section} onChange={e=>setForm({...form,section:e.target.value})}><option>A</option><option>B</option><option>C</option></select></Field></div>
      <Field label="Residential address"><textarea rows={2} value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="House, locality, town, PIN code"/></Field>
      <div className="form-section-title"><strong>Parent / guardian details</strong><span>Primary contact is required</span></div>
      <div className="form-grid two-col"><Field label="Parent / guardian name" required><input value={form.guardian} onChange={e=>setForm({...form,guardian:e.target.value})} placeholder="Primary guardian"/></Field><Field label="Relationship"><select value={form.relationship} onChange={e=>setForm({...form,relationship:e.target.value})}><option>Parent</option><option>Mother</option><option>Father</option><option>Guardian</option><option>Other</option></select></Field></div>
      <div className="form-grid two-col"><Field label="Primary phone (10 digits)" required><input inputMode="numeric" maxLength={10} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value.replace(/\D/g,'')})} placeholder="9876543210"/></Field><Field label="Parent email"><input type="email" value={form.parentEmail} onChange={e=>setForm({...form,parentEmail:e.target.value})} placeholder="name@example.com"/></Field></div>
      <div className="form-grid two-col"><Field label="Second parent / guardian"><input value={form.parent2Name} onChange={e=>setForm({...form,parent2Name:e.target.value})}/></Field><Field label="Second contact number"><input inputMode="numeric" maxLength={10} value={form.parent2Phone} onChange={e=>setForm({...form,parent2Phone:e.target.value.replace(/\D/g,'')})}/></Field></div>
      <div className="form-section-title"><strong>Identity proof</strong><span>Demo only: do not enter a full identity number</span></div>
      <div className="form-grid two-col"><Field label="ID proof type"><select value={form.idProofType} onChange={e=>setForm({...form,idProofType:e.target.value})}><option value="">Not provided</option><option>Aadhaar</option><option>Birth certificate</option><option>Passport</option><option>Ration card</option><option>Other</option></select></Field><Field label="Last 4 characters only"><input maxLength={4} value={form.idProofLast4} onChange={e=>setForm({...form,idProofLast4:e.target.value.replace(/[^a-zA-Z0-9]/g,'').slice(0,4)})}/></Field></div>
      <div className="form-section-title"><strong>Previous academic details</strong><span>For transfer or new admission</span></div>
      <Field label="Previous school name"><input value={form.previousSchool} onChange={e=>setForm({...form,previousSchool:e.target.value})}/></Field>
      <div className="form-grid two-col"><Field label="Previous class / grade"><input value={form.previousClass} onChange={e=>setForm({...form,previousClass:e.target.value})}/></Field><Field label="Board / syllabus"><select value={form.previousBoard} onChange={e=>setForm({...form,previousBoard:e.target.value})}><option value="">Not specified</option><option>State</option><option>CBSE</option><option>ICSE</option><option>Other</option></select></Field></div>
      <Field label="Previous result / remarks"><input value={form.previousResult} onChange={e=>setForm({...form,previousResult:e.target.value})}/></Field>
      <div className="form-section-title"><strong>Additional information</strong><span>Optional fields, collect only when needed</span></div>
      <div className="form-grid two-col"><Field label="Blood group"><select value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})}><option value="">Unknown / not provided</option>{['A+','A−','B+','B−','AB+','AB−','O+','O−'].map(v=><option key={v}>{v}</option>)}</select></Field><Field label="Religion (optional)"><input value={form.religion} onChange={e=>setForm({...form,religion:e.target.value})}/></Field></div>
      <div className="form-grid two-col"><Field label="Caste / category (optional)"><select value={form.casteCategory} onChange={e=>setForm({...form,casteCategory:e.target.value})}><option value="">Not provided</option><option>General</option><option>SC</option><option>ST</option><option>OBC</option><option>Other / school-defined</option><option>Prefer not to say</option></select></Field><Field label="Medical / accessibility notes"><input value={form.medicalNotes} onChange={e=>setForm({...form,medicalNotes:e.target.value})} placeholder="Optional; keep minimal"/></Field></div>
      <div className="student-privacy-note"><strong>Privacy reminder</strong><p>This demo stores records in this browser. Do not enter real children's personal, identity, social-category, religious, or medical details. Production use needs purpose limits, consent where required, and role-based access.</p></div>
      <div className="form-actions"><Button variant="secondary" onClick={()=>setShowForm(false)}>Cancel</Button><Button type="submit"><Plus size={15}/> Add student</Button></div>
    </form></Modal>}
    {selected && <Modal title={selected.name} subtitle={`Admission no. ${selected.admissionNo}`} onClose={()=>setSelected(null)}><div className="profile-summary"><Avatar name={selected.name} color="blue"/><div><strong>{selected.className} · Division {selected.section}</strong><p><StatusBadge value={selected.status}/></p></div></div><div className="detail-list"><div><span>Parent / guardian</span><strong>{selected.guardian}</strong></div><div><span>Guardian phone</span><strong>{selected.phone}</strong></div><div><span>Student ID</span><strong>{selected.id}</strong></div></div><div className="form-actions"><Button variant="secondary" onClick={()=>setSelected(null)}>Close profile</Button></div></Modal>}
  </div>
}

function Attendance({ data, update, notify }: { data: DemoState; update: (p: Partial<DemoState>) => void; notify: (s: string) => void }) {
  const [className, setClassName] = useState('Grade 5')
  const [section, setSection] = useState('A')
  const [date, setDate] = useState(today())
  const students = data.students.filter(s=>s.className===className && s.section===section && s.status==='Active')
  const statusFor = (id: string): AttendanceStatus => data.attendance.find(a=>a.studentId===id && a.date===date)?.status ?? 'Present'
  const setStatus = (studentId: string, status: AttendanceStatus) => {
    const other = data.attendance.filter(a=>!(a.studentId===studentId && a.date===date))
    update({ attendance: [...other, { studentId, date, status }] })
  }
  const present = students.filter(s=>statusFor(s.id)==='Present').length
  const absent = students.filter(s=>statusFor(s.id)==='Absent').length
  const leave = students.filter(s=>statusFor(s.id)==='Leave').length
  const save = () => notify(`Attendance saved for ${className} ${section} (${date}) in this demo.`)
  return <div className="page-stack">
    <PageHeading eyebrow="DAILY REGISTER" title="Attendance" description="Record and review class attendance in one place." action={<Button onClick={save}><Check size={16}/> Save attendance</Button>}/>
    <div className="metric-grid three-metrics"><MetricCard label="Present" value={present.toString()} icon={Check} tone="teal" note="Selected class"/><MetricCard label="Absent" value={absent.toString()} icon={AlertCircle} tone="orange" note="Needs follow-up"/><MetricCard label="On leave" value={leave.toString()} icon={Clock3} tone="purple" note="Approved / reported leave"/></div>
    <SectionCard title="Class register" subtitle="Select a class and mark each student's status">
      <div className="filter-row attendance-filters"><label className="select-box"><School size={15}/><select value={className} onChange={e=>setClassName(e.target.value)}>{classRows.map(c=><option key={c.name}>{c.name}</option>)}</select></label><label className="select-box"><Users size={15}/><select value={section} onChange={e=>setSection(e.target.value)}><option>A</option><option>B</option><option>C</option></select></label><label className="date-input"><CalendarDays size={15}/><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><span className="filter-spacer"/><span className="small-muted">{students.length} students in this sample class</span></div>
      {students.length ? <div className="table-scroll"><table><thead><tr><th>Student</th><th>Admission no.</th><th>Attendance status</th></tr></thead><tbody>{students.map((s,i)=><tr key={s.id}><td><div className="table-person"><Avatar name={s.name} color={['blue','purple','teal','orange'][i%4]}/><strong>{s.name}</strong></div></td><td className="muted-cell">{s.admissionNo}</td><td><div className="attendance-choice">{(['Present','Absent','Leave'] as AttendanceStatus[]).map(status=><button key={status} onClick={()=>setStatus(s.id,status)} className={`attendance-option ${statusFor(s.id)===status?`chosen chosen-${status.toLowerCase()}`:''}`}>{statusFor(s.id)===status&&<Check size={12}/ >}{status}</button>)}</div></td></tr>)}</tbody></table></div> : <EmptyState title="No students in this division" text="Choose another class or division to continue."/>}
    </SectionCard>
    <div className="info-callout"><AlertCircle size={17}/><p>Attendance changes are saved to this browser's demo data. No parent alerts or real attendance records are sent to anyone.</p></div>
  </div>
}

function Fees({ data, update, notify }: { data: DemoState; update: (p: Partial<DemoState>) => void; notify: (s: string) => void }) {
  const [query,setQuery]=useState('')
  const [filter,setFilter]=useState('All statuses')
  const [selected,setSelected]=useState<DemoState['fees'][number] | null>(null)
  const [payment,setPayment]=useState('')
  const [receipt,setReceipt]=useState<DemoState['fees'][number] | null>(null)
  const filtered=data.fees.filter(f=>`${f.studentName} ${f.id} ${f.className}`.toLowerCase().includes(query.toLowerCase()) && (filter==='All statuses'||f.status===filter))
  const outstanding=data.fees.reduce((sum,f)=>sum+Math.max(0,f.amountDue-f.amountPaid),0)
  const collected=data.fees.reduce((sum,f)=>sum+f.amountPaid,0)
  const submitPayment=(e:FormEvent)=>{
    e.preventDefault()
    const amount=Number(payment)
    if(!selected||!Number.isFinite(amount)||amount<=0){notify('Enter a valid payment amount.');return}
    const remaining=selected.amountDue-selected.amountPaid
    if(amount>remaining){notify(`Amount cannot exceed the remaining balance of ${money(remaining)}.`);return}
    const updated=updateFeePayment(selected,amount)
    update({fees:data.fees.map(f=>f.id===selected.id?updated:f)})
    setSelected(null);setPayment('');setReceipt(updated);notify('Simulated payment recorded. No money was collected.')
  }
  return <div className="page-stack">
    <PageHeading eyebrow="FEES & COLLECTIONS" title="Fee management" description="Review fee status, track balances, and simulate a payment." action={<Button variant="secondary" onClick={()=>{downloadCsv('schooldesk-fees.csv',[['Student','Class','Fee due','Paid','Balance','Status'],...filtered.map(f=>[f.studentName,f.className,f.amountDue,f.amountPaid,f.amountDue-f.amountPaid,f.status])]);notify('Fee report downloaded.')}}><Download size={16}/> Export list</Button>}/>
    <div className="metric-grid three-metrics"><MetricCard label="Total collected" value={shortMoney(collected)} icon={CircleDollarSign} tone="teal" note="Sample records"/><MetricCard label="Outstanding balance" value={shortMoney(outstanding)} icon={Wallet} tone="orange" note="Across fee records"/><MetricCard label="Fully paid records" value={data.fees.filter(f=>f.status==='Paid').length.toString()} icon={Check} tone="blue" note="Payment status"/></div>
    <SectionCard title="Fee records" subtitle={`${filtered.length} records`}><div className="filter-row"><label className="search-box"><Search size={16}/><input placeholder="Search student or fee ID..." value={query} onChange={e=>setQuery(e.target.value)}/></label><select className="plain-select" value={filter} onChange={e=>setFilter(e.target.value)}><option>All statuses</option><option>Paid</option><option>Pending</option><option>Overdue</option></select></div>
      {filtered.length?<div className="table-scroll"><table><thead><tr><th>Student</th><th>Class</th><th>Fee due</th><th>Paid</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map(f=><tr key={f.id}><td><div className="table-person"><Avatar name={f.studentName}/><div><strong>{f.studentName}</strong><small className="table-sub">{f.id}</small></div></div></td><td>{f.className}</td><td>{money(f.amountDue)}</td><td className="green-text">{money(f.amountPaid)}</td><td className="balance-text">{money(Math.max(0,f.amountDue-f.amountPaid))}</td><td><StatusBadge value={f.status}/></td><td>{f.status!=='Paid'?<Button variant="secondary" onClick={()=>{setSelected(f);setPayment(String(f.amountDue-f.amountPaid))}}>Record payment</Button>:<button className="text-action" onClick={()=>setReceipt(f)}><FileText size={14}/> Receipt</button>}</td></tr>)}</tbody></table></div>:<EmptyState title="No fee records found" text="Try a different search or status filter."/>}
    </SectionCard>
    <div className="info-callout"><AlertCircle size={17}/><p>This is a simulated fee workflow. It does not connect to a bank, UPI, payment gateway, or accounting system.</p></div>
    {selected&&<Modal title="Record a fee payment" subtitle={`${selected.studentName} · ${selected.id}`} onClose={()=>setSelected(null)}><div className="payment-summary"><div><span>Fee due</span><strong>{money(selected.amountDue)}</strong></div><div><span>Already paid</span><strong>{money(selected.amountPaid)}</strong></div><div><span>Balance</span><strong className="balance-text">{money(selected.amountDue-selected.amountPaid)}</strong></div></div><form onSubmit={submitPayment} className="form-grid"><Field label="Payment amount (₹)" required><input autoFocus type="number" min="1" max={selected.amountDue-selected.amountPaid} value={payment} onChange={e=>setPayment(e.target.value)}/></Field><Field label="Payment method"><select><option>Cash (demo)</option><option>Bank transfer (demo)</option><option>UPI (demo only)</option></select></Field><div className="form-actions"><Button variant="secondary" onClick={()=>setSelected(null)}>Cancel</Button><Button type="submit"><Check size={15}/> Record demo payment</Button></div></form></Modal>}
    {receipt&&<Modal title="Payment receipt preview" subtitle="Sample receipt · Not a valid financial document" onClose={()=>setReceipt(null)}><div className="receipt-preview"><div className="receipt-brand"><div className="brand-mark"><School size={20}/></div><div><strong>{data.schoolName}</strong><span>Fee payment receipt · DEMO</span></div></div><div className="receipt-paid"><Check size={18}/><strong>Payment recorded in demo</strong></div><div className="detail-list"><div><span>Student</span><strong>{receipt.studentName}</strong></div><div><span>Receipt reference</span><strong>DEMO-{receipt.id}</strong></div><div><span>Amount paid to date</span><strong>{money(receipt.amountPaid)}</strong></div><div><span>Outstanding balance</span><strong>{money(receipt.amountDue-receipt.amountPaid)}</strong></div></div><div className="receipt-watermark">SAMPLE ONLY</div></div><div className="form-actions"><Button variant="secondary" onClick={()=>setReceipt(null)}>Close</Button><Button onClick={()=>window.print()}><Printer size={15}/> Print preview</Button></div></Modal>}
  </div>
}

function Reports({ data, notify }: { data: DemoState; notify: (s: string) => void }) {
  const [report,setReport]=useState('Attendance summary')
  const [range,setRange]=useState('This month')
  const rows=report==='Attendance summary'?[
    ['Grade 1', '96.1%', '3.9%'],['Grade 2','94.8%','5.2%'],['Grade 3','95.4%','4.6%'],['Grade 4','93.7%','6.3%'],['Grade 5','94.2%','5.8%']
  ]:report==='Fee collection'?data.fees.slice(0,8).map(f=>[f.studentName,money(f.amountPaid),money(f.amountDue-f.amountPaid)]):Array.from(new Set(data.students.map(s=>s.className))).map(c=>[c,String(data.students.filter(s=>s.className===c).length),'Active sample records'])
  const headers=report==='Attendance summary'?['Class','Attendance rate','Absent / leave']:report==='Fee collection'?['Student','Amount paid','Balance']:['Class','Sample students','Record type']
  return <div className="page-stack"><PageHeading eyebrow="INSIGHTS & EXPORTS" title="Reports" description="Turn day-to-day records into useful summaries." action={<Button onClick={()=>{downloadCsv(`schooldesk-${report.toLowerCase().replaceAll(' ','-')}.csv`,[headers,...rows]);notify('Report CSV downloaded.')}}><Download size={16}/> Download CSV</Button>}/>
    <div className="report-controls"><label><span>Report type</span><select value={report} onChange={e=>setReport(e.target.value)}><option>Attendance summary</option><option>Fee collection</option><option>Student strength</option></select></label><label><span>Period</span><select value={range} onChange={e=>setRange(e.target.value)}><option>This month</option><option>This term</option><option>This academic year</option></select></label><div className="report-period"><CalendarDays size={17}/><div><span>Selected period</span><strong>{range}</strong></div></div></div>
    <div className="metric-grid three-metrics"><MetricCard label="Students in demo" value={data.students.length.toString()} icon={Users} tone="blue" note="Across sample grades"/><MetricCard label="Fee records" value={data.fees.length.toString()} icon={Wallet} tone="teal" note="Sample records"/><MetricCard label="Report period" value={range} icon={CalendarDays} tone="purple" note="Choose above"/></div>
    <SectionCard title={report} subtitle={`Preview · ${range}`} action={<Button variant="secondary" onClick={()=>notify('Report preview refreshed for the selected period.')}>Refresh preview</Button>}><div className="table-scroll"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div><div className="table-bottom-note"><ShieldCheck size={14}/> This is a preview generated from fictional demo records.</div></SectionCard>
  </div>
}

function StaffPage({ data, update, notify }: { data: DemoState; update: (p: Partial<DemoState>) => void; notify: (s: string) => void }) {
  const [query,setQuery]=useState('')
  const filtered=data.staff.filter(s=>`${s.name} ${s.role} ${s.department}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="page-stack"><PageHeading eyebrow="PEOPLE & ACCESS" title="Staff" description="View sample staff profiles and explore role-based access concepts." action={<Button onClick={()=>notify('Adding staff is planned for a later prototype iteration.')}><Plus size={16}/> Add staff</Button>}/><div className="metric-grid three-metrics"><MetricCard label="Staff profiles" value={data.staff.length.toString()} icon={ContactRound} tone="blue" note="Sample directory"/><MetricCard label="Active staff" value={data.staff.filter(s=>s.active).length.toString()} icon={Check} tone="teal" note="Currently active"/><MetricCard label="Role types" value={new Set(data.staff.map(s=>s.role)).size.toString()} icon={ShieldCheck} tone="purple" note="Example roles"/></div>
    <SectionCard title="Staff directory" subtitle="Permissions shown here are illustrative"><div className="filter-row"><label className="search-box"><Search size={16}/><input placeholder="Search staff, role, or department..." value={query} onChange={e=>setQuery(e.target.value)}/></label></div><div className="table-scroll"><table><thead><tr><th>Staff member</th><th>Role</th><th>Department</th><th>Email</th><th>Status</th><th>Demo access</th></tr></thead><tbody>{filtered.map((s,i)=><tr key={s.id}><td><div className="table-person"><Avatar name={s.name} color={['blue','purple','teal','orange'][i%4]}/><strong>{s.name}</strong></div></td><td>{s.role}</td><td>{s.department}</td><td>{s.email}</td><td><StatusBadge value={s.active?'Active':'Inactive'}/></td><td><label className="toggle"><input type="checkbox" checked={s.active} onChange={e=>{update({staff:data.staff.map(x=>x.id===s.id?{...x,active:e.target.checked}:x)});notify(`Demo access ${e.target.checked?'enabled':'disabled'} for ${s.name}.`)}}/><span/><small>{s.active?'Enabled':'Disabled'}</small></label></td></tr>)}</tbody></table></div></SectionCard><div className="info-callout"><ShieldCheck size={17}/><p>These switches only update sample UI state. Real user authentication and server-enforced permissions are not implemented.</p></div>
  </div>
}

function ClassesPage({ data }: { data: DemoState }) {
  const [year,setYear]=useState('2026–27')
  return <div className="page-stack"><PageHeading eyebrow="ACADEMIC STRUCTURE" title="Classes & divisions" description="Review the sample academic structure for the selected year."/><div className="report-controls"><label><span>Academic year</span><select value={year} onChange={e=>setYear(e.target.value)}><option>2026–27</option><option>2025–26</option><option>2027–28</option></select></label><div className="report-period"><School size={18}/><div><span>Academic structure</span><strong>12 grades · sample</strong></div></div></div><div className="class-grid">{classRows.map((c,i)=><div className="class-card" key={c.name}><div className="class-card-top"><div className={`class-icon class-icon-${i%4}`}><BookOpenCheck size={19}/></div><button className="icon-button tiny" aria-label={`Class ${c.name} details`}><MoreHorizontal size={17}/></button></div><h3>{c.name}</h3><p>{c.sections.length} divisions · {c.students} sample seats</p><div className="class-sections">{c.sections.map(section=><span key={section}>{section}</span>)}</div><div className="class-card-bottom"><div><span>Class teacher</span><strong>{c.classTeacher}</strong></div><div className="class-students"><strong>{data.students.filter(s=>s.className===c.name).length}</strong><span>in demo</span></div></div></div>)}</div><div className="info-callout"><AlertCircle size={17}/><p>Class capacities are illustrative. Student counts in this prototype represent the sample records, not a full 1,200-student database.</p></div></div>
}

function Settings({ data, update, reset, notify }: { data: DemoState; update: (p: Partial<DemoState>) => void; reset: () => void; notify: (s: string) => void }) {
  const [schoolName,setSchoolName]=useState(data.schoolName)
  const [address,setAddress]=useState('Munnar, Kerala, India')
  const [email,setEmail]=useState('office@example.test')
  const [phone,setPhone]=useState('04865 000 000')
  const [saved,setSaved]=useState(false)
  const save= (e:FormEvent)=>{e.preventDefault();if(!schoolName.trim()||!address.trim()){notify('School name and address are required.');return}update({schoolName});setSaved(true);notify('School settings updated in the demo.')}
  return <div className="page-stack"><PageHeading eyebrow="SCHOOL CONFIGURATION" title="Settings" description="Customise the fictional school workspace for your walkthrough."/><div className="settings-layout"><div className="settings-nav"><div className="settings-nav-item selected"><School size={17}/> School profile</div><div className="settings-nav-item"><CalendarDays size={17}/> Academic year</div><div className="settings-nav-item"><ShieldCheck size={17}/> Access & privacy</div><div className="settings-nav-item"><Bell size={17}/> Notifications</div></div><SectionCard title="School profile" subtitle="These settings apply only to this browser demo"><form className="settings-form" onSubmit={save}><div className="school-profile-banner"><div className="school-avatar large">MV</div><div><strong>{schoolName}</strong><span>School profile · Demo workspace</span></div><span className="demo-pill"><span/> Demo</span></div><Field label="School name" required><input value={schoolName} onChange={e=>setSchoolName(e.target.value)} /></Field><Field label="Address" required><input value={address} onChange={e=>setAddress(e.target.value)} /></Field><div className="form-grid two-col"><Field label="Office email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></Field><Field label="Office phone"><input value={phone} onChange={e=>setPhone(e.target.value)}/></Field></div><Field label="Academic year"><select value={data.academicYear} onChange={e=>update({academicYear:e.target.value})}><option>2025–26</option><option>2026–27</option><option>2027–28</option></select></Field><div className="form-actions"><Button type="submit"><Check size={15}/> Save changes</Button>{saved&&<span className="small-muted">Saved in demo</span>}</div></form></SectionCard></div><SectionCard title="Demo data" subtitle="Reset changes made during your school walkthrough"><div className="reset-row"><div className="reset-icon"><RotateCcw size={19}/></div><div><strong>Reset all demo data</strong><p>Restore the original sample students, attendance, fee records, staff, and school name.</p></div><Button variant="secondary" onClick={()=>{if(window.confirm('Reset all SchoolDesk demo changes?'))reset()}}>Reset demo</Button></div></SectionCard><div className="info-callout"><ShieldCheck size={17}/><p>Never enter real student data into this prototype. Browser storage is not a secure database.</p></div></div>
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <label className="field"><span>{label}{required&&<i> *</i>}</span>{children}</label>
}
function Modal({ title, subtitle, children, onClose }: { title: string; subtitle?: string; children: ReactNode; onClose: () => void }) {
  useEffect(()=>{const listener=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};window.addEventListener('keydown',listener);return()=>window.removeEventListener('keydown',listener)},[onClose])
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal" role="dialog" aria-modal="true" aria-label={title}><div className="modal-heading"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19}/></button></div><div className="modal-body">{children}</div></div></div>
}
function downloadCsv(filename: string, rows: (string|number)[][]) {
  const csv=rows.map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(',')).join('\r\n')
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'})
  const url=URL.createObjectURL(blob)
  const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url)
}

export default App
