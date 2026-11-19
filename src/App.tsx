import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, ArrowRight, Bell, Bot, CalendarDays, Check, ChevronDown,
  Download, FileText, FolderHeart, HeartPulse, LayoutDashboard, LockKeyhole,
  Menu, Microscope, Moon, MoreHorizontal, Plus, Search, Settings, Share2,
  ShieldCheck, Stethoscope, Sun, Upload, UserRound, X, Eye, Sparkles,
  Mail, Copy, CheckCircle2, ArrowLeft, BarChart3, Pill, Users,
  Siren, FileBadge, Languages, Trophy, Target
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import './App.css'
import './upload.css'

type View = 'landing' | 'auth' | 'app'
type Page = 'Overview' | 'Medical Records' | 'Upload Documents' | 'Health Timeline' | 'Health Insights' | 'MediBot AI' | 'Medicine Reminders' | 'Family Vault' | 'Emergency Health ID' | 'Doctor Summary' | 'Duplicate Check' | 'Shared Records' | 'Settings'

type MedicalRecord = {
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
}

const records: MedicalRecord[] = [
  { title:'Complete Blood Count', type:'Laboratory Report', date:'18 Feb 2026', doctor:'City Diagnostic Centre', hospital:'City Diagnostic Centre', status:'Verified', tone:'blue', icon:'lab', source:'demo' },
  { title:'Prescription - Dr. Sharma', type:'Prescription', date:'12 Feb 2026', doctor:'Dr. Raj Sharma', status:'Verified', tone:'purple', icon:'rx', source:'demo' },
  { title:'Cardiology Consultation', type:'Consultation', date:'05 Feb 2026', doctor:'Apollo Heart Clinic', hospital:'Apollo Heart Clinic', status:'Needs review', tone:'cyan', icon:'consult', source:'demo' },
  { title:'Thyroid Profile', type:'Laboratory Report', date:'28 Jan 2026', doctor:'MedLab Diagnostics', hospital:'MedLab Diagnostics', status:'Verified', tone:'green', icon:'lab', source:'demo' },
]

const storedRecordsKey = 'medivault.uploaded-records'

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
  return <div className={`logo ${inverse?'inverse':''}`}><div className="logo-mark"><HeartPulse size={20}/></div><span>Medi<span>Vault</span></span></div>
}

function PandaBot({ size='medium', pose='welcome' }: {size?:'small'|'medium'|'large', pose?:string}) {
  return (
    <div className={`pandabot ${size} pose-${pose}`} role="img" aria-label={`PandaBot ${pose}`}>
      <svg viewBox="0 0 180 190" aria-hidden="true">
        <ellipse cx="90" cy="178" rx="52" ry="8" fill="#174D85" opacity=".12"/>
        <g className="panda-ear left-ear"><circle cx="42" cy="48" r="25" fill="#263746"/><circle cx="42" cy="48" r="14" fill="#455866"/></g>
        <g className="panda-ear right-ear"><circle cx="138" cy="48" r="25" fill="#263746"/><circle cx="138" cy="48" r="14" fill="#455866"/></g>
        <circle cx="90" cy="68" r="62" fill="#FFFFFF" stroke="#263746" strokeWidth="5"/>
        <ellipse cx="65" cy="68" rx="17" ry="21" fill="#263746" transform="rotate(18 65 68)"/>
        <ellipse cx="115" cy="68" rx="17" ry="21" fill="#263746" transform="rotate(-18 115 68)"/>
        <g className="panda-eyes"><circle cx="66" cy="65" r="5" fill="#FFFFFF"/><circle cx="114" cy="65" r="5" fill="#FFFFFF"/></g>
        <ellipse cx="90" cy="88" rx="9" ry="7" fill="#263746"/>
        <path d="M90 95c-6 9-17 8-21 2M90 95c6 9 17 8 21 2" fill="none" stroke="#263746" strokeWidth="4" strokeLinecap="round"/>
        <path d="M43 112c10-8 18-11 47-11s37 3 47 11v38c-13 18-81 18-94 0z" fill="#3185E8" stroke="#174D85" strokeWidth="4"/>
        <path d="M70 107h40l-5 24H75z" fill="#FFFFFF" stroke="#174D85" strokeWidth="3"/>
        <path d="M90 128v23" stroke="#174D85" strokeWidth="4"/>
        <circle cx="90" cy="153" r="8" fill="#FFD66B" stroke="#174D85" strokeWidth="3"/>
        <g className="panda-arm left-arm"><path d="M43 121c-18 4-24 20-17 31" fill="none" stroke="#263746" strokeWidth="17" strokeLinecap="round"/><circle cx="25" cy="153" r="12" fill="#263746"/></g>
        <g className="panda-arm right-arm"><path d="M137 121c18-2 25-16 20-28" fill="none" stroke="#263746" strokeWidth="17" strokeLinecap="round"/><circle cx="156" cy="91" r="12" fill="#263746"/></g>
      </svg>
    </div>
  )
}

