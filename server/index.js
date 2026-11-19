import crypto from 'crypto'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import rateLimit from 'express-rate-limit'

const app = express()
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173' }))
app.use(express.json({ limit: '1mb' }))

const sensitiveLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true })
app.use('/api/auth', sensitiveLimit)
app.use('/api/emergency', sensitiveLimit)
app.use('/api/ai', sensitiveLimit)

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true })

const familySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  adult: { type: Boolean, default: true },
  consent: { type: Boolean, default: false },
  permissions: {
    upload: Boolean,
    view: Boolean,
    share: Boolean,
  },
}, { timestamps: true })

const labSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', default: null, index: true },
  testName: { type: String, required: true },
  value: { type: String, required: true },
  unit: { type: String, required: true },
  referenceRange: String,
  testDate: { type: Date, required: true },
  laboratory: String,
  sourceDocumentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  extractionConfidence: { type: Number, min: 0, max: 1 },
  verified: { type: Boolean, default: false },
}, { timestamps: true })

const medicationSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', default: null, index: true },
  name: { type: String, required: true },
  dosage: String,
  frequency: String,
  startDate: Date,
  endDate: Date,
  reminderTimes: [String],
  instructions: String,
  confirmedByPatient: { type: Boolean, default: false },
}, { timestamps: true })

const emergencySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  consent: { type: Boolean, required: true, default: false },
  approvedFields: [String],
  tokenHash: { type: String, select: false },
  expiresAt: Date,
  revokedAt: Date,
}, { timestamps: true })

const auditSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true },
  resourceType: String,
  resourceId: String,
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', userSchema)
const Family = mongoose.models.Family || mongoose.model('Family', familySchema)
const Lab = mongoose.models.Lab || mongoose.model('Lab', labSchema)
const Medication = mongoose.models.Medication || mongoose.model('Medication', medicationSchema)
const Emergency = mongoose.models.Emergency || mongoose.model('Emergency', emergencySchema)
const Audit = mongoose.models.Audit || mongoose.model('Audit', auditSchema)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png']
    cb(allowed.includes(file.mimetype) ? null : new Error('Unsupported file type'), allowed.includes(file.mimetype))
  },
})

function signToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured')
  return jwt.sign({ sub: String(user._id) }, process.env.JWT_SECRET, { expiresIn: '30m' })
}

async function auth(req, res, next) {
  try {
    if (!process.env.JWT_SECRET) return res.status(503).json({ error: 'Authentication is not configured' })
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' })
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ error: 'User unavailable' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' })
  }
}

async function audit(ownerId, action, resourceType, resourceId, metadata) {
  await Audit.create({ ownerId, action, resourceType, resourceId, metadata })
}

app.get('/api/health', (_req, res) => res.json({
  status: 'ok',
  database: mongoose.connection.readyState === 1 ? 'connected' : 'not configured',
}))

app.post('/api/auth/register', async (req, res) => {
  try {
    if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) return res.status(503).json({ error: 'Database and authentication are not configured' })
    const { name, email, password } = req.body
    if (!name || typeof name !== 'string' || !email || typeof email !== 'string' || typeof password !== 'string' || password.length < 12) {
      return res.status(400).json({ error: 'Valid name, email, and a 12-character password are required' })
    }
    if (await User.findOne({ email: email.toLowerCase().trim() })) return res.status(409).json({ error: 'Account already exists' })
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash: await bcrypt.hash(password, 12) })
    await audit(user._id, 'auth.register', 'user', String(user._id))
    res.status(201).json({ token: signToken(user), user: { id: String(user._id), name: user.name, email: user.email } })
  } catch {
    res.status(400).json({ error: 'Registration could not be completed' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) return res.status(503).json({ error: 'Database and authentication are not configured' })
  const { email, password } = req.body
  const user = await User.findOne({ email: email?.toLowerCase().trim() }).select('+passwordHash')
  if (!user || !await bcrypt.compare(password || '', user.passwordHash)) return res.status(401).json({ error: 'Invalid credentials' })
  await audit(user._id, 'auth.login', 'user', String(user._id))
  res.json({ token: signToken(user), user: { id: String(user._id), name: user.name, email: user.email } })
})

