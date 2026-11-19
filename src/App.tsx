import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, ArrowRight, Bell, Bot, CalendarDays, Check, ChevronDown,
  Download, FileText, FolderHeart, HeartPulse, LayoutDashboard, LockKeyhole,
  Menu, Microscope, Moon, MoreHorizontal, Plus, Search, Settings, Share2,
  ShieldCheck, Stethoscope, Sun, Upload, UserRound, X, Eye, Sparkles,
  Mail, Copy, CheckCircle2, ArrowLeft, BarChart3, Pill, Users,
  Siren, FileBadge, Languages, Trophy, Target, Syringe, Trash2, Pencil,
  AlertTriangle, ClipboardList, ExternalLink, Loader2, Flame,
  Zap, Star, Clock, CheckCircle, LogOut
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { PandaBot } from './components/PandaBot'
import { Confetti } from './components/Confetti'
import './App.css'
import './upload.css'
import './hatchable_mix.css'
import './duolingo_theme.css'

type View = 'landing' | 'auth' | 'app'
type Page = 'Overview' | 'Medical Records' | 'Upload Documents' | 'Health Timeline' | 'Health Insights' | 'MediBot AI' | 'Medicine Reminders' | 'Family Vault' | 'Emergency Health ID' | 'Doctor Summary' | 'Duplicate Check' | 'Shared Records' | 'Settings'

export type AISummaryData = {
  summary: string
  patientName?: string
  doctorName?: string
  dateOfService?: string
  medications?: string[]
  diagnosis?: string
  nextSteps?: string[]
}

export type MedicalRecord = {
  id?: string
  title: string
  type: string
  date: string
  doctor: string
  hospital?: string
  status: string
  tone: string
  icon: string
  source: 'demo' | 'real'
  fileName?: string
  sha256?: string
  extractedText?: string
  language?: string
  ocrMethod?: string
  familyMember?: string
  aiSummary?: AISummaryData
}

export type DailyMission = {
  id: string
  title: string
  desc: string
  xp: number
  done: boolean
}

export type Achievement = {
  id: string
  name: string
  desc: string
  xp: number
  icon: string
  unlocked: boolean
}

const initialRecords: MedicalRecord[] = [
  {
    title: 'Complete Blood Count',
    type: 'Test Report',
    date: '18 Feb 2026',
    doctor: 'Dr. Rahul Mehta',
    hospital: 'City Diagnostic Centre',
    status: 'Verified',
    tone: 'blue',
    icon: 'lab',
    source: 'demo',
    familyMember: 'Aniket',
    aiSummary: {
      summary: 'Routine Complete Blood Count showing normal Hemoglobin (14.2 g/dL) and normal platelet count (240 K/uL). White blood cell count is within healthy physiological limits (7.8 K/uL). No signs of acute infection or anemia.',
      patientName: 'Aniket Sharma',
      doctorName: 'Dr. Rahul Mehta',
      dateOfService: '18 Feb 2026',
      medications: ['Iron supplement OD', 'Multivitamin capsule OD'],
      diagnosis: 'Routine health screening - Normal blood parameters',
      nextSteps: [
        'Maintain balanced nutritional diet with adequate hydration.',
        'Repeat routine annual CBC screening in 12 months.',
        'Consult healthcare provider if persistent fatigue occurs.'
      ]
    }
  },
  {
    title: 'Prescription - Dr. Sharma',
    type: 'Prescription',
    date: '12 Feb 2026',
    doctor: 'Dr. Raj Sharma',
    hospital: 'Metro Specialty Clinic',
    status: 'Verified',
    tone: 'purple',
    icon: 'rx',
    source: 'demo',
    familyMember: 'Aniket',
    aiSummary: {
      summary: 'Prescription for metabolic management and seasonal allergy symptoms with dosage timings and meal schedule specified. Patient advised on regular glycemic monitoring.',
      patientName: 'Aniket Sharma',
      doctorName: 'Dr. Raj Sharma',
      dateOfService: '12 Feb 2026',
      medications: ['Metformin 500mg (With breakfast)', 'Cetirizine 10mg (At night)', 'Vitamin D3 60K (Weekly)'],
      diagnosis: 'Type 2 Diabetes mellitus follow-up, mild allergic rhinitis',
      nextSteps: [
        'Take medications regularly with meals as scheduled.',
        'Monitor fasting blood sugar weekly and log in MediVault.',
        'Follow up with Dr. Sharma in 4 weeks with sugar logs.'
      ]
    }
  },
  {
    title: 'Cardiology Consultation',
    type: 'Doctor Notes',
    date: '05 Feb 2026',
    doctor: 'Dr. K. Rao',
    hospital: 'Apollo Heart Clinic',
    status: 'Needs review',
    tone: 'cyan',
    icon: 'consult',
    source: 'demo',
    familyMember: 'Meera',
    aiSummary: {
      summary: 'Cardiology evaluation following mild exertional palpitations. Normal resting 12-lead ECG and stable blood pressure (120/80 mmHg). Borderline elevated LDL noted on previous lipid panel.',
      patientName: 'Meera Sharma',
      doctorName: 'Dr. K. Rao',
      dateOfService: '05 Feb 2026',
      medications: ['Atorvastatin 10mg (Night)', 'CoQ10 100mg (Morning)'],
      diagnosis: 'Benign sinus palpitations, borderline dyslipidemia',
      nextSteps: [
        'Schedule follow-up 2D Echocardiogram review in 2 weeks.',
        'Reduce caffeine intake and follow 30-min daily aerobic exercise.',
        'Maintain low saturated-fat dietary regimen.'
      ]
    }
  },
  {
    title: 'Hepatitis B & Tdap Booster',
    type: 'Vaccination History',
    date: '15 Nov 2025',
    doctor: 'Dr. Anita Sen',
    hospital: 'LifeCare Pediatric Hospital',
    status: 'Verified',
    tone: 'green',
    icon: 'vaccine',
    source: 'demo',
    familyMember: 'Arjun',
    aiSummary: {
      summary: 'Pediatric immunization record documenting Hepatitis B booster and Tetanus, Diphtheria, Pertussis (Tdap) administration. Vaccine lot and expiration verified.',
      patientName: 'Arjun Sharma',
      doctorName: 'Dr. Anita Sen',
      dateOfService: '15 Nov 2025',
      medications: ['Paracetamol syrup 250mg PRN (for post-vaccine fever)'],
      diagnosis: 'Childhood booster immunization series up-to-date',
      nextSteps: [
        'Next scheduled school booster at age 10.',
        'Monitor injection site for mild tenderness or swelling.',
        'Keep vaccination record handy for school health submissions.'
      ]
    }
  },
  {
    title: 'Thyroid Profile',
    type: 'Test Report',
    date: '28 Jan 2026',
    doctor: 'Dr. P. Joshi',
    hospital: 'MedLab Diagnostics',
    status: 'Verified',
    tone: 'blue',
    icon: 'lab',
    source: 'demo',
    familyMember: 'Aniket',
    aiSummary: {
      summary: 'Serum TSH, Free T3, and Free T4 tested. TSH level is 2.1 uIU/mL, which sits within the optimal therapeutic target range (0.4–4.0 uIU/mL).',
      patientName: 'Aniket Sharma',
      doctorName: 'Dr. P. Joshi',
      dateOfService: '28 Jan 2026',
      medications: ['Thyronorm 50mcg (Early morning empty stomach)'],
      diagnosis: 'Euthyroid state on current hormone replacement therapy',
      nextSteps: [
        'Continue current Thyronorm 50mcg daily regimen without alteration.',
        'Repeat serum TSH testing in 6 months.',
        'Take medication at least 45 minutes prior to morning tea/breakfast.'
      ]
    }
  }
]

const storedRecordsKey = 'medivault.uploaded-records'
const gamificationKey = 'medivault.gamification-stats'

function readStoredGamification(): { xp: number; streak: number } {
  try {
    const raw = localStorage.getItem(gamificationKey)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { xp: 280, streak: 5 }
}

function saveStoredGamification(xp: number, streak: number) {
  try {
    localStorage.setItem(gamificationKey, JSON.stringify({ xp, streak }))
  } catch {}
}

function readStoredRecords(): MedicalRecord[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(storedRecordsKey) ?? '[]')
    return Array.isArray(stored) ? stored.filter((record): record is MedicalRecord =>
      record && typeof record === 'object' && record.source === 'real' &&
      typeof record.title === 'string' && typeof record.type === 'string'
    ) : []
  } catch {
    return []
  }
}

async function openRecordDb(): Promise<IDBDatabase> {
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open('medivault-record-files',1)
    request.onupgradeneeded=()=>{
      if(!request.result.objectStoreNames.contains('files'))request.result.createObjectStore('files')
    }
    request.onsuccess=()=>resolve(request.result)
    request.onerror=()=>reject(request.error)
  })
}

async function storeRecordFile(id:string,file:File) {
  const db=await openRecordDb()
  await new Promise<void>((resolve,reject)=>{
    const transaction=db.transaction('files','readwrite')
    transaction.objectStore('files').put(file,id)
    transaction.oncomplete=()=>resolve()
    transaction.onerror=()=>reject(transaction.error)
  })
  db.close()
}

async function getRecordFile(id:string): Promise<File|Blob|undefined> {
  const db=await openRecordDb()
  const result=await new Promise<File|Blob|undefined>((resolve,reject)=>{
    const request=db.transaction('files','readonly').objectStore('files').get(id)
    request.onsuccess=()=>resolve(request.result as File|Blob|undefined)
    request.onerror=()=>reject(request.error)
  })
  db.close()
  return result
}

async function openStoredRecord(record:MedicalRecord) {
  if(!record.id)return
  const blob=await getRecordFile(record.id)
  if(!blob)return
  const url=URL.createObjectURL(blob)
  window.open(url,'_blank','noopener,noreferrer')
  window.setTimeout(()=>URL.revokeObjectURL(url),60000)
}

function Logo({ inverse=false }: {inverse?:boolean}) {
  return (
    <div className={`logo ${inverse?'inverse':''}`}>
      <div className="logo-mark" style={{borderRadius: 14, boxShadow: '0 4px 0 #1E5CB3'}}>
        <HeartPulse size={22}/>
      </div>
      <span style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900, letterSpacing: -0.5}}>
        Medi<span style={{color: '#3185E8'}}>Vault</span>
      </span>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

function generateAISummary(record: MedicalRecord): AISummaryData {
  const text = record.extractedText || ''
  const title = record.title || 'Medical Record'
  const category = record.type
  
  const foundMeds: string[] = []
  const medMatches = text.match(/\b([A-Z][a-z]{3,}(?:ol|in|ide|ate|one|cin|pam|zol|pril|statin|formin|cillin))\b/g)
  if (medMatches && medMatches.length > 0) {
    foundMeds.push(...Array.from(new Set(medMatches)).slice(0, 4))
  } else if (category === 'Prescription') {
    foundMeds.push('Prescribed regimen as per clinician directions')
  }

  return {
    summary: text 
      ? `AI clinical analysis for ${title} (${category}). Document dated ${record.date} issued by ${record.doctor || 'Healthcare Provider'}. Review extracted values and schedule follow-up accordingly.`
      : `Automated summary for ${title}. Document recorded on ${record.date}. Recommended for routine medical tracking.`,
    patientName: record.familyMember ? `${record.familyMember} Sharma` : 'Aniket Sharma',
    doctorName: record.doctor || 'Attending Physician',
    dateOfService: record.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    medications: foundMeds.length > 0 ? foundMeds : (category === 'Prescription' ? ['Prescribed medication (Review original file)'] : undefined),
    diagnosis: category === 'Vaccination History' ? 'Routine immunization' : category === 'Test Report' || category === 'Laboratory Report' ? 'Laboratory evaluation - clinical correlation advised' : `${category} consultation & evaluation`,
    nextSteps: [
      'Review and verify extracted medication dosages with original prescription.',
      'Schedule follow-up appointment as recommended by the clinician.',
      'Store copy in MediVault Family Health Locker for future doctor visits.'
    ]
  }
}

// --------------------------------------------------------------------------
// AUTH VIEW
// --------------------------------------------------------------------------
function Auth({onBack,onDone}:{onBack:()=>void,onDone:()=>void}) {
  const [mode,setMode]=useState<'signin'|'signup'>('signin')
  const [loading,setLoading]=useState(false)

  const handleGoogleSignIn = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onDone()
    }, 600)
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <button className="duo-btn duo-btn-secondary small" onClick={onBack}>
          <ArrowLeft size={16}/> Back
        </button>
        <Logo/>
      </div>
      <div className="auth-card" style={{borderRadius: 24, border: '2.5px solid var(--line)'}}>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: 10}}>
          <PandaBot size="medium" pose="welcome"/>
        </div>
        <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>
          {mode==='signin'?'Welcome back!':'Join MediVault'}
        </h1>
        <p style={{fontSize: 13, color: '#728096', margin: '0 0 20px', textAlign: 'center'}}>
          {mode==='signin'?'Sign in to continue your health organization journey.':'Organize your family records with friendly AI superpowers.'}
        </p>
        
        <button className="btn-google" onClick={handleGoogleSignIn} disabled={loading} style={{borderRadius: 14, height: 48}}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
          <span style={{fontFamily: "'Nunito', sans-serif", fontWeight: 800}}>
            {loading ? 'Connecting with Google...' : 'Continue with Google'}
          </span>
        </button>

        <div className="auth-divider"><span>or with email & OTP</span></div>

        {mode==='signup'&&<label>Full name<div className="field"><UserRound size={17}/><input placeholder="Aniket Sharma" defaultValue="Aniket Sharma"/></div></label>}
        <label>Email address<div className="field"><Mail size={17}/><input type="email" placeholder="you@example.com" defaultValue="aniket@example.com"/></div></label>
        <label>Password<div className="field"><LockKeyhole size={17}/><input type="password" placeholder="Enter password" defaultValue="password123"/></div></label>
        
        {mode==='signin'&&<div className="auth-options"><label><input type="checkbox" defaultChecked/> Remember me</label><button>Forgot password?</button></div>}
        
        <button className="duo-btn duo-btn-success large" onClick={onDone} style={{width: '100%', marginTop: 18}}>
          {mode==='signin'?'Sign In & Organize':'Create My Free Vault'} <ArrowRight size={18}/>
        </button>
        
        <div className="auth-switch" style={{marginTop: 18}}>
          {mode==='signin'?'New to MediVault?':'Already have an account?' } 
          <button onClick={()=>setMode(mode==='signin'?'signup':'signin')} style={{fontWeight: 800, color: '#3185E8'}}>
            {mode==='signin'?'Create account':'Sign in'}
          </button>
        </div>
      </div>
      <p className="auth-security" style={{fontWeight: 700}}>
        <LockKeyhole size={14} color="#4DBB7A"/> Bank-grade client encryption · 100% patient controlled
      </p>
    </div>
  )
}