function Auth({onBack,onDone}:{onBack:()=>void,onDone:()=>void}) {
  const [mode,setMode]=useState<'signin'|'signup'>('signin')
  return <div className="auth-page"><div className="auth-brand"><button onClick={onBack}><ArrowLeft size={18}/> Back</button><Logo/></div><div className="auth-card"><div className="auth-icon"><ShieldCheck size={26}/></div><h1>{mode==='signin'?'Welcome back':'Create your vault'}</h1><p>{mode==='signin'?'Sign in to access your health archive.':'Start organizing your health history.'}</p>{mode==='signup'&&<label>Full name<div className="field"><UserRound size={17}/><input placeholder="Aniket Sharma"/></div></label>}<label>Email address<div className="field"><Mail size={17}/><input type="email" placeholder="you@example.com"/></div></label><label>Password<div className="field"><LockKeyhole size={17}/><input type="password" placeholder="Enter your password"/></div></label>{mode==='signin'&&<div className="auth-options"><label><input type="checkbox"/> Remember me</label><button>Forgot password?</button></div>}<button className="auth-submit" onClick={onDone}>{mode==='signin'?'Sign In':'Create Account'} <ArrowRight size={17}/></button><div className="auth-switch">{mode==='signin'?'New to MediVault?':'Already have an account?' } <button onClick={()=>setMode(mode==='signin'?'signup':'signin')}>{mode==='signin'?'Create account':'Sign in'}</button></div></div><p className="auth-security"><LockKeyhole size={13}/> Your information is encrypted and private</p></div>
}

function Overview({setPage,share}:{setPage:(p:Page)=>void,share:()=>void}) {
  return <motion.div initial={{opacity:0}} animate={{opacity:1}}>
    <div className="page-title"><div><p>Wednesday, 18 February</p><h1>Good morning, Aniket</h1></div><button className="primary-button" onClick={()=>setPage('Upload Documents')}><Plus size={17}/> Upload Document</button></div>
    <section className="organization-journey">
      <div className="journey-mascot"><PandaBot size="medium" pose="success"/></div>
      <div className="journey-copy"><div className="journey-label"><Target size={15}/><span>Today’s organization mission</span></div><h2>Keep your health story organized</h2><p>Review one document and earn 20 XP. This mission is optional.</p></div>
      <div className="journey-progress"><div><Trophy size={18}/><strong>140 XP</strong></div><div className="mission-track"><i/></div><span>2 of 3 steps</span></div>
    </section>
    <div className="stat-grid"><Stat icon={<FolderHeart/>} label="Total Documents" value="24" detail="+3 this month" tone="blue"/><Stat icon={<Stethoscope/>} label="Prescriptions" value="11" detail="Latest 12 Feb" tone="purple"/><Stat icon={<Microscope/>} label="Lab Reports" value="8" detail="2 pending review" tone="cyan"/><Stat icon={<CalendarDays/>} label="Consultations" value="5" detail="Last 05 Feb" tone="green"/></div>
    <div className="overview-grid">
      <section className="panel"><PanelHead title="Recent Documents" sub="Your latest health records" action="View all" onAction={()=>setPage('Medical Records')}/><div className="document-list">{records.map(r=><DocumentRow key={r.title} r={r}/>)}</div></section>
      <section className="panel"><PanelHead title="Document Distribution" sub="By category" action="6 months"/><div className="distribution"><div className="donut"><div><strong>24</strong><span>Total</span></div></div><div className="legend"><p><i className="lab"/><span>Lab reports</span><b>8</b></p><p><i className="rx"/><span>Prescriptions</span><b>11</b></p><p><i className="consult"/><span>Consultations</span><b>5</b></p></div></div></section>
    </div>
    <div className="bottom-grid"><section className="panel"><PanelHead title="Health Timeline" sub="Most recent updates" action="Explore" onAction={()=>setPage('Health Timeline')}/><div className="mini-timeline"><Mini date="18 Feb" title="Complete Blood Count" text="Laboratory Report"/><Mini date="12 Feb" title="Prescription updated" text="Dr. Raj Sharma"/><Mini date="05 Feb" title="Cardiology Consultation" text="Apollo Heart Clinic"/></div></section><section className="panel"><PanelHead title="Quick Actions"/><div className="quick-actions"><button onClick={()=>setPage('Upload Documents')}><span className="blue"><Upload/></span><div><b>Upload Prescription</b><small>Add a new prescription</small></div></button><button onClick={()=>setPage('Upload Documents')}><span className="cyan"><Microscope/></span><div><b>Upload Lab Report</b><small>Add test results</small></div></button><button onClick={()=>share()}><span className="green"><Share2/></span><div><b>Share Records</b><small>Create secure link</small></div></button></div></section></div>
  </motion.div>
}