app.post('/api/records/upload', auth, upload.array('files', 10), async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: 'At least one supported file is required' })
  await audit(req.user._id, 'record.upload_requested', 'medical_record', null, { fileCount: req.files.length })
  res.status(202).json({ status: 'received', files: req.files.map(file => ({ name: file.originalname, size: file.size })) })
})

app.get('/api/family', auth, async (req, res) => res.json(await Family.find({ ownerId: req.user._id })))
app.post('/api/family', auth, async (req, res) => {
  const { name, relationship, adult = true, consent = false } = req.body
  if (!name || !relationship) return res.status(400).json({ error: 'Name and relationship are required' })
  if (adult && !consent) return res.status(400).json({ error: 'Adult family member consent is required' })
  const profile = await Family.create({ ownerId: req.user._id, name, relationship, adult, consent, permissions: { upload: false, view: false, share: false } })
  await audit(req.user._id, 'family.create', 'family', String(profile._id))
  res.status(201).json(profile)
})

app.get('/api/labs', auth, async (req, res) => {
  const observations = await Lab.find({ ownerId: req.user._id, verified: true })
  res.json(observations)
})

app.post('/api/labs', auth, async (req, res) => {
  const observation = await Lab.create({ ...req.body, ownerId: req.user._id, verified: false })
  await audit(req.user._id, 'lab.create', 'laboratory_observation', String(observation._id))
  res.status(201).json(observation)
})

app.get('/api/reminders', auth, async (req, res) => res.json(await Medication.find({ ownerId: req.user._id })))
app.post('/api/reminders', auth, async (req, res) => {
  if (!req.body.confirmedByPatient) return res.status(400).json({ error: 'Patient confirmation is required before activation' })
  const medication = await Medication.create({ ...req.body, ownerId: req.user._id })
  await audit(req.user._id, 'medication.create', 'medication', String(medication._id))
  res.status(201).json(medication)
})

app.post('/api/emergency', auth, async (req, res) => {
  if (!req.body.consent) return res.status(400).json({ error: 'Explicit consent is required' })
  const token = crypto.randomBytes(32).toString('base64url')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + (Number(req.body.expirationHours) || 24) * 60 * 60 * 1000)
  const profile = await Emergency.findOneAndUpdate(
    { ownerId: req.user._id },
    { consent: true, approvedFields: req.body.approvedFields || [], tokenHash, expiresAt, revokedAt: null },
    { upsert: true, new: true },
  )
  await audit(req.user._id, 'emergency.activate', 'emergency_profile', String(profile._id))
  res.status(201).json({ token, expiresAt })
})

app.post('/api/emergency/revoke', auth, async (req, res) => {
  await Emergency.findOneAndUpdate({ ownerId: req.user._id }, { revokedAt: new Date() })
  await audit(req.user._id, 'emergency.revoke', 'emergency_profile')
  res.json({ revoked: true })
})

app.get('/api/emergency/public/:token', async (req, res) => {
  const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const profile = await Emergency.findOne({ tokenHash, consent: true, revokedAt: null, expiresAt: { $gt: new Date() } }).select('+approvedFields')
  if (!profile) return res.status(404).json({ error: 'Emergency access is unavailable' })
  res.json({ approvedFields: profile.approvedFields })
})

app.post('/api/ai/chat', auth, async (_req, res) => res.status(503).json({
  error: 'AI provider is not configured',
  setupRequired: ['OPENAI_API_KEY or approved provider credentials', 'VECTOR_STORE_URL', 'RAG_INDEX_ID'],
}))

app.post('/api/summaries/metadata', auth, async (req, res) => {
  if (!Array.isArray(req.body.recordIds) || req.body.recordIds.length === 0) return res.status(400).json({ error: 'At least one record must be selected' })
  await audit(req.user._id, 'summary.generate_requested', 'summary', null, { recordCount: req.body.recordIds.length })
  res.status(202).json({ status: 'PDF generation service must be configured', recordCount: req.body.recordIds.length })
})

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) return res.status(400).json({ error: 'Invalid file upload' })
  res.status(error.message === 'Unsupported file type' ? 415 : 400).json({ error: error.message || 'Request could not be completed' })
})

const port = Number(process.env.PORT) || 8787
async function start() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI)
  }
  app.listen(port, '127.0.0.1', () => console.log(`MediVault API listening on http://127.0.0.1:${port}`))
}

start().catch(error => {
  console.error('MediVault API failed to start:', error.message)
  process.exit(1)
})