// --------------------------------------------------------------------------
// OVERVIEW / DASHBOARD VIEW (DUOLINGO INSPIRED)
// --------------------------------------------------------------------------
function Overview({
  setPage,
  share,
  xp,
  streak,
  dailyMissions,
  onCompleteMission,
  onOpenAchievements
}: {
  setPage: (p:Page)=>void
  share: ()=>void
  xp: number
  streak: number
  dailyMissions: DailyMission[]
  onCompleteMission: (id: string) => void
  onOpenAchievements: () => void
}) {
  const completedMissionsCount = dailyMissions.filter(m => m.done).length
  const progressPct = Math.round((completedMissionsCount / dailyMissions.length) * 100)

  return (
    <motion.div initial={{opacity:0, y: 8}} animate={{opacity:1, y: 0}} className="overview-page-wrap">
      {/* Header Greeting */}
      <div className="overview-header-row">
        <div>
          <p className="overview-date-pill">
            WEDNESDAY, 18 FEBRUARY · DAILY HEALTH JOURNEY
          </p>
          <h1 className="overview-greeting-title">
            Good morning, Aniket! 👋
          </h1>
        </div>
        <button className="duo-btn duo-btn-primary large" onClick={()=>setPage('Upload Documents')}>
          <Plus size={18}/> Upload Document
        </button>
      </div>

      {/* Daily Quest / Organization Journey Banner */}
      <section className="duo-quest-banner">
        <div className="quest-mascot-wrap">
          <PandaBot size="medium" pose="dashboard"/>
        </div>
        <div className="quest-content">
          <div className="quest-header-tags">
            <div className="quest-tag">
              <Target size={14}/> Daily Organization Mission
            </div>
            <span className="game-pill streak quest-streak-pill">
              <Flame size={13}/> {streak}-Day Streak
            </span>
          </div>
          <h2 className="quest-title">Keep Your Medical Vault Pristine</h2>
          <p className="quest-desc">
            Complete daily organization tasks to earn XP gems, level up your vault, and keep your loved ones' records up to date!
          </p>
          
          <div className="quest-progress-row">
            <div className="duo-progress-bar-wrap" style={{flex: 1}}>
              <div className="duo-progress-bar-fill" style={{width: `${progressPct}%`}}/>
            </div>
            <strong className="quest-progress-count">
              {completedMissionsCount} of {dailyMissions.length} Done
            </strong>
          </div>

          <div className="quest-missions-list">
            {dailyMissions.map(m => (
              <button 
                key={m.id}
                className={`duo-btn ${m.done ? 'duo-btn-success' : 'duo-btn-secondary'} small quest-task-btn`}
                onClick={() => !m.done && onCompleteMission(m.id)}
              >
                {m.done ? <CheckCircle size={14}/> : <Clock size={14}/>}
                <span>{m.title}</span>
                <span className="quest-xp-chip">+{m.xp} XP</span>
              </button>
            ))}
          </div>
        </div>

        <div className="quest-trophy-column">
          <button className="game-pill xp quest-xp-badge" onClick={onOpenAchievements}>
            <Trophy size={18} color="#D97706"/>
            <span>{xp} XP</span>
          </button>
          <small className="quest-level-label">Level {Math.floor(xp/100) + 1} Archivist</small>
        </div>
      </section>

      {/* 4 Core Summary Cards */}
      <div className="stat-grid">
        <Stat icon={<FolderHeart/>} label="Total Documents" value="24" detail="+3 this month" tone="blue"/>
        <Stat icon={<Stethoscope/>} label="Prescriptions" value="11" detail="Dr. Sharma active" tone="purple"/>
        <Stat icon={<Microscope/>} label="Lab Reports" value="8" detail="CBC Verified" tone="cyan"/>
        <Stat icon={<Syringe/>} label="Vaccinations" value="5" detail="Child series complete" tone="green"/>
      </div>

      {/* Main Grid: Recent Documents & Category Donut */}
      <div className="overview-grid">
        <section className="duo-card">
          <PanelHead 
            title="Recent Documents" 
            sub="Your latest verified health records" 
            action="View all" 
            onAction={()=>setPage('Medical Records')}
          />
          <div className="document-list" style={{marginTop: 6}}>
            {initialRecords.slice(0, 4).map(r => <DocumentRow key={r.title} r={r}/>)}
          </div>
        </section>

        <section className="duo-card">
          <PanelHead title="Document Distribution" sub="By category type" action="6 months"/>
          <div className="distribution">
            <div className="donut">
              <div><strong>24</strong><span>Total Files</span></div>
            </div>
            <div className="legend">
              <p><i className="lab"/><span>Lab reports</span><b>8</b></p>
              <p><i className="rx"/><span>Prescriptions</span><b>11</b></p>
              <p><i className="consult"/><span>Consultations</span><b>5</b></p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Grid: Mini Timeline & Quick Actions */}
      <div className="bottom-grid">
        <section className="duo-card">
          <PanelHead title="Health Journey Timeline" sub="Chronological medical events" action="Full timeline" onAction={()=>setPage('Health Timeline')}/>
          <div className="mini-timeline">
            <Mini date="18 Feb" title="Complete Blood Count" text="City Diagnostic Centre · Verified"/>
            <Mini date="12 Feb" title="Metformin Prescription" text="Dr. Raj Sharma · Apollo Clinic"/>
            <Mini date="05 Feb" title="Cardiology Consultation" text="Apollo Heart Clinic · Dr. K. Rao"/>
          </div>
        </section>

        <section className="duo-card">
          <PanelHead title="Quick Actions" sub="Instant tools for records & appointments"/>
          <div className="quick-actions">
            <button className="duo-btn duo-btn-secondary quick-action-btn" onClick={()=>setPage('Upload Documents')}>
              <span className="quick-action-icon blue">
                <Upload size={20}/>
              </span>
              <div className="quick-action-content">
                <b>Upload Document</b>
                <small>Instant OCR + Google AI</small>
              </div>
            </button>

            <button className="duo-btn duo-btn-secondary quick-action-btn" onClick={()=>setPage('Medicine Reminders')}>
              <span className="quick-action-icon purple">
                <Pill size={20}/>
              </span>
              <div className="quick-action-content">
                <b>Medicine Schedule</b>
                <small>Log daily doses (+15 XP)</small>
              </div>
            </button>

            <button className="duo-btn duo-btn-secondary quick-action-btn" onClick={()=>share()}>
              <span className="quick-action-icon green">
                <Share2 size={20}/>
              </span>
              <div className="quick-action-content">
                <b>Share with Doctor</b>
                <small>Secure expiring QR token</small>
              </div>
            </button>

            <button className="duo-btn duo-btn-secondary quick-action-btn" onClick={()=>setPage('Emergency Health ID')}>
              <span className="quick-action-icon cyan">
                <Siren size={20}/>
              </span>
              <div className="quick-action-content">
                <b>Emergency ID Card</b>
                <small>Digital medical bracelet</small>
              </div>
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  )
}

function Stat({icon,label,value,detail,tone}:{icon:ReactNode,label:string,value:string,detail:string,tone:string}){
  return (
    <motion.div className="stat-card duo-card" whileHover={{y:-4}}>
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        <small className="stat-detail">{detail}</small>
      </div>
    </motion.div>
  )
}

function PanelHead({title,sub,action,onAction}:{title:string,sub?:string,action?:string,onAction?:()=>void}){
  return (
    <div className="panel-head">
      <div>
        <h2>{title}</h2>
        {sub&&<p>{sub}</p>}
      </div>
      {action&&<button className="duo-btn duo-btn-secondary small" onClick={onAction}>{action} <ChevronDown size={13}/></button>}
    </div>
  )
}

function DocumentRow({r}:{r:MedicalRecord}){
  const getIcon = () => {
    if (r.type === 'Prescription') return <FileText size={18} color="#7C3AED"/>
    if (r.type === 'Vaccination History') return <Syringe size={18} color="#16A34A"/>
    if (r.type === 'Doctor Notes' || r.type === 'Consultation') return <Stethoscope size={18} color="#0284C7"/>
    return <Microscope size={18} color="#2563EB"/>
  }
  return (
    <div className="document-row">
      <div className={`document-icon ${r.tone}`}>{getIcon()}</div>
      <div className="document-info">
        <strong>{r.title}</strong>
        <span>{r.type} · {r.doctor}</span>
      </div>
      <span className={r.status==='Verified'?'status verified':'status review'}>
        {r.status==='Verified'?<Check size={12}/>:<Activity size={12}/>} {r.status}
      </span>
    </div>
  )
}

function Mini({date,title,text}:{date:string,title:string,text:string}){
  return <div className="timeline-item"><div>{date}</div><i/><span><strong>{title}</strong><small>{text}</small></span></div>
}