function Stat({icon,label,value,detail,tone}:{icon:ReactNode,label:string,value:string,detail:string,tone:string}){return <motion.div className="stat-card" whileHover={{y:-3}}><div className={`stat-icon ${tone}`}>{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></motion.div>}
function PanelHead({title,sub,action,onAction}:{title:string,sub?:string,action?:string,onAction?:()=>void}){return <div className="panel-head"><div><h2>{title}</h2>{sub&&<p>{sub}</p>}</div>{action&&<button onClick={onAction}>{action}<ChevronDown size={13}/></button>}</div>}
function DocumentRow({r}:{r:MedicalRecord}){return <div className="document-row"><div className={`document-icon ${r.tone}`}>{r.icon==='lab'?<Microscope size={19}/>:r.icon==='rx'?<FileText size={19}/>:<Stethoscope size={19}/>}</div><div className="document-info"><strong>{r.title}</strong><span>{r.type} · {r.doctor}</span></div><span className={r.status==='Verified'?'status verified':'status review'}>{r.status==='Verified'?<Check size={12}/>:<Activity size={12}/>} {r.status}</span><button><MoreHorizontal size={18}/></button></div>}
function Mini({date,title,text}:{date:string,title:string,text:string}){return <div className="timeline-item"><div>{date}</div><i/><span><strong>{title}</strong><small>{text}</small></span></div>}

function Records({filter,items,setPage}:{filter?:string,items:MedicalRecord[],setPage:(page:Page)=>void}) {
  const [search,setSearch]=useState('')
  const list=items.filter(r=>(!filter||r.type===filter)&&`${r.title} ${r.doctor} ${r.hospital ?? ''}`.toLowerCase().includes(search.toLowerCase()))
  return <motion.div initial={{opacity:0}} animate={{opacity:1}}><div className="page-title"><div><p>Document library · Demo samples are labeled</p><h1>{filter?'My '+filter+'s': 'My Medical Records'}</h1></div><button className="primary-button" onClick={()=>setPage('Upload Documents')}><Upload size={17}/> Upload Document</button></div><div className="records-toolbar"><div className="records-search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search records, doctors, or medicines"/></div><button>Category <ChevronDown size={13}/></button><button>Newest first <ChevronDown size={13}/></button></div><div className="record-grid">{list.map((r,i)=><motion.div className="record-card" whileHover={{y:-4}} key={`${r.source}-${r.sha256 ?? r.title}-${i}`}><div className="record-card-top"><span className={`record-source ${r.source}`}>{r.source==='real'?'Real file':'Demo'}</span>{r.source==='real'&&r.id?<button aria-label={`Preview ${r.title}`} onClick={()=>void openStoredRecord(r)}><Eye size={16}/></button>:<button><MoreHorizontal size={18}/></button>}</div><div className={`record-preview ${r.tone}`}><div className="paper"><i/><i/><i/><b/><b/></div></div><div className="record-card-body"><span>{r.type}</span><h3>{r.title}</h3><p><Stethoscope size={13}/>{r.doctor}</p><div><small>{r.date}</small><em>{r.status}</em></div>{r.source==='real'&&r.extractedText&&<details className="real-record-text"><summary>View extracted text</summary><p>{r.extractedText}</p></details>}</div></motion.div>)}</div>{list.length===0&&<p className="empty-records">No matching records yet.</p>}</motion.div>
}

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
    setProgressText('Preparing file…')
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
              setProgressText(`OCR on PDF page ${pageNumber} of ${pdf.numPages}…`)
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
      setProgressText(extracted?'Extraction finished. Review carefully.':'No readable text detected; enter details manually.')
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
    const tone=category==='Prescription'?'purple':category==='Laboratory Report'?'blue':category==='Consultation'?'cyan':'green'
    onSave({id:crypto.randomUUID(),title:title.trim()||file.name.replace(/\.[^.]+$/,''),type:category,date:date.trim()||'Date not found',doctor:doctor.trim()||hospital.trim()||'Not identified',hospital:hospital.trim()||undefined,status:'Needs review',tone,icon:category==='Laboratory Report'?'lab':category==='Prescription'?'rx':'consult',source:'real',fileName:file.name,sha256:hash||undefined,extractedText:text,language,ocrMethod:ocrSource},file)
    reset()
  }

  return <motion.div initial={{opacity:0}} animate={{opacity:1}}><div className="page-title"><div><p>Real file processing happens in this browser; demo samples are separate</p><h1>Upload Medical Document</h1></div></div>{stage==='upload'?<div className="upload-layout"><section className="upload-panel" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const dropped=e.dataTransfer.files[0];if(dropped)void processFile(dropped)}}><div className="upload-icon"><Upload size={28}/></div><h3>Drag and drop your document</h3><p>PDF, JPG, JPEG, or PNG · Max 20 MB · Processed on this device</p><label className="primary-button">Choose File<input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={e=>{const selected=e.target.files?.[0];if(selected)void processFile(selected);e.currentTarget.value=''}}/></label>{error&&<p className="upload-error" role="alert">{error}</p>}</section><section className="upload-side"><h3>Document category</h3>{['Prescription','Laboratory Report','Consultation','Other'].map(x=><label className="category-option" key={x}><input type="radio" name="category" checked={category===x} onChange={()=>setCategory(x)}/><span>{x}</span></label>)}</section></div>:stage==='scan'?<section className="upload-panel scan-state"><div className="scanner"><FileText size={38}/><i/></div><h3>Processing {file?.name}</h3><p>{progressText} · {progress}%</p><progress className="ocr-progress" value={progress} max="100"/>{error&&<p className="upload-error" role="alert">{error}</p>}</section>:<div className="verify-layout"><section className="document-preview"><div className="preview-toolbar"><span>Original file preview · {file?.name}</span><div>{file&&<a href={previewUrl} download={file.name} aria-label="Download original file"><Download size={16}/></a>}</div></div>{file?.type==='application/pdf'||file?.name.toLowerCase().endsWith('.pdf')?<iframe className="original-preview" src={previewUrl} title="PDF document preview"/>:<img className="original-preview" src={previewUrl} alt={`Preview of ${file?.name}`}/>}</section><section className="verify-panel"><div className="verify-head"><div><span>Real file · {ocrSource}</span><h3>Review extracted information</h3></div><em>Needs review</em></div><p className="language-note">Language detection: {language} · Heuristic only; OCR and field extraction may be inaccurate.</p><label>Title<input value={title} onChange={e=>setTitle(e.target.value)}/></label><label>Hospital or laboratory<input value={hospital} onChange={e=>setHospital(e.target.value)}/></label><label>Doctor<input value={doctor} onChange={e=>setDoctor(e.target.value)}/></label><div className="form-row"><label>Document date<input value={date} onChange={e=>setDate(e.target.value)} placeholder="Not detected"/></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{['Prescription','Laboratory Report','Consultation','Other'].map(option=><option key={option}>{option}</option>)}</select></label></div><label>Extracted text<textarea value={text} onChange={e=>setText(e.target.value)} rows={8} placeholder="No text detected. You can enter it manually."/></label>{isDuplicate&&<div className="duplicate-warning" role="alert"><Copy size={17}/><p>This file's SHA-256 hash matches a real file already in your records. Check for a duplicate before saving. You may still continue.</p></div>}{error&&<p className="upload-error" role="alert">{error}</p>}<div className="warning-box"><ShieldCheck size={17}/><p>OCR is a best-effort aid and can be wrong or incomplete. Saving does not verify this record; review the original document.</p></div><div className="verify-actions"><button className="secondary-button" onClick={reset}>Cancel</button><button className="primary-button" onClick={confirm}><Check size={17}/> Confirm & Save</button></div></section></div>}</motion.div>
}

function Timeline(){return <motion.div initial={{opacity:0}} animate={{opacity:1}}><div className="page-title"><div><p>Complete health journey</p><h1>Health Timeline</h1></div><button className="secondary-button"><CalendarDays size={16}/> February 2026 <ChevronDown size={13}/></button></div><div className="timeline-page"><h2>February 2026</h2><div className="timeline-wide"><WideTimeline date="18 Feb" title="Complete Blood Count" text="Laboratory Report · City Diagnostic Centre" tone="blue"/><WideTimeline date="12 Feb" title="Prescription - Dr. Sharma" text="Prescription · Dr. Raj Sharma" tone="purple"/><WideTimeline date="05 Feb" title="Cardiology Consultation" text="Consultation · Apollo Heart Clinic" tone="cyan"/></div><h2>January 2026</h2><div className="timeline-wide"><WideTimeline date="28 Jan" title="Thyroid Profile" text="Laboratory Report · MedLab Diagnostics" tone="green"/></div></div></motion.div>}
function WideTimeline({date,title,text,tone}:{date:string,title:string,text:string,tone:string}){return <div className="wide-item"><div className="wide-date">{date}</div><i className={tone}/><div><strong>{title}</strong><span>{text}</span></div><button><ArrowRight size={16}/></button></div>}

function Sharing(){return <motion.div initial={{opacity:0}} animate={{opacity:1}}><div className="page-title"><div><p>Access control</p><h1>Shared Records</h1></div><button className="primary-button"><Plus size={17}/> Create Share Link</button></div><div className="share-table panel"><div className="share-row table-head"><span>Shared with</span><span>Records</span><span>Expires</span><span>Status</span><span/></div>{[['Dr. Rahul Mehta','3 records','24 Feb 2026','Active'],['Apollo Diagnostics','2 records','21 Feb 2026','Active']].map(x=><div className="share-row" key={x[0]}><strong><div className="avatar small">{x[0][0]}</div>{x[0]}</strong><span>{x[1]}</span><span>{x[2]}</span><em>Active</em><button>Revoke</button></div>)}</div></motion.div>}

function Insights(){
  const points=[38,42,40,48,52,49,55]
  return <motion.div initial={{opacity:0}} animate={{opacity:1}}>
    <div className="page-title"><div><p>Verified laboratory observations</p><h1>Health Insights</h1></div><button className="secondary-button"><CalendarDays size={16}/> Jan – Feb 2026 <ChevronDown size={13}/></button></div>
    <div className="insights-summary"><Stat icon={<Microscope/>} label="Lab Reports" value="8" detail="Demo sample data" tone="cyan"/><Stat icon={<Activity/>} label="Tracked Tests" value="12" detail="Compatible units only" tone="blue"/><Stat icon={<Check/>} label="Verified Values" value="31" detail="Patient-reviewed" tone="green"/></div>
    <div className="insights-grid"><section className="panel lab-chart"><PanelHead title="Hemoglobin trend" sub="City Diagnostic Centre · g/dL"/><div className="chart-legend"><span>Previous</span><b>14.2 g/dL</b><em>Normal range 13.0–17.0</em></div><div className="line-chart">{points.map((v,i)=><i key={i} style={{height:`${v}%`}}><span>{i===6?'14.2':''}</span></i>)}</div><div className="chart-axis"><span>Jan 05</span><span>Jan 18</span><span>Feb 02</span><span>Feb 18</span></div></section><section className="panel observations"><PanelHead title="Latest observations" sub="CBC · 18 Feb 2026"/>{[['Hemoglobin','14.2','g/dL','Normal'],['WBC Count','7.8','K/uL','Normal'],['Platelets','240','K/uL','Normal']].map(x=><div className="observation" key={x[0]}><div><strong>{x[0]}</strong><span>{x[1]} {x[2]}</span></div><em>{x[3]}</em><button><Eye size={15}/></button></div>)}</section></div>
  </motion.div>
}