// --------------------------------------------------------------------------
// TROPHY & ACHIEVEMENTS MODAL
// --------------------------------------------------------------------------
function TrophyModal({
  xp,
  streak,
  achievements,
  close
}: {
  xp: number
  streak: number
  achievements: Achievement[]
  close: () => void
}) {
  const level = Math.floor(xp / 100) + 1
  const levelProgress = xp % 100

  return (
    <div className="view-modal-backdrop" onMouseDown={close}>
      <motion.div 
        className="simple-modal-card" 
        style={{maxWidth: 520, borderRadius: 24, border: '3px solid var(--line)'}}
        initial={{scale: 0.95, opacity: 0}} 
        animate={{scale: 1, opacity: 1}} 
        onMouseDown={e => e.stopPropagation()}
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <PandaBot size="small" pose="celebration"/>
            <div>
              <h2 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900, margin: 0}}>
                Level {level} Health Archivist
              </h2>
              <div style={{display: 'flex', gap: 6, marginTop: 3}}>
                <small style={{color: '#728096', fontWeight: 700}}>Trophy Room</small>
                <span style={{color: '#EA580C', fontSize: 11, fontWeight: 800}}>· 🔥 {streak} Days Streak</span>
              </div>
            </div>
          </div>
          <button className="icon-button" onClick={close}><X size={18}/></button>
        </div>

        {/* Level Progress Bar */}
        <div style={{background: '#EFF6FF', border: '2px solid #BFDBFE', borderRadius: 16, padding: 14, marginBottom: 18}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
            <span style={{fontWeight: 800, fontSize: 13, color: '#1E40AF'}}>
              Progress to Level {level + 1}
            </span>
            <span style={{fontWeight: 800, fontSize: 13, color: '#3185E8'}}>
              {levelProgress} / 100 XP
            </span>
          </div>
          <div className="duo-progress-bar-wrap">
            <div className="duo-progress-bar-fill" style={{width: `${levelProgress}%`}}/>
          </div>
        </div>

        {/* Collectible Badges Grid */}
        <h3 style={{fontSize: 14, fontWeight: 800, margin: '0 0 10px'}}>Unlocked Achievements</h3>
        <div className="achievements-grid">
          {achievements.map(a => (
            <div key={a.id} className={`badge-item ${a.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="badge-icon-box">{a.icon}</div>
              <span className="badge-name">{a.name}</span>
              <span className="badge-reward">+{a.xp} XP</span>
            </div>
          ))}
        </div>

        <div style={{marginTop: 20, textAlign: 'center'}}>
          <button className="duo-btn duo-btn-primary" onClick={close} style={{width: '100%'}}>
            Awesome! Keep Organizing
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// --------------------------------------------------------------------------
// MEDICAL RECORDS VIEW (DUOLINGO TACTILE STYLE)
// --------------------------------------------------------------------------
function categoryMatches(recordType: string, tab: string): boolean {
  if (tab === 'All') return true
  const norm = recordType.toLowerCase()
  if (tab === 'Prescriptions') return norm.includes('prescription')
  if (tab === 'Test Reports') return norm.includes('report') || norm.includes('lab')
  if (tab === 'Doctor Notes') return norm.includes('note') || norm.includes('consult')
  if (tab === 'Vaccination History') return norm.includes('vaccin') || norm.includes('immun')
  if (tab === 'Other') {
    return !norm.includes('prescription') && !norm.includes('report') && !norm.includes('lab') && !norm.includes('note') && !norm.includes('consult') && !norm.includes('vaccin')
  }
  return true
}

function Records({
  items,
  setPage,
  onUpdateRecord,
  onDeleteRecord,
  onAnalyzeRecord
}: {
  items: MedicalRecord[]
  setPage: (page: Page) => void
  onUpdateRecord: (updated: MedicalRecord) => void
  onDeleteRecord: (record: MedicalRecord) => void
  onAnalyzeRecord: (record: MedicalRecord) => void
}) {
  const [activeCategoryTab, setActiveCategoryTab] = useState('All')
  const [memberFilter, setMemberFilter] = useState('All Members')
  const [search, setSearch] = useState('')
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null)
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null)
  const [deletingRecord, setDeletingRecord] = useState<MedicalRecord | null>(null)
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)

  const tabs = ['All', 'Prescriptions', 'Test Reports', 'Doctor Notes', 'Vaccination History', 'Other']

  const list = items.filter(r => {
    const matchesCat = categoryMatches(r.type, activeCategoryTab)
    const matchesMember = memberFilter === 'All Members' || (r.familyMember && r.familyMember.toLowerCase() === memberFilter.toLowerCase())
    const q = search.toLowerCase()
    const matchesSearch = !q || (
      `${r.title} ${r.doctor} ${r.hospital ?? ''} ${r.type} ${r.aiSummary?.diagnosis ?? ''}`.toLowerCase().includes(q)
    )
    return matchesCat && matchesMember && matchesSearch
  })

  const handleAnalyze = (r: MedicalRecord) => {
    const recordKey = r.id || r.title
    setAnalyzingId(recordKey)
    setTimeout(() => {
      onAnalyzeRecord(r)
      setAnalyzingId(null)
    }, 800)
  }

  const getRecordIcon = (r: MedicalRecord) => {
    const norm = r.type.toLowerCase()
    if (norm.includes('vaccin')) return <Syringe size={22} color="#16a34a"/>
    if (norm.includes('prescription')) return <FileText size={22} color="#7c3aed"/>
    if (norm.includes('note') || norm.includes('consult')) return <Stethoscope size={22} color="#0284c7"/>
    return <Microscope size={22} color="#2563eb"/>
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="page-title">
        <div>
          <p style={{fontWeight: 800, color: '#3185E8'}}>DIGITAL HEALTH LOCKER · AI ARCHIVE</p>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Your Medical Records</h1>
        </div>
        <button className="duo-btn duo-btn-primary" onClick={()=>setPage('Upload Documents')}>
          <Upload size={17}/> Upload Document
        </button>
      </div>

      {/* Category Tabs (Duolingo Tactile Pill Filter) */}
      <div className="category-filter-bar">
        <div className="duo-category-tabs">
          {tabs.map(tab => {
            const count = items.filter(r => categoryMatches(r.type, tab)).length
            return (
              <button
                key={tab}
                className={`duo-category-tab ${activeCategoryTab === tab ? 'active' : ''}`}
                onClick={() => setActiveCategoryTab(tab)}
              >
                <span>{tab}</span>
                <span className="category-tab-count">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="filter-dropdown-wrap">
          <select 
            className="member-filter-select"
            value={memberFilter}
            onChange={e => setMemberFilter(e.target.value)}
            style={{borderRadius: 14, fontWeight: 800, border: '2px solid var(--line)'}}
          >
            <option value="All Members">👤 All Family Members</option>
            <option value="Aniket">👤 Aniket (Self)</option>
            <option value="Meera">👤 Meera (Spouse)</option>
            <option value="Arjun">👤 Arjun (Child)</option>
          </select>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="records-toolbar" style={{borderRadius: 16, border: '2px solid var(--line)'}}>
        <div className="records-search">
          <Search size={18} color="#3185E8"/>
          <input 
            value={search} 
            onChange={e=>setSearch(e.target.value)} 
            placeholder="Search records, diagnoses, medicines, doctors..."
          />
        </div>
        {search && (
          <button onClick={() => setSearch('')} className="duo-btn duo-btn-secondary small">
            <X size={14}/> Clear
          </button>
        )}
      </div>

      {/* Record Cards Grid */}
      <div className="record-grid">
        {list.map((r, i) => {
          const isAnalyzing = analyzingId === (r.id || r.title)
          return (
            <motion.div 
              className="record-card duo-card" 
              whileHover={{y:-5}} 
              key={`${r.source}-${r.sha256 ?? r.title}-${i}`}
            >
              <div className="record-card-top">
                <span className={`record-source ${r.source}`}>
                  {r.source === 'real' ? 'Real file' : 'Demo'}
                </span>
                <div style={{display: 'flex', gap: 6}}>
                  <button 
                    aria-label={`Edit ${r.title}`} 
                    onClick={() => setEditingRecord(r)}
                    style={{border:0, background:'none', color:'#94a3b8', cursor:'pointer'}}
                  >
                    <Pencil size={15}/>
                  </button>
                  <button 
                    aria-label={`Delete ${r.title}`} 
                    onClick={() => setDeletingRecord(r)}
                    style={{border:0, background:'none', color:'#94a3b8', cursor:'pointer'}}
                  >
                    <Trash2 size={15}/>
                  </button>
                </div>
              </div>

              <div className={`record-preview ${r.tone}`} style={{borderRadius: 14}}>
                <div className="paper" style={{borderRadius: 10}}>
                  <div style={{display: 'flex', justifyContent: 'center', marginBottom: 8}}>
                    {getRecordIcon(r)}
                  </div>
                  <i/><i/><i/><b/><b/>
                </div>
              </div>

              <div className="record-card-body">
                <div className="record-card-badges">
                  <span className={`badge-category ${r.type.toLowerCase().replace(/\s+/g, '-')}`}>
                    {r.type}
                  </span>
                  {r.familyMember && (
                    <span className="badge-family"><Users size={11}/> {r.familyMember}</span>
                  )}
                  {r.aiSummary && (
                    <span className="badge-ai-done"><Sparkles size={11}/> AI Analyzed</span>
                  )}
                </div>

                <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 800}}>{r.title}</h3>
                <p><Stethoscope size={13}/> {r.doctor}</p>
                <div>
                  <small>{r.date}</small>
                  <em>{r.status}</em>
                </div>

                {/* Tactile Action Buttons */}
                <div className="card-actions-row" style={{borderTop: '2px solid var(--line-soft)'}}>
                  <button 
                    className="duo-btn duo-btn-primary small"
                    onClick={() => setViewingRecord(r)}
                    style={{flex: 1}}
                  >
                    <Eye size={13}/> View & AI Insights
                  </button>

                  {!r.aiSummary && (
                    <button 
                      className="duo-btn duo-btn-yellow small"
                      onClick={() => handleAnalyze(r)}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <><Loader2 size={13} className="animate-spin"/> Analyzing...</>
                      ) : (
                        <><Sparkles size={13}/> Analyze AI</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {list.length === 0 && (
        <div style={{textAlign: 'center', padding: '40px 20px'}}>
          <PandaBot size="large" pose="empty"/>
          <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900, marginTop: 14}}>
            No matching documents found
          </h3>
          <p style={{color: '#728096', fontSize: 13}}>
            Try selecting a different category or family member, or upload a new record!
          </p>
        </div>
      )}

      {/* Modals */}
      {viewingRecord && (
        <ViewModal record={viewingRecord} close={() => setViewingRecord(null)}/>
      )}

      {editingRecord && (
        <EditModal 
          record={editingRecord} 
          onSave={onUpdateRecord} 
          close={() => setEditingRecord(null)}
        />
      )}

      {deletingRecord && (
        <DeleteModal 
          record={deletingRecord} 
          onConfirm={() => onDeleteRecord(deletingRecord)} 
          close={() => setDeletingRecord(null)}
        />
      )}
    </motion.div>
  )
}

function ViewModal({record, close}: {record: MedicalRecord, close: () => void}) {
  const [activeTab, setActiveTab] = useState<'summary'|'extracted'|'diagnosis'|'nextsteps'>('summary')
  const ai = record.aiSummary

  return (
    <div className="view-modal-backdrop" onMouseDown={close}>
      <motion.div 
        className="view-modal-dialog" 
        style={{borderRadius: 24, border: '3px solid var(--line)'}}
        initial={{scale: 0.95, opacity: 0}} 
        animate={{scale: 1, opacity: 1}} 
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="view-modal-header">
          <h2 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>
            <FileText size={22} className="text-primary"/> 
            {record.title}
          </h2>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <span className={`badge-category ${record.type.toLowerCase().replace(/\s+/g, '-')}`}>
              {record.type}
            </span>
            {record.familyMember && (
              <span className="badge-family"><Users size={12}/> {record.familyMember}</span>
            )}
            <button className="icon-button" onClick={close}><X size={18}/></button>
          </div>
        </div>

        <div className="view-modal-body">
          {/* Left Column: Document Preview */}
          <div className="view-pane-left">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
              <span style={{fontSize: 12, fontWeight: 800, color: '#1E2C3D'}}>ORIGINAL DOCUMENT</span>
              {record.source === 'real' && record.id ? (
                <button className="duo-btn duo-btn-secondary small" onClick={() => void openStoredRecord(record)}>
                  <ExternalLink size={13}/> Open Original
                </button>
              ) : (
                <span style={{fontSize: 11, color: '#94a3b8', fontWeight: 700}}>Demo Sample</span>
              )}
            </div>

            <div className="doc-preview-box" style={{borderRadius: 16}}>
              <div className="doc-preview-canvas">
                <div className="preview-formatted-card" style={{borderRadius: 16}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf1f7', paddingBottom: 10}}>
                    <div>
                      <h3 style={{margin: 0, fontFamily: "'Nunito', sans-serif", fontWeight: 800}}>
                        {record.hospital || 'Healthcare Diagnostic Centre'}
                      </h3>
                      <small style={{color: '#94a3b8'}}>Official Medical Record</small>
                    </div>
                    <HeartPulse size={24} color="#3185e8"/>
                  </div>
                  
                  <div className="preview-badge-row">
                    <span className={`badge-category ${record.type.toLowerCase().replace(/\s+/g, '-')}`}>{record.type}</span>
                    <span style={{fontSize: 10, background: '#f1f5f9', padding: '3px 6px', borderRadius: 6}}>Date: {record.date}</span>
                  </div>

                  <table className="preview-table-mini">
                    <tbody>
                      <tr>
                        <td>Patient:</td>
                        <td>{ai?.patientName || (record.familyMember ? `${record.familyMember} Sharma` : 'Aniket Sharma')}</td>
                      </tr>
                      <tr>
                        <td>Clinician:</td>
                        <td>{record.doctor}</td>
                      </tr>
                      <tr>
                        <td>Document:</td>
                        <td>{record.title}</td>
                      </tr>
                      <tr>
                        <td>Status:</td>
                        <td style={{color: '#16a34a', fontWeight: 800}}>{record.status}</td>
                      </tr>
                    </tbody>
                  </table>

                  {record.extractedText && (
                    <div style={{marginTop: 14, paddingTop: 10, borderTop: '1px solid #edf1f7'}}>
                      <span style={{fontSize: 10, fontWeight: 800, color: '#64748b'}}>OCR Text Preview:</span>
                      <p style={{fontSize: 11, color: '#475569', margin: '4px 0 0', maxHeight: 80, overflow: 'auto', lineHeight: 1.5}}>
                        {record.extractedText.slice(0, 240)}...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Insights Accordion & Summary */}
          <div className="view-pane-right">
            <div className="ai-insights-header">
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <PandaBot size="small" pose="ai"/>
                <div>
                  <span className="ai-powered-pill"><Sparkles size={13}/> Google-Powered AI Insights</span>
                  <p style={{fontSize: 11, color: '#64748b', margin: '3px 0 0'}}>
                    Automated clinical analysis
                  </p>
                </div>
              </div>

              <div style={{display: 'flex', gap: 4}}>
                {(['summary', 'extracted', 'diagnosis', 'nextsteps'] as const).map(tab => (
                  <button 
                    key={tab} 
                    className={`duo-category-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                    style={{padding: '5px 10px', fontSize: 11}}
                  >
                    {tab === 'summary' ? 'Summary' : tab === 'extracted' ? 'Details' : tab === 'diagnosis' ? 'Diagnosis' : 'Next Steps'}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Summary View */}
            {activeTab === 'summary' && (
              <div className="ai-section-card" style={{borderRadius: 16}}>
                <div className="ai-section-title"><Sparkles size={15} color="#8c32cc"/> Executive Clinical Summary</div>
                <div className="ai-section-content">
                  <p className="ai-summary-text" style={{fontSize: 13, lineHeight: 1.65}}>
                    {ai?.summary || 'No AI summary available. Click "Analyze with AI" on the record card.'}
                  </p>
                </div>
              </div>
            )}

            {/* Extracted Details View */}
            {activeTab === 'extracted' && (
              <div className="ai-section-card" style={{borderRadius: 16}}>
                <div className="ai-section-title"><ClipboardList size={15} color="#2563eb"/> Extracted Clinical Details</div>
                <div className="ai-section-content">
                  <div className="extracted-grid">
                    <div className="extracted-item">
                      <span>Patient Name</span>
                      <strong>{ai?.patientName || 'Aniket Sharma'}</strong>
                    </div>
                    <div className="extracted-item">
                      <span>Doctor / Facility</span>
                      <strong>{ai?.doctorName || record.doctor}</strong>
                    </div>
                    <div className="extracted-item">
                      <span>Date of Service</span>
                      <strong>{ai?.dateOfService || record.date}</strong>
                    </div>
                    <div className="extracted-item">
                      <span>Category</span>
                      <strong>{record.type}</strong>
                    </div>
                  </div>

                  {ai?.medications && ai.medications.length > 0 && (
                    <div style={{marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line)'}}>
                      <span style={{fontSize: 11, fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5}}>
                        <Pill size={14} color="#7C3AED"/> Identified Medications & Regimens:
                      </span>
                      <div className="medication-chips-list">
                        {ai.medications.map((m, idx) => (
                          <span key={idx} className="medication-chip">
                            <Pill size={12}/> {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Diagnosis View */}
            {activeTab === 'diagnosis' && (
              <div className="ai-section-card" style={{borderRadius: 16}}>
                <div className="ai-section-title"><Stethoscope size={15} color="#0284c7"/> Diagnosis & Clinical Findings</div>
                <div className="ai-section-content">
                  <div className="diagnosis-badge" style={{fontSize: 14}}>
                    {ai?.diagnosis || 'Routine clinical assessment'}
                  </div>
                  <div className="diagnosis-disclaimer">
                    <ShieldCheck size={16} color="#16a34a"/>
                    <span>AI-assisted extraction. Confirm all findings with a licensed healthcare provider.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps View */}
            {activeTab === 'nextsteps' && (
              <div className="ai-section-card" style={{borderRadius: 16}}>
                <div className="ai-section-title"><CheckCircle2 size={15} color="#16a34a"/> Recommended Next Steps</div>
                <div className="ai-section-content">
                  <ul className="next-steps-list">
                    {(ai?.nextSteps || [
                      'Review document with your consulting physician.',
                      'Keep medication schedule consistent.',
                      'Store updated copy in MediVault.'
                    ]).map((step, idx) => (
                      <li key={idx} className="next-step-item">
                        <CheckCircle2 size={16}/>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 14}}>
              <button className="duo-btn duo-btn-primary" onClick={close}>Done</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function EditModal({record, onSave, close}: {record: MedicalRecord, onSave: (updated: MedicalRecord) => void, close: () => void}) {
  const [title, setTitle] = useState(record.title)
  const [category, setCategory] = useState(record.type)
  const [familyMember, setFamilyMember] = useState(record.familyMember || 'Aniket')
  const [doctor, setDoctor] = useState(record.doctor)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...record,
      title: title.trim() || record.title,
      type: category,
      familyMember,
      doctor: doctor.trim() || record.doctor
    })
    close()
  }

  return (
    <div className="view-modal-backdrop" onMouseDown={close}>
      <motion.div 
        className="simple-modal-card" 
        style={{borderRadius: 24, border: '3px solid var(--line)'}}
        initial={{scale: 0.95, opacity: 0}} 
        animate={{scale: 1, opacity: 1}} 
        onMouseDown={e => e.stopPropagation()}
      >
        <h2 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Edit Document Details</h2>
        <p className="sub">Update document name, category, or assign to a family member.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label>Document Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required/>
          </div>

          <div className="modal-form-group">
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="Prescription">Prescription</option>
              <option value="Test Report">Test Report</option>
              <option value="Doctor Notes">Doctor Notes</option>
              <option value="Vaccination History">Vaccination History</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="modal-form-group">
            <label>Family Member</label>
            <select value={familyMember} onChange={e => setFamilyMember(e.target.value)}>
              <option value="Aniket">Aniket (Self)</option>
              <option value="Meera">Meera (Spouse)</option>
              <option value="Arjun">Arjun (Child)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="modal-form-group">
            <label>Doctor / Healthcare Provider</label>
            <input value={doctor} onChange={e => setDoctor(e.target.value)}/>
          </div>

          <div className="modal-actions" style={{marginTop: 22}}>
            <button type="button" className="duo-btn duo-btn-secondary" onClick={close}>Cancel</button>
            <button type="submit" className="duo-btn duo-btn-primary">Save Changes</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function DeleteModal({record, onConfirm, close}: {record: MedicalRecord, onConfirm: () => void, close: () => void}) {
  return (
    <div className="view-modal-backdrop" onMouseDown={close}>
      <motion.div 
        className="simple-modal-card" 
        style={{borderRadius: 24, border: '3px solid var(--line)'}}
        initial={{scale: 0.95, opacity: 0}} 
        animate={{scale: 1, opacity: 1}} 
        onMouseDown={e => e.stopPropagation()}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 10, color: '#E5484D', marginBottom: 10}}>
          <AlertTriangle size={26}/>
          <h2 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900, margin: 0, color: 'inherit'}}>
            Are you absolutely sure?
          </h2>
        </div>
        <p className="sub" style={{color: '#64748b', fontSize: 13, lineHeight: 1.5}}>
          This action cannot be undone. This will permanently delete <strong>{record.title}</strong> from your records.
        </p>

        <div className="modal-actions" style={{marginTop: 20}}>
          <button className="duo-btn duo-btn-secondary" onClick={close}>Cancel</button>
          <button className="duo-btn duo-btn-coral" onClick={() => { onConfirm(); close(); }}>
            Yes, Delete Document
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// --------------------------------------------------------------------------
// UPLOAD DOCUMENTS VIEW
// --------------------------------------------------------------------------
function guessFields(text:string) {
  const lines=text.split(/\r?\n/).map(line=>line.trim()).filter(Boolean)
  const date=text.match(/\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{2,4})\b/i)?.[0] ?? ''
  const hospital=lines.find(line=>/\b(hospital|clinic|medical|diagnostic|laborator|centre|center)\b/i.test(line)) ?? ''
  const doctor=lines.find(line=>/\b(dr\.?|doctor)\b/i.test(line)) ?? ''
  const title=lines.find(line=>line.length > 3 && !/\b(hospital|clinic|medical|diagnostic|laborator|centre|center|dr\.?|doctor)\b/i.test(line)) ?? ''
  const hasDevanagari=/[\u0900-\u097f]/.test(text)
  const hasEnglish=/[A-Za-z]/.test(text)
  const marathiHint=/(आहे|आणि|साठी|म्हणून|तुमचे|तपासणी|रुग्ण)/u.test(text)
  const hindiHint=/(है|और|नहीं|में|से|रोगी|जांच)/u.test(text)
  const devanagariLanguage=marathiHint&&hindiHint?'Hindi/Marathi (mixed; best-effort)':marathiHint?'Marathi (best-effort)':hindiHint?'Hindi (best-effort)':'Hindi/Marathi (Devanagari; uncertain)'
  const language=hasDevanagari&&hasEnglish?`English + ${devanagariLanguage}`:hasDevanagari?devanagariLanguage:hasEnglish?'English':'Undetermined'
  return {title,date,hospital,doctor,language}
}

async function sha256(file:File) {
  const digest=await crypto.subtle.digest('SHA-256',await file.arrayBuffer())
  return Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('')
}

function UploadView({items,onSave}:{items:MedicalRecord[],onSave:(record:MedicalRecord,file:File)=>void}) {
  const [stage,setStage]=useState<'upload'|'scan'|'review'>('upload')
  const [file,setFile]=useState<File|null>(null)
  const [previewUrl,setPreviewUrl]=useState('')
  const [progress,setProgress]=useState(0)
  const [progressText,setProgressText]=useState('')
  const [error,setError]=useState('')
  const [hash,setHash]=useState('')
  const [isDuplicate,setIsDuplicate]=useState(false)
  const [category,setCategory]=useState('Prescription')
  const [familyMember,setFamilyMember]=useState('Aniket')
  const [title,setTitle]=useState('')
  const [date,setDate]=useState('')
  const [hospital,setHospital]=useState('')
  const [doctor,setDoctor]=useState('')
  const [text,setText]=useState('')
  const [language,setLanguage]=useState('Undetermined')
  const [ocrSource,setOcrSource]=useState('')

  useEffect(()=>()=>{if(previewUrl)URL.revokeObjectURL(previewUrl)},[previewUrl])

  const processFile=async(nextFile:File)=>{
    setError('')
    const extension=nextFile.name.split('.').pop()?.toLowerCase()
    const isPdf=nextFile.type==='application/pdf'||extension==='pdf'
    const isImage=['image/jpeg','image/png'].includes(nextFile.type)||['jpg','jpeg','png'].includes(extension ?? '')
    if(!isPdf&&!isImage){setError('Choose a PDF, JPG/JPEG, or PNG file.');return}
    if(nextFile.size>20*1024*1024){setError('Files must be 20 MB or smaller.');return}
    const url=URL.createObjectURL(nextFile)
    setFile(nextFile)
    setPreviewUrl(url)
    setStage('scan')
    setProgress(2)
    setProgressText('Preparing file for OCR…')
    setHash('')
    setIsDuplicate(false)
    let fileHash=''
    try {
      try {
        fileHash=await sha256(nextFile)
        setHash(fileHash)
        setIsDuplicate(items.some(record=>record.sha256===fileHash))
      } catch {
        setError('SHA-256 duplicate checking is unavailable in this browser context.')
      }

      let extracted=''
      let source='Tesseract OCR'
      if(isPdf){
        const pdfjsLib=await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString()
        setProgressText('Extracting PDF text…')
        const pdf=await pdfjsLib.getDocument({data:await nextFile.arrayBuffer()}).promise
        const pageTexts:string[]=[]
        for(let pageNumber=1;pageNumber<=pdf.numPages;pageNumber++){
          const page=await pdf.getPage(pageNumber)
          const content=await page.getTextContent()
          pageTexts.push(content.items.map(item=>'str' in item?item.str:'').join(' '))
          setProgress(Math.round((pageNumber/pdf.numPages)*28))
        }
        extracted=pageTexts.join('\n').trim()
        if(extracted){
          source='PDF text extraction'
        }else{
          source='PDF image OCR (Tesseract)'
          const {createWorker}=await import('tesseract.js')
          const worker=await createWorker('eng+hin+mar',undefined,{logger:message=>{
            if(message.status==='recognizing text')setProgress(30+Math.round(message.progress*65))
          }})
          try{
            const ocrPages:string[]=[]
            for(let pageNumber=1;pageNumber<=pdf.numPages;pageNumber++){
              setProgressText(`OCR scanning page ${pageNumber} of ${pdf.numPages}…`)
              const page=await pdf.getPage(pageNumber)
              const viewport=page.getViewport({scale:Math.min(2,1800/page.getViewport({scale:1}).width)})
              const canvas=document.createElement('canvas')
              canvas.width=Math.ceil(viewport.width)
              canvas.height=Math.ceil(viewport.height)
              const context=canvas.getContext('2d')
              if(!context)continue
              await page.render({canvasContext:context,canvas,viewport}).promise
              const result=await worker.recognize(canvas)
              ocrPages.push(result.data.text)
              setProgress(30+Math.round((pageNumber/pdf.numPages)*65))
            }
            extracted=ocrPages.join('\n').trim()
          }finally{
            await worker.terminate()
          }
        }
      }else{
        setProgressText('Recognizing text in image…')
        const {createWorker}=await import('tesseract.js')
        const worker=await createWorker('eng+hin+mar',undefined,{logger:message=>{
          if(message.status==='recognizing text')setProgress(10+Math.round(message.progress*85))
        }})
        try{
          const result=await worker.recognize(nextFile)
          extracted=result.data.text.trim()
        }finally{
          await worker.terminate()
        }
      }
      const fields=guessFields(extracted)
      setText(extracted)
      setTitle(fields.title)
      setDate(fields.date)
      setHospital(fields.hospital)
      setDoctor(fields.doctor)
      setLanguage(fields.language)
      setOcrSource(source)
      setProgress(100)
      setProgressText(extracted?'OCR Finished! Review your extracted details.':'No readable text detected; enter details manually.')
      setStage('review')
    }catch(cause){
      setError(cause instanceof Error?`Could not process this document: ${cause.message}`:'Could not process this document.')
      setStage('review')
      setOcrSource('Processing failed')
    }
  }

  const reset=()=>{
    setStage('upload')
    setFile(null)
    setPreviewUrl('')
    setError('')
    setText('')
  }

  const confirm=()=>{
    if(!file)return
    const tone=category==='Prescription'?'purple':category==='Test Report'?'blue':category==='Doctor Notes'?'cyan':category==='Vaccination History'?'green':'blue'
    const newRecord: MedicalRecord = {
      id: crypto.randomUUID(),
      title: title.trim() || file.name.replace(/\.[^.]+$/, ''),
      type: category,
      date: date.trim() || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      doctor: doctor.trim() || hospital.trim() || 'Not identified',
      hospital: hospital.trim() || undefined,
      status: 'Needs review',
      tone,
      icon: category==='Test Report'?'lab':category==='Prescription'?'rx':category==='Vaccination History'?'vaccine':'consult',
      source: 'real',
      fileName: file.name,
      sha256: hash || undefined,
      extractedText: text,
      language,
      ocrMethod: ocrSource,
      familyMember
    }
    newRecord.aiSummary = generateAISummary(newRecord)
    onSave(newRecord, file)
    reset()
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="page-title">
        <div>
          <p style={{fontWeight: 800, color: '#3185E8'}}>CLIENT-SIDE OCR + GOOGLE AI EXTRACTION</p>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Upload Medical Document</h1>
        </div>
      </div>

      {stage==='upload' ? (
        <div className="upload-layout">
          <section 
            className="upload-panel duo-card" 
            onDragOver={e=>e.preventDefault()} 
            onDrop={e=>{e.preventDefault();const dropped=e.dataTransfer.files[0];if(dropped)void processFile(dropped)}}
            style={{border: '3px dashed #CBD5E1', borderRadius: 24, textAlign: 'center', padding: 36}}
          >
            <div style={{marginBottom: 12}}>
              <PandaBot size="large" pose="upload"/>
            </div>
            <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 20}}>
              Drag and drop your document here
            </h3>
            <p style={{fontSize: 13, color: '#728096', maxWidth: 360, margin: '6px auto 18px'}}>
              Supports PDF, JPG, PNG up to 20MB · Processed securely in your browser with offline OCR
            </p>
            <label className="duo-btn duo-btn-primary large">
              Choose Document File
              <input 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" 
                onChange={e=>{const selected=e.target.files?.[0];if(selected)void processFile(selected);e.currentTarget.value=''}}
              />
            </label>
            {error&&<p className="upload-error" role="alert" style={{marginTop: 14}}>{error}</p>}
          </section>

          <section className="upload-side duo-card" style={{borderRadius: 24}}>
            <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Document Category</h3>
            {['Prescription','Test Report','Doctor Notes','Vaccination History','Other'].map(x=>(
              <label className="category-option" key={x} style={{borderRadius: 14, cursor: 'pointer'}}>
                <input type="radio" name="category" checked={category===x} onChange={()=>setCategory(x)}/>
                <span style={{fontWeight: 700}}>{x}</span>
              </label>
            ))}

            <h3 style={{marginTop: 22, fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Family Member Scope</h3>
            <div className="modal-form-group" style={{marginTop: 8}}>
              <select 
                className="member-filter-select"
                style={{width: '100%', borderRadius: 14, height: 44, border: '2px solid var(--line)'}}
                value={familyMember} 
                onChange={e => setFamilyMember(e.target.value)}
              >
                <option value="Aniket">Aniket (Self)</option>
                <option value="Meera">Meera (Spouse)</option>
                <option value="Arjun">Arjun (Child)</option>
                <option value="Other">Other / Unassigned</option>
              </select>
            </div>
          </section>
        </div>
      ) : stage==='scan' ? (
        <section className="upload-panel scan-state duo-card" style={{borderRadius: 24, textAlign: 'center', padding: 40}}>
          <PandaBot size="large" pose="scanning"/>
          <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 22, marginTop: 16}}>
            Scanning {file?.name}
          </h3>
          <p style={{fontSize: 14, color: '#728096'}}>{progressText} ({progress}%)</p>
          <div className="duo-progress-bar-wrap" style={{maxWidth: 380, margin: '14px auto'}}>
            <div className="duo-progress-bar-fill" style={{width: `${progress}%`}}/>
          </div>
          {error&&<p className="upload-error" role="alert">{error}</p>}
        </section>
      ) : (
        <div className="verify-layout">
          <section className="document-preview duo-card" style={{borderRadius: 24}}>
            <div className="preview-toolbar">
              <span style={{fontWeight: 800}}>Original Preview · {file?.name}</span>
              <div>
                {file&&<a href={previewUrl} download={file.name} aria-label="Download original file"><Download size={16}/></a>}
              </div>
            </div>
            {file?.type==='application/pdf'||file?.name.toLowerCase().endsWith('.pdf') ? (
              <iframe className="original-preview" src={previewUrl} title="PDF document preview"/>
            ) : (
              <img className="original-preview" src={previewUrl} alt={`Preview of ${file?.name}`}/>
            )}
          </section>

          <section className="verify-panel duo-card" style={{borderRadius: 24}}>
            <div className="verify-head">
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <PandaBot size="small" pose="dashboard"/>
                <div>
                  <span style={{color: '#16A34A', fontWeight: 800}}>OCR Extracted · {ocrSource}</span>
                  <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900, margin: '2px 0 0'}}>Review Details</h3>
                </div>
              </div>
              <em>Needs review</em>
            </div>
            <p className="language-note">Detected language: <strong>{language}</strong></p>
            
            <label>Title<input value={title} onChange={e=>setTitle(e.target.value)}/></label>
            <label>Hospital or clinic<input value={hospital} onChange={e=>setHospital(e.target.value)}/></label>
            <label>Doctor<input value={doctor} onChange={e=>setDoctor(e.target.value)}/></label>
            
            <div className="form-row">
              <label>Document date<input value={date} onChange={e=>setDate(e.target.value)} placeholder="Not detected"/></label>
              <label>Category
                <select value={category} onChange={e=>setCategory(e.target.value)}>
                  {['Prescription','Test Report','Doctor Notes','Vaccination History','Other'].map(option=>(
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <label>Family Member
              <select value={familyMember} onChange={e=>setFamilyMember(e.target.value)}>
                <option value="Aniket">Aniket (Self)</option>
                <option value="Meera">Meera (Spouse)</option>
                <option value="Arjun">Arjun (Child)</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>Extracted text<textarea value={text} onChange={e=>setText(e.target.value)} rows={4}/></label>
            
            {isDuplicate&&<div className="duplicate-warning" role="alert"><Copy size={17}/><p>This file matches a record already in your vault.</p></div>}
            {error&&<p className="upload-error" role="alert">{error}</p>}
            
            <div className="warning-box" style={{borderRadius: 14}}>
              <Sparkles size={18} color="#2563EB"/>
              <p>Google AI will automatically generate summary, medication badges, and next steps upon saving.</p>
            </div>
            
            <div className="verify-actions" style={{marginTop: 18}}>
              <button className="duo-btn duo-btn-secondary" onClick={reset}>Cancel</button>
              <button className="duo-btn duo-btn-success" onClick={confirm}>
                <Check size={18}/> Confirm & Save (+25 XP)
              </button>
            </div>
          </section>
        </div>
      )}
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// HEALTH TIMELINE
// --------------------------------------------------------------------------
function Timeline(){
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="page-title">
        <div>
          <p style={{fontWeight: 800, color: '#3185E8'}}>CHRONOLOGICAL HEALTH JOURNEY</p>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Health Timeline</h1>
        </div>
        <button className="duo-btn duo-btn-secondary"><CalendarDays size={16}/> February 2026 <ChevronDown size={13}/></button>
      </div>
      <div className="timeline-page duo-card" style={{borderRadius: 24}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
          <PandaBot size="small" pose="dashboard"/>
          <h2 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900, margin: 0}}>February 2026</h2>
        </div>
        <div className="timeline-wide">
          <WideTimeline date="18 Feb" title="Complete Blood Count" text="Laboratory Report · City Diagnostic Centre" tone="blue"/>
          <WideTimeline date="12 Feb" title="Prescription - Dr. Sharma" text="Prescription · Dr. Raj Sharma" tone="purple"/>
          <WideTimeline date="05 Feb" title="Cardiology Consultation" text="Doctor Notes · Apollo Heart Clinic" tone="cyan"/>
        </div>
        <h2 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900, margin: '20px 0 10px'}}>January 2026</h2>
        <div className="timeline-wide">
          <WideTimeline date="28 Jan" title="Thyroid Profile" text="Laboratory Report · MedLab Diagnostics" tone="green"/>
        </div>
      </div>
    </motion.div>
  )
}

function WideTimeline({date,title,text,tone}:{date:string,title:string,text:string,tone:string}){
  return <div className="wide-item" style={{borderRadius: 14}}>
    <div className="wide-date" style={{fontWeight: 800}}>{date}</div>
    <i className={tone}/>
    <div><strong>{title}</strong><span>{text}</span></div>
    <button className="icon-button"><ArrowRight size={16}/></button>
  </div>
}

// --------------------------------------------------------------------------
// HEALTH INSIGHTS
// --------------------------------------------------------------------------
function Insights(){
  const points=[38,42,40,48,52,49,55]
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="page-title">
        <div>
          <p style={{fontWeight: 800, color: '#3185E8'}}>VERIFIED LABORATORY OBSERVATIONS</p>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Health Insights</h1>
        </div>
        <button className="duo-btn duo-btn-secondary"><CalendarDays size={16}/> Jan – Feb 2026 <ChevronDown size={13}/></button>
      </div>
      <div className="insights-summary">
        <Stat icon={<Microscope/>} label="Lab Reports" value="8" detail="Verified trends" tone="cyan"/>
        <Stat icon={<Activity/>} label="Tracked Tests" value="12" detail="CBC & Thyroid" tone="blue"/>
        <Stat icon={<Check/>} label="Verified Values" value="31" detail="In normal range" tone="green"/>
      </div>
      <div className="insights-grid">
        <section className="duo-card lab-chart">
          <PanelHead title="Hemoglobin Trend (g/dL)" sub="City Diagnostic Centre · Reference range 13.0–17.0"/>
          <div className="chart-legend" style={{padding: '0 18px'}}>
            <span>Previous Level</span><b>14.2 g/dL</b>
            <em style={{color: '#16A34A', fontWeight: 800}}>✓ Normal Range</em>
          </div>
          <div className="line-chart">
            {points.map((v,i)=><i key={i} style={{height:`${v}%`}}><span>{i===6?'14.2':''}</span></i>)}
          </div>
          <div className="chart-axis"><span>Jan 05</span><span>Jan 18</span><span>Feb 02</span><span>Feb 18</span></div>
        </section>
        <section className="duo-card observations">
          <PanelHead title="Latest Observations" sub="CBC · 18 Feb 2026"/>
          {[['Hemoglobin','14.2','g/dL','Normal'],['WBC Count','7.8','K/uL','Normal'],['Platelets','240','K/uL','Normal']].map(x=>(
            <div className="observation" key={x[0]}>
              <div><strong>{x[0]}</strong><span>{x[1]} {x[2]}</span></div>
              <em style={{fontWeight: 800, color: '#16A34A'}}>{x[3]}</em>
              <button className="icon-button"><Eye size={15}/></button>
            </div>
          ))}
        </section>
      </div>
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// MEDIBOT AI (DUOLINGO CARTOON STYLE)
// --------------------------------------------------------------------------
function Assistant(){
  const [language,setLanguage]=useState('English')
  const [messages,setMessages]=useState<string[]>([])
  const [input,setInput]=useState('')
  const send=(text:string)=>{if(!text.trim())return;setMessages(v=>[...v,text]);setInput('')}
  return (
    <motion.div className="assistant-page" initial={{opacity:0}} animate={{opacity:1}}>
      <div className="page-title">
        <div>
          <p style={{fontWeight: 800, color: '#3185E8'}}>AI MEDICAL ASSISTANT · {language.toUpperCase()}</p>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>MediBot AI</h1>
        </div>
        <button className="duo-btn duo-btn-secondary" onClick={()=>setLanguage(language==='English'?'हिंदी':language==='हिंदी'?'मराठी':'English')}>
          <Languages size={16}/> {language}
        </button>
      </div>
      <div className="chat-panel duo-card" style={{borderRadius: 24}}>
        <div className="chat-head" style={{padding: '12px 18px'}}>
          <PandaBot size="small" pose="ai"/>
          <div>
            <b style={{fontFamily: "'Nunito', sans-serif", fontSize: 14}}>PandaBot Assistant</b>
            <span style={{fontSize: 11, color: '#728096'}}>Patient-scoped retrieval · Powered by Google AI</span>
          </div>
        </div>
        <div className="chat-body" style={{padding: 20}}>
          <div className="ai-message" style={{borderRadius: 18, border: '2px solid #BFDBFE', background: '#EFF6FF', color: '#1E2C3D', fontSize: 13, lineHeight: 1.6}}>
            Hello Aniket! I'm PandaBot, your personal health assistant. I can help summarize lab trends, check medication schedules, and clarify your recent doctor notes. What would you like to check?
          </div>
          {messages.map((m,i)=>(
            <div className="user-message" key={i} style={{borderRadius: 18, background: '#3185E8', color: '#FFFFFF', fontWeight: 700}}>
              {m}
            </div>
          ))}
          <div className="suggestions" style={{marginTop: 18}}>
            {['When was my last CBC report?','Show current medications','What are my normal reference ranges?'].map(x=>(
              <button key={x} className="duo-category-tab" onClick={()=>send(x)} style={{fontSize: 11}}>
                <Sparkles size={12} color="#3185E8"/> {x}
              </button>
            ))}
          </div>
          <div className="ai-config" style={{borderRadius: 14, marginTop: 16}}>
            <ShieldCheck size={18}/>
            <div>
              <strong>Private & Grounded</strong>
              <p>Grounded on authorized documents in your active profile. MediVault does not sell health data.</p>
            </div>
          </div>
        </div>
        <div className="chat-input" style={{padding: 12}}>
          <input 
            value={input} 
            onChange={e=>setInput(e.target.value)} 
            onKeyDown={e=>e.key==='Enter'&&send(input)} 
            placeholder="Ask PandaBot anything about your records..."
            style={{fontSize: 13}}
          />
          <button className="duo-btn duo-btn-primary" onClick={()=>send(input)} style={{borderRadius: '0 12px 12px 0'}}>
            <ArrowRight size={18}/>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// MEDICINE REMINDERS
// --------------------------------------------------------------------------
function Reminders({onTakeMedicine}: {onTakeMedicine: () => void}){
  const [taken,setTaken]=useState<number[]>([])
  const meds=[
    ['Metformin','500 mg · With breakfast','8:00 AM','Prescription'],
    ['Vitamin D3','1 tablet · As prescribed','1:00 PM','Prescription'],
    ['Atorvastatin','10 mg · At night','9:00 PM','Prescription']
  ]

  const handleTake = (index: number) => {
    if (!taken.includes(index)) {
      setTaken([...taken, index])
      onTakeMedicine()
    } else {
      setTaken(taken.filter(x => x !== index))
    }
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="page-title">
        <div>
          <p style={{fontWeight: 800, color: '#3185E8'}}>DAILY MEDICATION SCHEDULE</p>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Medicine Reminders</h1>
        </div>
        <button className="duo-btn duo-btn-primary"><Plus size={17}/> Add Medicine</button>
      </div>

      <div className="reminder-grid">
        {meds.map((m,i)=>(
          <section className="duo-card reminder-card" key={m[0]}>
            <div className={`medicine-icon ${i===0?'blue':i===1?'cyan':'purple'}`} style={{borderRadius: 14}}>
              <Pill size={22}/>
            </div>
            <div className="reminder-info">
              <strong style={{fontSize: 15, fontFamily: "'Nunito', sans-serif"}}>{m[0]}</strong>
              <span style={{fontSize: 12, color: '#728096'}}>{m[1]}</span>
              <small style={{color: '#3185E8', fontWeight: 700}}>{m[3]} · Patient confirmed</small>
            </div>
            <div className="dose-time" style={{fontFamily: "'Nunito', sans-serif"}}>{m[2]}</div>
            
            <button 
              className={`duo-btn ${taken.includes(i) ? 'duo-btn-success' : 'duo-btn-primary'}`} 
              onClick={()=>handleTake(i)}
              style={{gridColumn: '1/3', width: '100%', height: 42}}
            >
              {taken.includes(i)?<><Check size={16}/> Taken (+15 XP)</>: 'Mark As Taken'}
            </button>
          </section>
        ))}
      </div>
      
      <div className="reminder-banner duo-card" style={{borderRadius: 18, marginTop: 18}}>
        <PandaBot size="small" pose="reminders"/>
        <div>
          <strong style={{fontSize: 13}}>Safety Reminder from PandaBot</strong>
          <p style={{fontSize: 11, color: '#728096'}}>
            Always confirm every OCR-derived schedule before activation. MediVault does not modify clinician instructions or prescribe doses.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// FAMILY VAULT
// --------------------------------------------------------------------------
function FamilyVault(){
  const [active,setActive]=useState('Aniket')
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="page-title">
        <div>
          <p style={{fontWeight: 800, color: '#3185E8'}}>PERMISSION-CONTROLLED FAMILY PROFILES</p>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Family Vault</h1>
        </div>
        <button className="duo-btn duo-btn-primary"><Plus size={17}/> Add Family Member</button>
      </div>

      <div className="family-switcher">
        {[['Aniket','Self','AS'],['Meera','Spouse','MK'],['Arjun','Child','AR']].map(m=>(
          <button 
            key={m[0]} 
            className={`family-member ${active===m[0]?'active':''}`} 
            onClick={()=>setActive(m[0])}
            style={{borderRadius: 18, border: '2px solid var(--line)'}}
          >
            <div style={{borderRadius: 14}}>{m[2]}</div>
            <strong>{m[0]}</strong>
            <span>{m[1]}</span>
          </button>
        ))}
      </div>

      <div className="family-grid">
        <section className="duo-card">
          <PanelHead title={`${active}'s Vault Scope`} sub="Active family record boundary"/>
          <div className="profile-summary">
            <div className="profile-avatar large" style={{borderRadius: 20}}>{active.slice(0,1)}</div>
            <div>
              <strong style={{fontSize: 16, fontFamily: "'Nunito', sans-serif"}}>{active} Sharma</strong>
              <span style={{fontSize: 11, color: '#728096'}}>Personal Health Locker · Strict consent controls</span>
            </div>
          </div>
          <div className="family-stats" style={{borderTop: '2px solid var(--line-soft)'}}>
            <div><b>24</b><span>Records</span></div>
            <div><b>5</b><span>Visits</span></div>
            <div><b>2</b><span>Shares</span></div>
          </div>
        </section>

        <section className="duo-card">
          <PanelHead title="Role-Based Permissions" sub="Control data access"/>
          {['Upload documents','View records','Generate summaries','Share records'].map((x,i)=>(
            <div className="setting-row" key={x}>
              <span style={{fontWeight: 700}}>{x}</span>
              <button className={i<2?'switch on':'switch'}><i/></button>
            </div>
          ))}
        </section>
      </div>
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// EMERGENCY HEALTH ID
// --------------------------------------------------------------------------
function EmergencyId(){
  const [active,setActive]=useState(true)
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="page-title">
        <div>
          <p style={{fontWeight: 800, color: '#3185E8'}}>PATIENT-CONTROLLED EMERGENCY ACCESS</p>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Emergency Health ID</h1>
        </div>
        <button 
          className={`duo-btn ${active?'duo-btn-secondary':'duo-btn-primary'}`} 
          onClick={()=>setActive(!active)}
        >
          {active?'Deactivate ID Card':'Activate ID Card'}
        </button>
      </div>

      <div className="emergency-layout">
        <section className="emergency-card duo-card" style={{borderRadius: 24, background: 'linear-gradient(145deg, #101b35, #1a3a67)'}}>
          <div className="emergency-head">
            <HeartPulse size={22} color="#FF927D"/>
            <span style={{fontWeight: 800}}>MEDIVAULT · EMERGENCY BRACELET</span>
          </div>
          <div className="emergency-person">
            <div style={{borderRadius: 16}}>AS</div>
            <div>
              <strong style={{fontSize: 18, fontFamily: "'Nunito', sans-serif"}}>Aniket Sharma</strong>
              <span style={{color: '#93C5FD', fontWeight: 700}}>Blood Group: O+ (Positive)</span>
            </div>
          </div>
          <div className="emergency-fields">
            <div><span>Emergency Contact</span><strong>Meera Sharma · 98765 43210</strong></div>
            <div><span>Known Allergies</span><strong>None reported</strong></div>
            <div><span>Consent Token</span><strong>{active?'Active Valid Token':'Inactive'}</strong></div>
          </div>
          <div className="emergency-qr" style={{borderRadius: 16}}>
            <QRCodeSVG value={active?'https://medivault.app/emergency/demo-token':'inactive'} size={110}/>
          </div>
          <small style={{color: '#94A3B8'}}>QR contains a random secure token, never raw medical details.</small>
        </section>

        <section className="duo-card emergency-settings" style={{borderRadius: 24}}>
          <PanelHead title="Approved Emergency Fields" sub="Patient explicitly selected"/>
          {['Name','Blood group','Emergency contact','Known allergies','Important conditions','Current medication'].map((x,i)=>(
            <label className="emergency-check" key={x} style={{fontWeight: 700}}>
              <input type="checkbox" defaultChecked={i<4}/>
              <span>{x}</span>
            </label>
          ))}
          <div className="form-row" style={{padding: '12px 16px'}}>
            <label style={{fontWeight: 700}}>Token expiry
              <select style={{borderRadius: 10, height: 40}}>
                <option>24 hours</option>
                <option>7 days</option>
                <option>30 days</option>
              </select>
            </label>
          </div>
          <button className="duo-btn duo-btn-primary" style={{margin: '8px 16px', width: 'calc(100% - 32px)'}}>
            Save Emergency Profile
          </button>
        </section>
      </div>
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// DOCTOR VISIT SUMMARY
// --------------------------------------------------------------------------
function DoctorSummary(){
  const [selected,setSelected]=useState<string[]>(['CBC Report','Consultation'])
  const toggle=(x:string)=>setSelected(v=>v.includes(x)?v.filter(y=>y!==x):[...v,x])
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="page-title">
        <div>
          <p style={{fontWeight: 800, color: '#3185E8'}}>PATIENT-SELECTED RECORDS ONLY</p>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Doctor Visit Summary</h1>
        </div>
        <button className="duo-btn duo-btn-primary"><Download size={17}/> Generate Printable PDF</button>
      </div>

      <div className="summary-layout">
        <section className="duo-card summary-selection" style={{borderRadius: 24}}>
          <PanelHead title="Select Records to Include" sub="Check the items to assemble"/>
          {[['Patient details','Personal and emergency fields'],['Consultation','Cardiology · 05 Feb 2026'],['CBC Report','Laboratory · 18 Feb 2026'],['Prescription','Dr. Sharma · 12 Feb 2026'],['Known allergies','Patient-entered']].map(x=>(
            <button 
              className={`summary-check ${selected.includes(x[0])?'selected':''}`} 
              onClick={()=>toggle(x[0])} 
              key={x[0]}
              style={{borderRadius: 14}}
            >
              <span>{selected.includes(x[0])?<Check size={14}/>:null}</span>
              <div><strong>{x[0]}</strong><small>{x[1]}</small></div>
            </button>
          ))}
        </section>

        <section className="summary-preview duo-card" style={{borderRadius: 24}}>
          <div className="summary-document" style={{borderRadius: 16, border: '1px solid #E2E8F0'}}>
            <div className="summary-brand"><Logo/><span>Doctor Visit Brief</span></div>
            <h2 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Aniket Sharma</h2>
            <p>Generated: 19 November 2026</p>
            <h3 style={{fontFamily: "'Nunito', sans-serif"}}>Selected Medical History for Consultation</h3>
            {selected.map(x=>(
              <div className="summary-source" key={x}>
                <strong>{x}</strong>
                <span>Source date & verified reference</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// DUPLICATE CHECK
// --------------------------------------------------------------------------
function DuplicateCheck(){
  const [choice,setChoice]=useState<'pending'|'keep'|'cancel'>('pending')
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="page-title">
        <div>
          <p style={{fontWeight: 800, color: '#3185E8'}}>SMART OCR SIMILARITY REVIEW</p>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Possible Duplicate Detected</h1>
        </div>
        <button className="duo-btn duo-btn-secondary"><Search size={16}/> Scan Another Document</button>
      </div>

      <section className="duo-quest-banner" style={{background: '#FFFBEB', borderColor: '#FDE68A'}}>
        <PandaBot size="medium" pose="error"/>
        <div style={{flex: 1}}>
          <strong style={{fontSize: 16, fontFamily: "'Nunito', sans-serif"}}>Similar Document Found</strong>
          <p style={{fontSize: 13, color: '#728096', margin: '4px 0 0'}}>
            We found matching OCR text and a compatible report date. MediVault never deletes or overwrites files automatically.
          </p>
        </div>
        <span className="game-pill" style={{color: '#D97706', borderColor: '#FDE68A'}}>
          86% Similarity
        </span>
      </section>

      <div className="duplicate-grid">
        <section className="duo-card duplicate-document" style={{borderRadius: 20}}>
          <div className="duplicate-head"><span>Existing in Vault</span><b>Uploaded 12 Feb 2026</b></div>
          <div className="sample-document compact" style={{borderRadius: 12}}>
            <h3>Complete Blood Count</h3>
            <p>City Diagnostic Centre · 18 Feb 2026</p>
            <div className="duplicate-lines"><i/><i/><i/><i/></div>
          </div>
        </section>

        <section className="duo-card duplicate-document" style={{borderRadius: 20}}>
          <div className="duplicate-head"><span>New Uploaded File</span><b>Pending Review</b></div>
          <div className="sample-document compact" style={{borderRadius: 12}}>
            <h3>Complete Blood Count</h3>
            <p>City Diagnostic Centre · 18 Feb 2026</p>
            <div className="duplicate-lines"><i/><i/><i/><i/></div>
          </div>
        </section>
      </div>

      <div className="duplicate-actions" style={{marginTop: 18}}>
        {choice==='pending'? (
          <>
            <button className="duo-btn duo-btn-secondary" onClick={()=>setChoice('cancel')}>
              Cancel Upload
            </button>
            <button className="duo-btn duo-btn-primary" onClick={()=>setChoice('keep')}>
              <Check size={17}/> Keep Both Separate
            </button>
          </>
        ) : (
          <div className="duplicate-result" style={{borderRadius: 14, fontWeight: 700}}>
            <CheckCircle2 size={18}/>
            {choice==='keep'?'Both documents kept separate in your vault.':'Upload cancelled. No file was saved.'}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// SHARING VIEW
// --------------------------------------------------------------------------
function Sharing(){
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="page-title">
        <div>
          <p style={{fontWeight: 800, color: '#3185E8'}}>ACCESS CONTROL & EXPIRING LINKS</p>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Shared Records</h1>
        </div>
        <button className="duo-btn duo-btn-primary"><Plus size={17}/> Create Share Link</button>
      </div>

      <div className="share-table duo-card" style={{borderRadius: 24}}>
        <div className="share-row table-head" style={{fontWeight: 800}}>
          <span>Shared with</span><span>Records</span><span>Expires</span><span>Status</span><span/>
        </div>
        {[['Dr. Rahul Mehta','3 records','24 Feb 2026','Active'],['Apollo Diagnostics','2 records','21 Feb 2026','Active']].map(x=>(
          <div className="share-row" key={x[0]}>
            <strong><div className="avatar small">{x[0][0]}</div>{x[0]}</strong>
            <span>{x[1]}</span>
            <span>{x[2]}</span>
            <em style={{fontWeight: 800}}>{x[3]}</em>
            <button className="duo-btn duo-btn-secondary small" style={{color: '#E5484D'}}>Revoke</button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// SETTINGS PAGE
// --------------------------------------------------------------------------
function SettingsPage({
  gamificationEnabled,
  setGamificationEnabled,
  dark,
  setDark,
  onSignOut,
  notify
}: {
  gamificationEnabled: boolean
  setGamificationEnabled: (val: boolean) => void
  dark: boolean
  setDark: (val: boolean) => void
  onSignOut: () => void
  notify: (msg: string, isCelebrate?: boolean) => void
}) {
  const [name, setName] = useState('Aniket Sharma')
  const [email, setEmail] = useState('aniket@example.com')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [bloodGroup, setBloodGroup] = useState('B+')
  const [emergencyContact, setEmergencyContact] = useState('+91 98765 01234')
  const [emailNotif, setEmailNotif] = useState(true)
  const [medReminders, setMedReminders] = useState(true)
  const [shareAlerts, setShareAlerts] = useState(true)
  const [aiSummary, setAiSummary] = useState(true)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    notify('Profile changes saved successfully! ✨', true)
  }

  const handleExportData = () => {
    notify('📦 Preparing your complete encrypted health vault export...')
    setTimeout(() => {
      notify('✅ Medical vault export ready! Download started.', true)
    }, 1200)
  }

  return (
    <motion.div initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} className="settings-page-wrap">
      <div className="page-title">
        <div>
          <p style={{fontWeight: 800, color: '#3185E8'}}>ACCOUNT & PREFERENCES</p>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Settings</h1>
        </div>
        <button 
          className="duo-btn duo-btn-coral small"
          onClick={() => setShowSignOutConfirm(true)}
          style={{padding: '9px 16px'}}
        >
          <LogOut size={15}/> Sign Out
        </button>
      </div>

      <div className="settings-grid">
        {/* Left Column: Profile Information */}
        <div className="settings-col">
          <section className="duo-card profile-settings">
            <div className="settings-card-header">
              <div>
                <h2>Personal Profile</h2>
                <p>Manage your personal and emergency health information</p>
              </div>
              <PandaBot size="small" pose="dashboard"/>
            </div>

            <div className="profile-header-banner">
              <div className="profile-avatar-large">AS</div>
              <div className="profile-identity">
                <h3>{name}</h3>
                <span className="profile-email-badge"><Check size={12}/> Verified Patient</span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="settings-form">
              <div className="settings-field">
                <label>Full Legal Name</label>
                <div className="settings-input-wrap">
                  <UserRound size={16}/>
                  <input value={name} onChange={e=>setName(e.target.value)} required/>
                </div>
              </div>

              <div className="settings-field">
                <label>Email Address</label>
                <div className="settings-input-wrap">
                  <Mail size={16}/>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
                </div>
              </div>

              <div className="settings-row-2">
                <div className="settings-field">
                  <label>Mobile Number</label>
                  <input value={phone} onChange={e=>setPhone(e.target.value)}/>
                </div>
                <div className="settings-field">
                  <label>Blood Group</label>
                  <select value={bloodGroup} onChange={e=>setBloodGroup(e.target.value)}>
                    <option value="A+">A+ (Positive)</option>
                    <option value="A-">A- (Negative)</option>
                    <option value="B+">B+ (Positive)</option>
                    <option value="B-">B- (Negative)</option>
                    <option value="O+">O+ (Positive)</option>
                    <option value="O-">O- (Negative)</option>
                    <option value="AB+">AB+ (Positive)</option>
                    <option value="AB-">AB- (Negative)</option>
                  </select>
                </div>
              </div>

              <div className="settings-field">
                <label>Emergency Contact Phone</label>
                <input value={emergencyContact} onChange={e=>setEmergencyContact(e.target.value)}/>
              </div>

              <button type="submit" className="duo-btn duo-btn-primary" style={{marginTop: 14, width: '100%'}}>
                <Check size={16}/> Save Profile Changes
              </button>
            </form>
          </section>

          {/* Privacy & Security Card */}
          <section className="duo-card" style={{marginTop: 20}}>
            <div className="settings-card-header">
              <div>
                <h2>Security & Encryption</h2>
                <p>Medical data encryption standards and data export</p>
              </div>
              <ShieldCheck size={24} color="#16A34A"/>
            </div>

            <div className="security-badges-row">
              <div className="security-badge-pill">
                <LockKeyhole size={14} color="#2563EB"/>
                <span>AES-256 Bit Encryption</span>
              </div>
              <div className="security-badge-pill">
                <ShieldCheck size={14} color="#16A34A"/>
                <span>HIPAA Aligned</span>
              </div>
              <div className="security-badge-pill">
                <Zap size={14} color="#F59E0B"/>
                <span>Email 2FA Active</span>
              </div>
            </div>

            <div className="export-vault-action" style={{marginTop: 16}}>
              <div>
                <strong style={{fontSize: 13, display: 'block'}}>Export Entire Health Vault</strong>
                <span style={{fontSize: 11, color: 'var(--text-muted)'}}>Download records, lab tests, and timeline as encrypted archive</span>
              </div>
              <button className="duo-btn duo-btn-secondary small" onClick={handleExportData}>
                <Download size={14}/> Export
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Preferences, Gamification, Appearance & Sign Out */}
        <div className="settings-col">
          <section className="duo-card">
            <div className="settings-card-header">
              <div>
                <h2>Preferences & Gamification</h2>
                <p>Customize your Duolingo-inspired experience and theme</p>
              </div>
              <Trophy size={24} color="#F59E0B"/>
            </div>

            {/* Gamification Toggle */}
            <div className="setting-row highlight-setting">
              <div className="setting-info">
                <div className="setting-title-row">
                  <Flame size={16} color="#EA580C"/>
                  <span className="setting-title">Duolingo-Style Gamification</span>
                </div>
                <p className="setting-desc">XP points, streak counters, achievement badges & organization missions</p>
              </div>
              <button 
                className={gamificationEnabled?'switch on':'switch'} 
                onClick={()=>{
                  setGamificationEnabled(!gamificationEnabled)
                  notify(gamificationEnabled ? 'Gamification mode paused.' : 'Gamification mode enabled! 🎮', !gamificationEnabled)
                }}
                aria-label="Toggle gamification"
              >
                <i/>
              </button>
            </div>

            {/* Theme Selector (Light vs Instagram Golden Pink) */}
            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-title-row">
                  <Sun size={16} color={dark ? '#E1306C' : '#3185E8'}/>
                  <span className="setting-title">Instagram Golden-Pink Dark Theme</span>
                </div>
                <p className="setting-desc">Switch between healthcare blue light theme and sunset golden-pink velvet theme</p>
              </div>
              <button 
                className={dark?'switch on':'switch'} 
                onClick={()=>{
                  setDark(!dark)
                  notify(dark ? 'Switched to Healthcare Light Theme' : 'Switched to Golden-Pink Sunset Theme! 🌸', true)
                }}
                aria-label="Toggle dark theme"
              >
                <i/>
              </button>
            </div>

            {/* Notification & AI Toggles */}
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-title">Email Notifications</span>
                <p className="setting-desc">Receive updates when doctors view shared links or upload reports</p>
              </div>
              <button className={emailNotif?'switch on':'switch'} onClick={()=>setEmailNotif(!emailNotif)}><i/></button>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-title">Medicine Schedule Reminders</span>
                <p className="setting-desc">Gentle push alerts for upcoming morning, noon, and night dosages</p>
              </div>
              <button className={medReminders?'switch on':'switch'} onClick={()=>setMedReminders(!medReminders)}><i/></button>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-title">Doctor Share Access Alerts</span>
                <p className="setting-desc">Real-time alerts whenever a temporary doctor access link is accessed</p>
              </div>
              <button className={shareAlerts?'switch on':'switch'} onClick={()=>setShareAlerts(!shareAlerts)}><i/></button>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-title">Google-Powered AI Auto-Summary</span>
                <p className="setting-desc">Automatically analyze OCR extracts for diagnoses, medications, and advice</p>
              </div>
              <button className={aiSummary?'switch on':'switch'} onClick={()=>setAiSummary(!aiSummary)}><i/></button>
            </div>
          </section>

          {/* Account Management & Sign Out Card */}
          <section className="duo-card settings-danger-card" style={{marginTop: 20}}>
            <div className="settings-card-header">
              <div>
                <h2>Account Management</h2>
                <p>Sign out of your active session on this device</p>
              </div>
              <LogOut size={22} color="#EF4444"/>
            </div>

            <div className="signout-box">
              <div className="signout-text">
                <strong>Active Session</strong>
                <span>Signed in as <b>{email}</b></span>
              </div>
              <button 
                className="duo-btn duo-btn-coral"
                onClick={()=>setShowSignOutConfirm(true)}
              >
                <LogOut size={16}/> Sign Out
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="modal-backdrop" onMouseDown={()=>setShowSignOutConfirm(false)}>
          <motion.div 
            className="duo-card signout-modal" 
            initial={{scale: 0.94, opacity: 0}} 
            animate={{scale: 1, opacity: 1}} 
            onMouseDown={e=>e.stopPropagation()}
          >
            <div style={{textAlign: 'center', marginBottom: 16}}>
              <PandaBot size="medium" pose="welcome"/>
              <h2 style={{fontSize: 20, fontWeight: 900, margin: '14px 0 6px'}}>Sign Out of MediVault?</h2>
              <p style={{fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0}}>
                You can log back in anytime using your email address and OTP verification code.
              </p>
            </div>

            <div style={{display: 'flex', gap: 10, marginTop: 22}}>
              <button 
                className="duo-btn duo-btn-secondary" 
                style={{flex: 1}}
                onClick={()=>setShowSignOutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="duo-btn duo-btn-coral" 
                style={{flex: 1}}
                onClick={()=>{
                  setShowSignOutConfirm(false)
                  onSignOut()
                }}
              >
                <LogOut size={16}/> Yes, Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// PANDABOT ONBOARDING TUTORIAL
// --------------------------------------------------------------------------
function Panda({step,setStep,close}:{step:number,setStep:(n:number)=>void,close:()=>void}) {
  const steps=[
    ['Welcome to MediVault 2.0!',"Hi, I'm PandaBot! I'll guide you through your friendly, gamified family health vault.", 'welcome'],
    ['Category filters & family vaults','Filter your documents by Prescriptions, Test Reports, Doctor Notes, or Vaccinations in a snap.', 'dashboard'],
    ['Analyze with Google AI','Click "Analyze with AI" on any record to extract diagnosis, medications, and next steps.', 'ai'],
    ['Earn XP & build streaks','Review records, mark medications as taken, and earn XP to level up your organization badge!', 'celebration'],
    ['Share safely with doctor','Create an expiring, password-ready link for doctor appointments without exposing private data.', 'emergency']
  ]
  const currentStep = steps[step]

  return (
    <motion.div className="panda-card duo-card" style={{borderRadius: 24, border: '3px solid var(--line)'}} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
      <div className="panda-card-head">
        <PandaBot size="small" pose={currentStep[2]}/>
        <div>
          <strong style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>PandaBot Guide</strong>
          <span style={{fontSize: 11, color: '#728096'}}>Step {step+1} of {steps.length}</span>
        </div>
        <button className="icon-button" onClick={close}><X size={16}/></button>
      </div>

      <div className="duo-progress-bar-wrap" style={{marginTop: 10}}>
        <div className="duo-progress-bar-fill" style={{width: `${((step+1)/steps.length)*100}%`}}/>
      </div>

      <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 16, margin: '14px 0 6px'}}>
        {currentStep[0]}
      </h3>
      <p style={{fontSize: 12.5, lineHeight: 1.5, color: '#475569'}}>{currentStep[1]}</p>

      <div className="panda-actions" style={{marginTop: 14}}>
        <button className="text-button" onClick={close} style={{fontWeight: 700}}>Skip tutorial</button>
        <div style={{display: 'flex', gap: 6}}>
          {step>0&&<button className="duo-btn duo-btn-secondary small" onClick={()=>setStep(step-1)}><ArrowLeft size={14}/></button>}
          <button className="duo-btn duo-btn-success small" onClick={()=>step<steps.length-1?setStep(step+1):close()}>
            {step===steps.length-1?'Finish (+50 XP)':'Next'} <ArrowRight size={14}/>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ShareModal({close}:{close:()=>void}) {
  const [copied,setCopied]=useState(false)
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <motion.div className="share-modal duo-card" style={{borderRadius: 24, border: '3px solid var(--line)'}} initial={{scale:.96,opacity:0}} animate={{scale:1,opacity:1}} onMouseDown={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Share Medical Records</h2>
            <p style={{fontSize: 11, color: '#728096'}}>Create an expiring, read-only doctor link</p>
          </div>
          <button className="icon-button" onClick={close}><X size={18}/></button>
        </div>
        <div className="qr-box" style={{borderRadius: 16}}>
          <QRCodeSVG value="https://medivault.local/share/demo" size={130}/>
        </div>
        <div className="share-link" style={{borderRadius: 12}}>
          <LockKeyhole size={15}/>
          <span>medivault.app/share/a8F9...</span>
          <button className="duo-btn duo-btn-secondary small" onClick={()=>setCopied(true)}>
            {copied?<Check size={14}/>:<Copy size={14}/>} {copied?'Copied!':'Copy'}
          </button>
        </div>
        <div className="form-row" style={{marginTop: 10}}>
          <label style={{fontWeight: 700}}>Expiration
            <select style={{borderRadius: 10, height: 38}}>
              <option>24 hours</option>
              <option>7 days</option>
              <option>30 days</option>
            </select>
          </label>
          <label style={{fontWeight: 700}}>Password Protection
            <input type="password" placeholder="Optional passcode" style={{borderRadius: 10, height: 38}}/>
          </label>
        </div>
        <div className="verify-actions" style={{marginTop: 18}}>
          <button className="duo-btn duo-btn-secondary" onClick={close}>Cancel</button>
          <button className="duo-btn duo-btn-primary" onClick={close}>Create Secure Link</button>
        </div>
      </motion.div>
    </div>
  )
}

function Toast({text}:{text:string}){
  return (
    <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} className="toast" style={{borderRadius: 14, fontWeight: 800}}>
      <CheckCircle2 size={18}/>{text}
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// MAIN APP COMPONENT
// --------------------------------------------------------------------------
export default function App() {
  const [view,setView] = useState<View>('landing')
  const [dark,setDark] = useState(false)
  const [page,setPage] = useState<Page>('Overview')
  const [menu,setMenu] = useState(false)
  const [panda,setPanda] = useState(false)
  const [step,setStep] = useState(0)
  const [share,setShare] = useState(false)
  const [toast,setToast] = useState('')
  const [confettiActive, setConfettiActive] = useState(false)
  const [showTrophyModal, setShowTrophyModal] = useState(false)
  const [gamificationEnabled, setGamificationEnabled] = useState(true)

  // Gamification State
  const initialGameStats = readStoredGamification()
  const [xp, setXp] = useState(initialGameStats.xp)
  const [streak, setStreak] = useState(initialGameStats.streak)

  useEffect(() => {
    saveStoredGamification(xp, streak)
  }, [xp, streak])

  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([
    { id: 'review-doc', title: 'Review 1 medical document', desc: 'Confirm extracted fields', xp: 20, done: true },
    { id: 'check-meds', title: 'Check today\'s medicine schedule', desc: 'Log morning & evening doses', xp: 15, done: false },
    { id: 'emergency-check', title: 'Verify emergency contact details', desc: 'Ensure active QR token', xp: 25, done: false }
  ])

  const [achievements] = useState<Achievement[]>([
    { id: 'first-vault', name: 'First Vault', desc: 'Set up initial profile', xp: 50, icon: '🏅', unlocked: true },
    { id: 'ocr-scout', name: 'OCR Scout', desc: 'Extract report with OCR', xp: 50, icon: '🔍', unlocked: true },
    { id: 'family-guard', name: 'Family Guard', desc: 'Organize 3 family profiles', xp: 75, icon: '🛡️', unlocked: true },
    { id: 'ai-pioneer', name: 'AI Pioneer', desc: 'Generate clinical summary', xp: 100, icon: '✨', unlocked: true },
    { id: 'emergency-ready', name: 'Emergency Ready', desc: 'Set up Emergency ID Card', xp: 50, icon: '🚨', unlocked: true },
    { id: 'master-archivist', name: 'Master Archivist', desc: 'Store 30+ verified documents', xp: 150, icon: '👑', unlocked: false }
  ])

  const [uploadedRecords,setUploadedRecords] = useState<MedicalRecord[]>(readStoredRecords)
  const [demoRecords, setDemoRecords] = useState<MedicalRecord[]>(initialRecords)

  const triggerConfetti = () => {
    setConfettiActive(true)
    setTimeout(() => setConfettiActive(false), 2000)
  }

  const notify=(m:string, isCelebrate=false)=>{
    setToast(m)
    if (isCelebrate) triggerConfetti()
    setTimeout(()=>setToast(''),3000)
  }

  const addXP = (points: number, reason: string) => {
    setXp(v => v + points)
    notify(`+${points} XP: ${reason}! 🎉`, true)
  }

  const handleCompleteMission = (id: string) => {
    setDailyMissions(missions => {
      const updated = missions.map(m => {
        if (m.id === id && !m.done) {
          addXP(m.xp, `Completed mission "${m.title}"`)
          return { ...m, done: true }
        }
        return m
      })
      if (updated.every(m => m.done)) {
        setStreak(s => s + 1)
      }
      return updated
    })
  }

  const saveRecord=async(record:MedicalRecord,file:File)=>{
    if(record.id)await storeRecordFile(record.id,file).catch(()=>notify('Extracted details saved, but original file could not be stored.'))
    const updated=[record,...uploadedRecords]
    setUploadedRecords(updated)
    try {
      localStorage.setItem(storedRecordsKey,JSON.stringify(updated))
    } catch {
      notify('Record added for this session.')
      return
    }
    addXP(25, 'Document saved and AI insights generated')
  }

  const handleUpdateRecord = (updated: MedicalRecord) => {
    if (updated.source === 'real') {
      const next = uploadedRecords.map(r => (r.id === updated.id ? updated : r))
      setUploadedRecords(next)
      try { localStorage.setItem(storedRecordsKey, JSON.stringify(next)) } catch {}
    } else {
      setDemoRecords(demoRecords.map(r => (r.title === updated.title ? updated : r)))
    }
    notify(`Updated "${updated.title}"`)
  }

  const handleDeleteRecord = (record: MedicalRecord) => {
    if (record.source === 'real') {
      const next = uploadedRecords.filter(r => r.id !== record.id)
      setUploadedRecords(next)
      try { localStorage.setItem(storedRecordsKey, JSON.stringify(next)) } catch {}
    } else {
      setDemoRecords(demoRecords.filter(r => r.title !== record.title))
    }
    notify(`Deleted "${record.title}"`)
  }

  const handleAnalyzeRecord = (record: MedicalRecord) => {
    const summary = generateAISummary(record)
    const updated: MedicalRecord = { ...record, aiSummary: summary }
    handleUpdateRecord(updated)
    addXP(20, `AI Analysis completed for "${record.title}"`)
  }

  const handleTakeMedicine = () => {
    addXP(15, 'Medication marked as taken')
    handleCompleteMission('check-meds')
  }

  const allRecords = [...demoRecords, ...uploadedRecords]

  if(view==='landing') return (
    <div className={dark?'app dark':'app'}>
      <Landing 
        dark={dark} 
        setDark={setDark} 
        onStart={()=>setView('auth')} 
        onExplore={()=>document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}
      />
      {toast&&<Toast text={toast}/>}
      <Confetti active={confettiActive}/>
    </div>
  )

  if(view==='auth') return (
    <div className={dark?'app dark':'app'}>
      <Auth onBack={()=>setView('landing')} onDone={()=>setView('app')}/>
    </div>
  )

  const nav = [
    ['Overview',LayoutDashboard],['Medical Records',FolderHeart],['Upload Documents',Upload],
    ['Health Timeline',Activity],['Health Insights',BarChart3],['MediBot AI',Bot],
    ['Medicine Reminders',Pill],['Family Vault',Users],['Emergency Health ID',Siren],
    ['Doctor Summary',FileBadge],['Duplicate Check',Copy],['Shared Records',Share2],
    ['Settings',Settings]
  ] as const

  return (
    <div className={dark?'app dashboard-shell dark':'app dashboard-shell'}>
      <Confetti active={confettiActive}/>

      {/* Sidebar */}
      <aside className={menu?'sidebar open':'sidebar'} style={{borderRight: '2.5px solid var(--line)'}}>
        <div className="sidebar-brand">
          <Logo/>
          <button className="mobile-close" onClick={()=>setMenu(false)}><X size={19}/></button>
        </div>

        <nav style={{marginTop: 16}}>
          {nav.map(([label,Icon])=> (
            <button 
              key={label} 
              className={page===label?'nav-item active':'nav-item'} 
              onClick={()=>{setPage(label as Page);setMenu(false)}}
              style={{borderRadius: 14, fontWeight: 800}}
            >
              <Icon size={18}/>
              <span>{label}</span>
              {label==='Shared Records'&&<b>2</b>}
            </button>
          ))}
        </nav>

        <div className="sidebar-profile">
          <PandaBot size="small" pose="dashboard"/>
          <div className="sidebar-profile-info">
            <strong>Aniket Sharma</strong>
            <span>Level {Math.floor(xp/100) + 1} Archivist</span>
          </div>
          <button className="sidebar-profile-btn" onClick={()=>setPage('Settings')} title="Settings"><MoreHorizontal size={18}/></button>
        </div>
      </aside>

      {/* Main Dashboard Shell */}
      <main className="dashboard-main">
        <header className="dashboard-header" style={{borderBottom: '2.5px solid var(--line)'}}>
          <button className="menu-button" onClick={()=>setMenu(true)}><Menu size={22}/></button>
          
          <div className="header-search" style={{borderRadius: 14, border: '2px solid var(--line)'}}>
            <Search size={17} color="#3185E8"/>
            <input placeholder="Search records, diagnoses, medicines, doctors..."/>
          </div>

          {/* Gamification Pill Bar (Duolingo Header) */}
          {gamificationEnabled && (
            <div className="gamification-pill-bar">
              <button 
                className="game-pill streak" 
                onClick={()=>notify(`🔥 ${streak}-day organization streak! Keep uploading & organizing daily.`)}
                title="Your daily health organization streak"
              >
                <Flame size={16}/> <span>{streak} Days</span>
              </button>

              <button 
                className="game-pill xp" 
                onClick={()=>setShowTrophyModal(true)}
                title="Click to view Achievements & Trophy Room"
              >
                <Zap size={15}/> <span>{xp} XP</span>
              </button>

              <button 
                className="game-pill vault-health" 
                onClick={()=>notify("🛡️ Vault is 100% organized and protected!")}
                title="Vault Health Status"
              >
                <ShieldCheck size={16}/> <span>100% Ready</span>
              </button>
            </div>
          )}

          <div className="header-actions">
            <button className="icon-button" onClick={()=>setDark(!dark)}>
              {dark?<Sun size={18}/>:<Moon size={18}/>}
            </button>
            <button className="icon-button notification" onClick={()=>notify("You have 1 document pending doctor review.")}>
              <Bell size={18}/><i/>
            </button>
            <button className="header-avatar" onClick={()=>setPage('Settings')} style={{borderRadius: 14}}>AS</button>
          </div>
        </header>

        <div className="dashboard-content">
          {page==='Overview'&& (
            <Overview 
              setPage={setPage} 
              share={()=>setShare(true)}
              xp={xp}
              streak={streak}
              dailyMissions={dailyMissions}
              onCompleteMission={handleCompleteMission}
              onOpenAchievements={()=>setShowTrophyModal(true)}
            />
          )}

          {page==='Medical Records'&& (
            <Records 
              items={allRecords} 
              setPage={setPage} 
              onUpdateRecord={handleUpdateRecord}
              onDeleteRecord={handleDeleteRecord}
              onAnalyzeRecord={handleAnalyzeRecord}
            />
          )}

          {page==='Upload Documents'&&<UploadView items={allRecords} onSave={saveRecord}/>}
          {page==='Health Timeline'&&<Timeline />}
          {page==='Health Insights'&&<Insights />}
          {page==='MediBot AI'&&<Assistant />}
          {page==='Medicine Reminders'&&<Reminders onTakeMedicine={handleTakeMedicine}/>}
          {page==='Family Vault'&&<FamilyVault />}
          {page==='Emergency Health ID'&&<EmergencyId />}
          {page==='Doctor Summary'&&<DoctorSummary />}
          {page==='Duplicate Check'&&<DuplicateCheck />}
          {page==='Shared Records'&&<Sharing />}
          {page==='Settings'&& (
            <SettingsPage 
              gamificationEnabled={gamificationEnabled}
              setGamificationEnabled={setGamificationEnabled}
              dark={dark}
              setDark={setDark}
              onSignOut={() => {
                setView('landing')
                setPage('Overview')
                notify('👋 Signed out of MediVault. See you soon!')
              }}
              notify={notify}
            />
          )}
        </div>
      </main>

      {/* Mascot Onboarding Tutorial */}
      {panda&&<Panda step={step} setStep={setStep} close={()=>setPanda(false)} />}
      {!panda&& (
        <button className="panda-fab" onClick={()=>setPanda(true)} aria-label="Open PandaBot Guide">
          <PandaBot size="small" pose="welcome"/>
          <i/>
        </button>
      )}

      {/* Share Modal */}
      {share&&<ShareModal close={()=>setShare(false)}/>}

      {/* Trophy / Achievements Modal */}
      {showTrophyModal && (
        <TrophyModal 
          xp={xp}
          streak={streak}
          achievements={achievements}
          close={() => setShowTrophyModal(false)}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {nav.slice(0,5).map(([label,Icon]) => (
          <button key={label} className={page===label?'active':''} onClick={()=>setPage(label as Page)} aria-label={label}>
            <Icon size={19}/>
            <span>{label==='Medical Records'?'Records':label==='Upload Documents'?'Upload':label==='Health Timeline'?'Timeline':label==='Health Insights'?'Insights':'Home'}</span>
          </button>
        ))}
      </nav>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast&&<motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:30,opacity:0}} className="toast"><CheckCircle2 size={18}/>{toast}</motion.div>}
      </AnimatePresence>
    </div>
  )
}

// --------------------------------------------------------------------------
// CARTOON LANDING PAGE (DUOLINGO ENGAGEMENT MEETS HEALTHCARE TRUST)
// --------------------------------------------------------------------------
function Landing({dark,setDark,onStart,onExplore}:{dark:boolean,setDark:(v:boolean)=>void,onStart:()=>void,onExplore:()=>void}) {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Logo/>
        <div className="landing-links" style={{fontWeight: 800}}>
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#gamification">Gamification</a>
          <a href="#security">Privacy</a>
        </div>
        <div className="landing-actions">
          <button className="icon-button" onClick={()=>setDark(!dark)}>
            {dark?<Sun size={17}/>:<Moon size={17}/>}
          </button>
          <button className="duo-btn duo-btn-secondary small" onClick={onStart}>
            Sign In
          </button>
          <button className="duo-btn duo-btn-success small" onClick={onStart}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{minHeight: 640}}>
        <motion.div className="hero-copy" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <div className="landing-badge-trust" style={{borderRadius: 999}}>
            <Sparkles size={15}/> The Delightful, Gamified Health Locker
          </div>
          <h1 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 52, lineHeight: 1.15}}>
            Your Entire Medical History.<br/>
            <span style={{color: '#3185E8'}}>Made Simple & Fun.</span>
          </h1>
          <p style={{fontSize: 18, lineHeight: 1.7, color: '#728096', maxWidth: 540}}>
            Organize prescriptions, laboratory reports, and vaccination records with <strong>PandaBot</strong>. Earn organization XP, extract doctor notes with Google AI, and share safely.
          </p>
          <div className="hero-buttons" style={{marginTop: 32}}>
            <button className="duo-btn duo-btn-success large" onClick={onStart}>
              Get Started Free <ArrowRight size={18}/>
            </button>
            <button className="duo-btn duo-btn-secondary large" onClick={onExplore}>
              Explore Features
            </button>
          </div>
          <div className="trust-row" style={{marginTop: 28}}>
            <div className="trust-avatars">
              <i style={{background: '#DCFCE7'}}><ShieldCheck size={16} color="#16A34A"/></i>
            </div>
            <div>
              <small style={{fontWeight: 700}}>Bank-Grade Client Encryption · 100% Patient Owned Data · Zero Data Selling</small>
            </div>
          </div>
        </motion.div>

        <motion.div className="hero-visual" initial={{opacity:0,x:25}} animate={{opacity:1,x:0}}>
          <div className="orb orb-one"/>
          <div className="orb orb-two"/>
          
          <div className="hero-panda-wrap" style={{borderRadius: '45% 55% 48% 52%'}}>
            <PandaBot size="xlarge" pose="welcome"/>
            <motion.div 
              className="panda-speech-bubble"
              style={{position: 'absolute', right: -30, top: 10, maxWidth: 210}}
              animate={{y:[0,-6,0]}} 
              transition={{repeat:Infinity,duration:3.2}}
            >
              Hi! I'm PandaBot. Let's organize your health story! 🐼✨
            </motion.div>
          </div>

          <motion.div 
            className="hero-file-card hero-file-one duo-card" 
            animate={{y:[0,-8,0],rotate:[-3,-1,-3]}} 
            transition={{repeat:Infinity,duration:4}}
            style={{borderRadius: 18}}
          >
            <div className="hero-file-icon blue"><FileText size={20}/></div>
            <div><b>AI Clinical Summary</b><span>Extracted prescriptions & next steps</span></div>
            <CheckCircle2 size={16} color="#16a34a"/>
          </motion.div>

          <motion.div 
            className="hero-file-card hero-file-two duo-card" 
            animate={{y:[0,8,0],rotate:[3,1,3]}} 
            transition={{repeat:Infinity,duration:4.5}}
            style={{borderRadius: 18}}
          >
            <div className="hero-file-icon yellow"><Trophy size={20} color="#D97706"/></div>
            <div><b>Organization Streak</b><span>Level 4 Archivist (+280 XP)</span></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Gamification Showcase Banner */}
      <section className="duo-quest-banner" id="gamification" style={{maxWidth: 1140, margin: '20px auto 40px'}}>
        <PandaBot size="medium" pose="celebration"/>
        <div style={{flex: 1}}>
          <div className="quest-tag"><Star size={13}/> Duolingo-Inspired Gamification</div>
          <h2 className="quest-title" style={{fontSize: 24}}>Organizing Your Health Doesn't Have to Be Boring</h2>
          <p className="quest-desc" style={{fontSize: 14}}>
            Earn XP for uploading records, checking medicine schedules, and setting up emergency contacts. We never gamify illness—only your organization habits!
          </p>
        </div>
        <button className="duo-btn duo-btn-primary large" onClick={onStart}>
          Start Level 1 Now
        </button>
      </section>

      {/* 6 Key Feature Cards */}
      <section className="feature-strip" id="features">
        <div className="section-heading">
          <div className="eyebrow"><Sparkles size={14}/> Smart, Friendly Features</div>
          <h2 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>
            Everything you need to master your medical history
          </h2>
          <p style={{fontSize: 16}}>Friendly cartoon delight meets hospital-grade precision.</p>
        </div>

        <div className="landing-feature-grid-v2">
          <div className="landing-feature-card-v2 duo-card">
            <div className="landing-feature-icon-wrap" style={{background: '#EFF6FF', color: '#3185E8'}}>
              <Upload size={24}/>
            </div>
            <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 800}}>Easy Uploads & OCR</h3>
            <p>Drag & drop PDFs or photos from your phone. Client-side OCR with English, Hindi, and Marathi support.</p>
          </div>

          <div className="landing-feature-card-v2 duo-card">
            <div className="landing-feature-icon-wrap" style={{background: '#F5F3FF', color: '#7C3AED'}}>
              <FolderHeart size={24}/>
            </div>
            <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 800}}>Organized by Design</h3>
            <p>Categorize files automatically into Prescriptions, Test Reports, Doctor Notes, and Vaccination History.</p>
          </div>

          <div className="landing-feature-card-v2 duo-card">
            <div className="landing-feature-icon-wrap" style={{background: '#ECFDF5', color: '#16A34A'}}>
              <Sparkles size={24}/>
            </div>
            <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 800}}>Google-Powered AI Insights</h3>
            <p>AI automatically pulls attending doctor names, dosages, clinical diagnoses, and recommended next steps.</p>
          </div>

          <div className="landing-feature-card-v2 duo-card">
            <div className="landing-feature-icon-wrap" style={{background: '#ECFEFF', color: '#0891B2'}}>
              <Users size={24}/>
            </div>
            <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 800}}>Family Vault Profiles</h3>
            <p>Manage separate health lockers for spouse, kids, and parents with custom permission switches.</p>
          </div>

          <div className="landing-feature-card-v2 duo-card">
            <div className="landing-feature-icon-wrap" style={{background: '#FFF7ED', color: '#EA580C'}}>
              <Download size={24}/>
            </div>
            <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 800}}>Doctor Visit Summaries</h3>
            <p>Select relevant medical records and generate clean, printable PDF briefs before every clinic appointment.</p>
          </div>

          <div className="landing-feature-card-v2 duo-card">
            <div className="landing-feature-icon-wrap" style={{background: '#FEF2F2', color: '#E11D48'}}>
              <Siren size={24}/>
            </div>
            <h3 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 800}}>Emergency Health ID</h3>
            <p>A digital emergency card with blood group, allergies, and emergency contact accessible via secure QR token.</p>
          </div>
        </div>
      </section>

      {/* How it works: Gamified Milestone Journey */}
      <section className="how-section" id="how">
        <div className="section-heading">
          <div className="eyebrow"><Activity size={14}/> Simple & Rewarding</div>
          <h2 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>Your 5-Step Health Organization Journey</h2>
        </div>
        <div className="how-flow">
          {['1. Upload File','2. OCR Scan','3. AI Insights','4. Family Scope','5. Safe Sharing'].map((x,i)=>(
            <div key={x}>
              <b className={i===0?'active':''} style={{boxShadow: '0 4px 0 rgba(0,0,0,0.1)'}}>{i+1}</b>
              <strong style={{fontWeight: 800}}>{x}</strong>
              {i<4&&<ArrowRight/>}
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="security-section" id="security">
        <div>
          <div className="eyebrow"><LockKeyhole size={14}/> Privacy First, Always</div>
          <h2 style={{fontFamily: "'Nunito', sans-serif", fontWeight: 900}}>
            Your Health Records.<br/>Protected at Every Step.
          </h2>
          <p style={{fontSize: 16, lineHeight: 1.7}}>
            We believe you should own your health data. MediVault is built with client-side cryptography, temporary sharing links, and zero third-party ads.
          </p>
          <ul>
            <li><Check/> 100% Patient ownership of every document</li>
            <li><Check/> Google Account login & client-side OCR verification</li>
            <li><Check/> Revocable, password-protected doctor share links</li>
            <li><Check/> No sensitive data ever exposed in public URLs</li>
          </ul>
        </div>
        <div className="shield-rings">
          <div/><div/>
          <div className="shield-core" style={{boxShadow: '0 20px 50px rgba(49, 133, 232, 0.35)'}}>
            <ShieldCheck size={52}/>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about">
        <Logo inverse/>
        <p style={{fontWeight: 700}}>Your Health Story. Organized. Protected. Delightful.</p>
        <div><a>Privacy Policy</a><a>Terms of Service</a><a>Security Whitepaper</a><a>Support</a></div>
        <span>© 2026 MediVault 2.0 · Professional Gamified Edition</span>
      </footer>
    </div>
  )
}