function Assistant(){
  const [language,setLanguage]=useState('English')
  const [messages,setMessages]=useState<string[]>([])
  const [input,setInput]=useState('')
  const send=(text:string)=>{if(!text.trim())return;setMessages(v=>[...v,text]);setInput('')}
  return <motion.div className="assistant-page" initial={{opacity:0}} animate={{opacity:1}}>
    <div className="page-title"><div><p>Verified records only · {language}</p><h1>MediBot AI</h1></div><button className="secondary-button" onClick={()=>setLanguage(language==='English'?'हिंदी':language==='हिंदी'?'मराठी':'English')}><Languages size={16}/> {language}</button></div>
    <div className="chat-panel"><div className="chat-head"><PandaBot size="small" pose="ai"/><div><b>MediBot</b><span>Patient-scoped retrieval · No independent diagnosis</span></div></div>
      <div className="chat-body"><div className="ai-message">Hello Aniket. Ask about records in the currently selected authorized profile. MediBot should include source document names and dates in every record-based answer.</div>
        {messages.map((m,i)=><div className="user-message" key={i}>{m}</div>)}
        <div className="suggestions">{['When was my last consultation?','Show my previous blood reports','Which medicines were prescribed?'].map(x=><button key={x} onClick={()=>send(x)}>{x}</button>)}</div>
        <div className="ai-config"><ShieldCheck size={16}/><div><strong>AI service setup required</strong><p>Connect an approved AI provider and RAG data source to answer live questions. This prototype does not send records or simulate AI responses.</p></div></div>
      </div>
      <div className="chat-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(input)} placeholder="Ask about your selected health records..."/><button onClick={()=>send(input)}><ArrowRight size={18}/></button></div>
    </div>
  </motion.div>
}

function SettingsPage(){return <motion.div initial={{opacity:0}} animate={{opacity:1}}><div className="page-title"><div><p>Account preferences</p><h1>Settings</h1></div></div><div className="settings-grid"><section className="panel profile-settings"><h2>Personal Profile</h2><div className="profile-avatar">AS</div><label>Full name<input defaultValue="Aniket Sharma"/></label><label>Email address<input defaultValue="aniket@example.com"/></label><button className="primary-button">Save Changes</button></section><section className="panel"><h2>Preferences</h2>{['Dark theme','Email notifications','Share access alerts','Appointment reminders'].map((x,i)=><div className="setting-row" key={x}><span>{x}</span><button className={i===0?'switch':'switch on'}><i/></button></div>)}</section></div></motion.div>}

function Reminders(){
  const [taken,setTaken]=useState<number[]>([])
  const meds=[['Metformin','500 mg · With breakfast','8:00 AM','Prescription'],['Vitamin D3','1 tablet · As prescribed','1:00 PM','Prescription'],['Atorvastatin','10 mg · At night','9:00 PM','Prescription']]
  return <motion.div initial={{opacity:0}} animate={{opacity:1}}><div className="page-title"><div><p>Confirmed medication schedule</p><h1>Medicine Reminders</h1></div><button className="primary-button"><Plus size={17}/> Add Medicine</button></div><div className="reminder-grid">{meds.map((m,i)=><section className="panel reminder-card" key={m[0]}><div className={`medicine-icon ${i===0?'blue':i===1?'cyan':'purple'}`}><Pill size={21}/></div><div className="reminder-info"><strong>{m[0]}</strong><span>{m[1]}</span><small>{m[3]} · Patient confirmation required</small></div><div className="dose-time">{m[2]}</div><button className={taken.includes(i)?'dose-button done':'dose-button'} onClick={()=>setTaken(v=>v.includes(i)?v.filter(x=>x!==i):[...v,i])}>{taken.includes(i)?<><Check size={15}/> Taken</>: 'Mark taken'}</button></section>)}</div><div className="reminder-banner"><ShieldCheck size={18}/><div><strong>Safety reminder</strong><p>Confirm every OCR-derived schedule before activation. MediVault does not modify clinician instructions or recommend dosage changes.</p></div></div></motion.div>
}

function FamilyVault(){
  const [active,setActive]=useState('Aniket')
  return <motion.div initial={{opacity:0}} animate={{opacity:1}}><div className="page-title"><div><p>Separate, permission-controlled profiles</p><h1>Family Vault</h1></div><button className="primary-button"><Plus size={17}/> Add Family Member</button></div><div className="family-switcher">{[['Aniket','Self','AS'],['Meera','Spouse','MK'],['Arjun','Child','AR']].map(m=><button key={m[0]} className={active===m[0]?'family-member active':'family-member'} onClick={()=>setActive(m[0])}><div>{m[2]}</div><strong>{m[0]}</strong><span>{m[1]}</span></button>)}</div><div className="family-grid"><section className="panel"><PanelHead title={`${active}'s profile`} sub="Active family record scope"/><div className="profile-summary"><div className="profile-avatar large">{active.slice(0,1)}</div><div><strong>{active} Sharma</strong><span>Personal vault · Consent controls enabled</span></div></div><div className="family-stats"><div><b>24</b><span>Records</span></div><div><b>5</b><span>Visits</span></div><div><b>2</b><span>Shares</span></div></div></section><section className="panel"><PanelHead title="Permissions" sub="Role-based access"/>{['Upload documents','View records','Generate summaries','Share records'].map((x,i)=><div className="setting-row" key={x}><span>{x}</span><button className={i<2?'switch on':'switch'}><i/></button></div>)}</section></div></motion.div>
}

function EmergencyId(){
  const [active,setActive]=useState(true)
  return <motion.div initial={{opacity:0}} animate={{opacity:1}}><div className="page-title"><div><p>Patient-controlled emergency access</p><h1>Emergency Health ID</h1></div><button className={active?'secondary-button':'primary-button'} onClick={()=>setActive(!active)}>{active?'Deactivate Card':'Activate Card'}</button></div><div className="emergency-layout"><section className="emergency-card"><div className="emergency-head"><HeartPulse size={20}/><span>MEDIVAULT · EMERGENCY ID</span></div><div className="emergency-person"><div>AS</div><div><strong>Aniket Sharma</strong><span>Blood group: O+</span></div></div><div className="emergency-fields"><div><span>Emergency contact</span><strong>Meera Sharma · 98765 43210</strong></div><div><span>Known allergies</span><strong>None reported</strong></div><div><span>Consent status</span><strong>{active?'Active secure token':'Inactive'}</strong></div></div><div className="emergency-qr"><QRCodeSVG value={active?'https://medivault.app/emergency/demo-token':'inactive'} size={108}/></div><small>QR contains a random token, never medical details.</small></section><section className="panel emergency-settings"><PanelHead title="Approved emergency fields" sub="Patient explicitly selected"/>{['Name','Blood group','Emergency contact','Known allergies','Important conditions','Current medication'].map((x,i)=><label className="emergency-check" key={x}><input type="checkbox" defaultChecked={i<4}/><span>{x}</span></label>)}<div className="form-row"><label>Token expiry<select><option>24 hours</option><option>7 days</option><option>30 days</option></select></label></div><button className="primary-button full">Save Emergency Profile</button></section></div></motion.div>
}

function DoctorSummary(){
  const [selected,setSelected]=useState<string[]>(['CBC Report','Consultation'])
  const toggle=(x:string)=>setSelected(v=>v.includes(x)?v.filter(y=>y!==x):[...v,x])
  return <motion.div initial={{opacity:0}} animate={{opacity:1}}><div className="page-title"><div><p>Patient-selected records only</p><h1>Doctor Visit Summary</h1></div><button className="primary-button"><Download size={17}/> Generate PDF</button></div><div className="summary-layout"><section className="panel summary-selection"><PanelHead title="Select content" sub="Demo data is labeled clearly"/>{[['Patient details','Personal and emergency fields'],['Consultation','Cardiology · 05 Feb 2026'],['CBC Report','Laboratory · 18 Feb 2026'],['Prescription','Dr. Sharma · 12 Feb 2026'],['Known allergies','Patient-entered']].map(x=><button className={selected.includes(x[0])?'summary-check selected':'summary-check'} onClick={()=>toggle(x[0])} key={x[0]}><span>{selected.includes(x[0])?<Check size={13}/>:null}</span><div><strong>{x[0]}</strong><small>{x[1]}</small></div></button>)}</section><section className="summary-preview"><div className="summary-document"><div className="summary-brand"><Logo/><span>Visit Summary</span></div><h2>Aniket Sharma</h2><p>Generated 19 November 2026</p><h3>Selected medical history</h3>{selected.map(x=><div className="summary-source" key={x}><strong>{x}</strong><span>Source date and document reference</span></div>)}</div></section></div></motion.div>
}

function DuplicateCheck(){
  const [choice,setChoice]=useState<'pending'|'keep'|'cancel'>('pending')
  return <motion.div initial={{opacity:0}} animate={{opacity:1}}>
    <div className="page-title"><div><p>Smart duplicate review</p><h1>Possible Duplicate</h1></div><button className="secondary-button"><Search size={16}/> Scan another document</button></div>
    <section className="duplicate-banner"><PandaBot size="medium" pose="error"/><div><strong>These documents look very similar</strong><p>We found matching OCR text and a compatible report date. Nothing has been deleted or merged.</p></div><span>86% similarity</span></section>
    <div className="duplicate-grid"><section className="panel duplicate-document"><div className="duplicate-head"><span>Existing document</span><b>Uploaded 12 Feb 2026</b></div><div className="sample-document compact"><h3>Complete Blood Count</h3><p>City Diagnostic Centre · 18 Feb 2026</p><div className="duplicate-lines"><i/><i/><i/><i/></div></div></section><section className="panel duplicate-document"><div className="duplicate-head"><span>New document</span><b>Ready to upload</b></div><div className="sample-document compact"><h3>Complete Blood Count</h3><p>City Diagnostic Centre · 18 Feb 2026</p><div className="duplicate-lines"><i/><i/><i/><i/></div></div></section></div>
    <div className="duplicate-actions">{choice==='pending'?<><button className="secondary-button" onClick={()=>setChoice('cancel')}>Cancel upload</button><button className="primary-button" onClick={()=>setChoice('keep')}><Check size={17}/> Keep both</button></>:<div className="duplicate-result"><CheckCircle2 size={18}/>{choice==='keep'?'Both documents will remain separate.':'Upload cancelled. No file was deleted.'}</div>}</div>
  </motion.div>
}

function Panda({step,setStep,close}:{step:number,setStep:(n:number)=>void,close:()=>void}) {
  const steps=[['Welcome to MediVault 2.0!',"Hi, I'm PandaBot. I can guide you through your family health vault."],['Choose a family profile','Switch profiles only when you have permission to view that member.'],['Upload or review documents','OCR needs review before it becomes verified data.'],['Explore health insights','Compare compatible laboratory values with source references.'],['Share safely','Create an expiring, revocable link for selected records.']]
  return <motion.div className="panda-card" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}><div className="panda-card-head"><PandaBot size="small" pose="welcome"/><div><strong>PandaBot</strong><span>Step {step+1} of {steps.length}</span></div><button onClick={close}><X size={16}/></button></div><div className="panda-progress"><i style={{width:`${((step+1)/steps.length)*100}%`}}/></div><h3>{steps[step][0]}</h3><p>{steps[step][1]}</p><div className="panda-actions"><button className="text-button" onClick={close}>Skip tutorial</button><div>{step>0&&<button className="panda-next secondary" onClick={()=>setStep(step-1)}><ArrowLeft size={15}/></button>}<button className="panda-next" onClick={()=>step<steps.length-1?setStep(step+1):close()}>{step===steps.length-1?'Finish':'Next'} <ArrowRight size={15}/></button></div></div></motion.div>
}

function ShareModal({close}:{close:()=>void}) {
  const [copied,setCopied]=useState(false)
  return <div className="modal-backdrop" onMouseDown={close}><motion.div className="share-modal" initial={{scale:.96,opacity:0}} animate={{scale:1,opacity:1}} onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><h2>Share medical records</h2><p>Create a secure, read-only link</p></div><button onClick={close}><X size={19}/></button></div><div className="qr-box"><QRCodeSVG value="https://medivault.local/share/demo" size={130}/></div><div className="share-link"><LockKeyhole size={15}/><span>medivault.app/share/a8F...</span><button onClick={()=>setCopied(true)}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy'}</button></div><div className="form-row"><label>Expiration<select><option>24 hours</option><option>7 days</option><option>30 days</option></select></label><label>Password protection<input type="password" placeholder="Optional"/></label></div><div className="verify-actions"><button className="secondary-button" onClick={close}>Cancel</button><button className="primary-button" onClick={close}>Create Secure Link</button></div></motion.div></div>
}

function Toast({text}:{text:string}){return <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} className="toast"><CheckCircle2 size={18}/>{text}</motion.div>}

export default function App() {
  const [view,setView] = useState<View>('landing')
  const [dark,setDark] = useState(false)
  const [page,setPage] = useState<Page>('Overview')
  const [menu,setMenu] = useState(false)
  const [panda,setPanda] = useState(true)
  const [step,setStep] = useState(0)
  const [share,setShare] = useState(false)
  const [toast,setToast] = useState('')
  const [uploadedRecords,setUploadedRecords] = useState<MedicalRecord[]>(readStoredRecords)
  const notify=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2600)}
  const saveRecord=async(record:MedicalRecord,file:File)=>{
    if(record.id)await storeRecordFile(record.id,file).catch(()=>notify('Extracted details saved, but the original file could not be stored.'))
    const updated=[record,...uploadedRecords]
    setUploadedRecords(updated)
    try {
      localStorage.setItem(storedRecordsKey,JSON.stringify(updated))
    } catch {
      notify('Record added for this session, but local storage could not be updated.')
      return
    }
    notify('Record and original file saved locally. OCR remains unverified.')
  }
  const allRecords=[...records,...uploadedRecords]

  if(view==='landing') return <div className={dark?'app dark':'app'}><Landing dark={dark} setDark={setDark} onStart={()=>setView('auth')} onExplore={()=>document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}/>{toast&&<Toast text={toast}/>}</div>
  if(view==='auth') return <div className={dark?'app dark':'app'}><Auth onBack={()=>setView('landing')} onDone={()=>setView('app')}/></div>

  const nav = [
    ['Overview',LayoutDashboard],['Medical Records',FolderHeart],['Health Timeline',Activity],
    ['Health Insights',BarChart3],['MediBot AI',Bot],['Medicine Reminders',Pill],
    ['Family Vault',Users],['Emergency Health ID',Siren],['Doctor Summary',FileBadge],
    ['Duplicate Check',Copy],['Shared Records',Share2],['Settings',Settings]
  ] as const

  return (
    <div className={dark?'app dashboard-shell dark':'app dashboard-shell'}>
      <aside className={menu?'sidebar open':'sidebar'}>
        <div className="sidebar-brand"><Logo/><button className="mobile-close" onClick={()=>setMenu(false)}><X size={19}/></button></div>
        <nav>{nav.map(([label,Icon])=> <button key={label} className={page===label?'nav-item active':'nav-item'} onClick={()=>{setPage(label);setMenu(false)}}><Icon size={18}/><span>{label}</span>{label==='Shared Records'&&<b>2</b>}</button>)}</nav>
        <div className="sidebar-profile"><PandaBot size="small" pose="dashboard"/><div><strong>Aniket Sharma</strong><span>Personal account</span></div><button onClick={()=>setPage('Settings')}><MoreHorizontal size={18}/></button></div>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header"><button className="menu-button" onClick={()=>setMenu(true)}><Menu size={21}/></button><div className="header-search"><Search size={17}/><input placeholder="Search records, medicines, doctors..."/></div><div className="header-actions"><button className="icon-button" onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button><button className="icon-button notification"><Bell size={18}/><i/></button><button className="header-avatar" onClick={()=>setPage('Settings')}>AS</button></div></header>
        <div className="dashboard-content">
          {page==='Overview'&&<Overview setPage={setPage} share={()=>setShare(true)}/>}
          {page==='Medical Records'&&<Records items={allRecords} setPage={setPage}/>}
          {page==='Upload Documents'&&<UploadView items={allRecords} onSave={saveRecord}/>}
          {page==='Health Timeline'&&<Timeline />}
          {page==='Health Insights'&&<Insights />}
          {page==='MediBot AI'&&<Assistant />}
          {page==='Medicine Reminders'&&<Reminders />}
          {page==='Family Vault'&&<FamilyVault />}
          {page==='Emergency Health ID'&&<EmergencyId />}
          {page==='Doctor Summary'&&<DoctorSummary />}
          {page==='Duplicate Check'&&<DuplicateCheck />}
          {page==='Shared Records'&&<Sharing />}
          {page==='Settings'&&<SettingsPage />}
        </div>
      </main>
      {panda&&<Panda step={step} setStep={setStep} close={()=>setPanda(false)} />}
      {!panda&&<button className="panda-fab" onClick={()=>setPanda(true)} aria-label="Open PandaBot"><PandaBot size="small" pose="welcome"/><i/></button>}
      {share&&<ShareModal close={()=>setShare(false)}/>}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {nav.slice(0,5).map(([label,Icon]) => (
          <button key={label} className={page===label?'active':''} onClick={()=>setPage(label)} aria-label={label}>
            <Icon size={19}/><span>{label==='MediBot AI'?'MediBot':label==='Health Insights'?'Insights':label==='Health Timeline'?'Timeline':label==='Medical Records'?'Records':'Home'}</span>
          </button>
        ))}
      </nav>
      <AnimatePresence>{toast&&<motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:30,opacity:0}} className="toast"><CheckCircle2 size={18}/>{toast}</motion.div>}</AnimatePresence>
    </div>
  )
}

function Landing({dark,setDark,onStart,onExplore}:{dark:boolean,setDark:(v:boolean)=>void,onStart:()=>void,onExplore:()=>void}) {
  return <div className="landing">
    <nav className="landing-nav"><Logo/><div className="landing-links"><a href="#features">Features</a><a href="#how">How it works</a><a href="#security">Security</a><a href="#about">About</a></div><div className="landing-actions"><button className="icon-button" onClick={()=>setDark(!dark)}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button><button className="sign-in" onClick={onStart}>Sign In</button><button className="primary-button" onClick={onStart}>Get Started</button></div></nav>
    <section className="hero-section">
      <motion.div className="hero-copy" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}><div className="eyebrow"><ShieldCheck size={15}/> Patient-controlled · Healthcare records</div><h1>Your Entire Medical History.<br/><span>One Intelligent Space.</span></h1><p>Prescriptions, laboratory reports, and consultation records — securely organized and accessible whenever you need them.</p><div className="hero-buttons"><button className="primary-button large" onClick={onStart}>Get Started Free <ArrowRight size={18}/></button><button className="secondary-button large" onClick={onExplore}>Explore Features</button></div><div className="trust-row"><div className="trust-avatars"><i><ShieldCheck size={14}/></i></div><div><small>Original demo experience · No real patient data</small></div></div></motion.div>
      <motion.div className="hero-visual" initial={{opacity:0,x:25}} animate={{opacity:1,x:0}}>
        <div className="orb orb-one"/><div className="orb orb-two"/>
        <div className="hero-panda-wrap"><PandaBot size="large" pose="welcome"/><motion.div className="panda-speech" animate={{y:[0,-5,0]}} transition={{repeat:Infinity,duration:3.2}}>Hi! Let’s organize your health story.</motion.div></div>
        <motion.div className="hero-file-card hero-file-one" animate={{y:[0,-7,0],rotate:[-3,-1,-3]}} transition={{repeat:Infinity,duration:4}}><div className="hero-file-icon blue"><FileText size={20}/></div><div><b>Lab report</b><span>Ready to review</span></div><CheckCircle2 size={16}/></motion.div>
        <motion.div className="hero-file-card hero-file-two" animate={{y:[0,7,0],rotate:[3,1,3]}} transition={{repeat:Infinity,duration:4.5}}><div className="hero-file-icon yellow"><CalendarDays size={20}/></div><div><b>Health timeline</b><span>All visits in one place</span></div></motion.div>
      </motion.div>
    </section>
    <section className="feature-strip" id="features"><div className="section-heading"><div className="eyebrow"><Sparkles size={14}/> Everything in one place</div><h2>Built around your health story</h2><p>Secure, intelligent tools that make every medical record easier to manage.</p></div><div className="feature-grid">{[
      ['blue',<Upload key="upload-feature"/>,'Smart document upload','Drag, drop, and let MediVault organize your reports.'],
      ['cyan',<Activity key="timeline-feature"/>,'Interactive timeline','See your complete health journey chronologically.'],
      ['purple',<Bot key="bot-feature"/>,'MediAI assistant','Ask grounded questions with source references.'],
      ['green',<Share2 key="sharing-feature"/>,'Secure sharing','Share only selected records through protected links.'],
    ].map(([tone,icon,title,text])=><motion.div className="feature-card" whileHover={{y:-6}} key={String(title)}><div className={`feature-icon ${tone}`}>{icon}</div><h3>{title}</h3><p>{text}</p><button>Learn more <ArrowRight size={14}/></button></motion.div>)}</div></section>
    <section className="how-section" id="how"><div className="section-heading"><div className="eyebrow"><Activity size={14}/> Simple and secure</div><h2>From upload to understanding</h2></div><div className="how-flow">{['Upload','Extract','Organize','Access','Share'].map((x,i)=><div key={x}><b className={i===0?'active':''}>{i+1}</b><strong>{x}</strong>{i<4&&<ArrowRight/>}</div>)}</div></section>
    <section className="security-section" id="security"><div><div className="eyebrow"><LockKeyhole size={14}/> Privacy first</div><h2>Your health records.<br/>Protected at every step.</h2><p>Built with patient ownership and access control at the core.</p><ul><li><Check/> You control every document</li><li><Check/> Temporary, password-ready sharing</li><li><Check/> No sensitive data in public URLs</li></ul></div><div className="shield-rings"><div/><div/><div className="shield-core"><ShieldCheck size={48}/></div></div></section>
    <footer id="about"><Logo inverse/><p>Your Health Story. Organized. Protected. Always Accessible.</p><div><a>Privacy</a><a>Terms</a><a>Support</a></div><span>© 2026 MediVault</span></footer>
  </div>
}
