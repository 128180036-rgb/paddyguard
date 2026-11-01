import type { AlertSeverity, HardwareSource, InferenceStatus, SystemMode } from './paddy'

// Demonstration dataset. In production every value here is served by the FastAPI backend
// (/api/dashboard/*, /api/inference/history, /api/notifications). Results come from the
// mock hardware gateway and must never be presented as real ASIC output.
export const SYSTEM_MODE: SystemMode = 'DEMO'

export const currentUser = {
  name: 'Anika Perera',
  initials: 'AP',
  email: 'anika.perera@paddyguard.ai',
  phone: '+94 77 123 4567',
  role: 'Admin' as const,
  organization: 'Kurunegala Agro Cooperative',
  location: 'Kurunegala, Sri Lanka',
  memberSince: 'March 2026',
  verified: true,
}

export const summary = {
  totalImages: 12_486,
  healthy: 9_872,
  diseased: 2_361,
  invalid: 253,
  activeAlerts: 7,
  robotsOnline: 3,
  robotsTotal: 4,
  gatewayStatus: 'Connected' as const,
  gatewayLastHeartbeat: '12s ago',
  asicStatus: 'Mock adapter' as const,
  jobsQueued: 4,
  deltas: {
    totalImages: 8.2,
    healthy: 6.1,
    diseased: -3.4,
    ratio: 1.7,
  },
}

export const healthTrend = [
  { date: 'Oct 19', ratio: 77.4 },
  { date: 'Oct 20', ratio: 78.1 },
  { date: 'Oct 21', ratio: 76.3 },
  { date: 'Oct 22', ratio: 75.2 },
  { date: 'Oct 23', ratio: 77.9 },
  { date: 'Oct 24', ratio: 79.6 },
  { date: 'Oct 25', ratio: 80.4 },
  { date: 'Oct 26', ratio: 79.1 },
  { date: 'Oct 27', ratio: 78.4 },
  { date: 'Oct 28', ratio: 80.9 },
  { date: 'Oct 29', ratio: 81.6 },
  { date: 'Oct 30', ratio: 82.2 },
  { date: 'Oct 31', ratio: 80.7 },
  { date: 'Nov 01', ratio: 80.7 },
]

export const diseaseDistribution = [
  { name: 'Brown spot', count: 612 },
  { name: 'Blast', count: 498 },
  { name: 'Bacterial leaf blight', count: 384 },
  { name: 'Hispa', count: 271 },
  { name: 'Tungro', count: 196 },
  { name: 'Dead heart', count: 148 },
  { name: 'Bacterial leaf streak', count: 117 },
  { name: 'Downy mildew', count: 82 },
  { name: 'Bacterial panicle blight', count: 53 },
]

export const dailySamples = [
  { day: 'Mon', healthy: 742, diseased: 168 },
  { day: 'Tue', healthy: 815, diseased: 192 },
  { day: 'Wed', healthy: 690, diseased: 211 },
  { day: 'Thu', healthy: 884, diseased: 176 },
  { day: 'Fri', healthy: 921, diseased: 158 },
  { day: 'Sat', healthy: 610, diseased: 139 },
  { day: 'Sun', healthy: 548, diseased: 121 },
]

export const processingActivity = [
  { hour: '06:00', uploaded: 42, processed: 40 },
  { hour: '08:00', uploaded: 118, processed: 112 },
  { hour: '10:00', uploaded: 164, processed: 160 },
  { hour: '12:00', uploaded: 96, processed: 96 },
  { hour: '14:00', uploaded: 151, processed: 147 },
  { hour: '16:00', uploaded: 138, processed: 131 },
  { hour: '18:00', uploaded: 64, processed: 60 },
]

export type Detection = {
  id: string
  jobId: string
  image: string
  classId: number
  robot: string
  field: string
  capturedAt: string
  status: InferenceStatus
  source: HardwareSource
  durationMs: number | null
}

export const recentDetections: Detection[] = [
  { id: 'img_8f21', jobId: 'job_4c19', image: '/images/leaf-blast.png', classId: 3, robot: 'Robot-01', field: 'Field-A North', capturedAt: '10:42', status: 'completed', source: 'Mock gateway', durationMs: 18 },
  { id: 'img_8f20', jobId: 'job_4c18', image: '/images/leaf-healthy.png', classId: 8, robot: 'Robot-02', field: 'Field-B East', capturedAt: '10:39', status: 'completed', source: 'Mock gateway', durationMs: 17 },
  { id: 'img_8f1f', jobId: 'job_4c17', image: '/images/leaf-brown-spot.png', classId: 4, robot: 'Robot-01', field: 'Field-A North', capturedAt: '10:35', status: 'completed', source: 'Mock gateway', durationMs: 19 },
  { id: 'img_8f1e', jobId: 'job_4c16', image: '/images/leaf-blight.png', classId: 0, robot: 'Robot-03', field: 'Field-C South', capturedAt: '10:31', status: 'running', source: 'Mock gateway', durationMs: null },
  { id: 'img_8f1d', jobId: 'job_4c15', image: '/images/leaf-healthy.png', classId: 8, robot: 'Robot-02', field: 'Field-B East', capturedAt: '10:28', status: 'queued', source: 'Mock gateway', durationMs: null },
  { id: 'img_8f1c', jobId: 'job_4c14', image: '/images/leaf-brown-spot.png', classId: 4, robot: 'Robot-03', field: 'Field-C South', capturedAt: '10:22', status: 'failed', source: 'Mock gateway', durationMs: null },
]

export type AlertItem = {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  time: string
  channels: string
}

export const recentAlerts: AlertItem[] = [
  { id: 'al1', title: 'Blast detected', description: 'Robot-01 · Field-A North', severity: 'critical', time: '4 min ago', channels: 'Email sent · SMS sent' },
  { id: 'al2', title: 'Inference job retried 3×', description: 'job_4c14 · checksum mismatch', severity: 'warning', time: '18 min ago', channels: 'Email sent' },
  { id: 'al3', title: 'Robot-04 offline', description: 'No heartbeat for 22 minutes', severity: 'warning', time: '22 min ago', channels: 'Email sent · SMS failed' },
  { id: 'al4', title: 'Health ratio above 80%', description: 'Field-B East recovered', severity: 'info', time: '1 h ago', channels: 'In-app only' },
]

export const activity = [
  { id: 'a1', text: 'Gateway kv260-lab-01 claimed job_4c16', time: '10:31:04' },
  { id: 'a2', text: 'Image img_8f1e quantized (profile qp-v0.3, unverified)', time: '10:31:02' },
  { id: 'a3', text: 'Robot-03 uploaded 12 images', time: '10:30:47' },
  { id: 'a4', text: 'Notification batch delivered to 3 recipients', time: '10:27:15' },
  { id: 'a5', text: 'Technician R. Silva ran gateway diagnostics', time: '10:12:58' },
]

export const hardware = {
  gateway: { name: 'kv260-lab-01', status: 'Connected', firmware: 'gw-0.4.2', heartbeat: '12s ago' },
  fpga: { status: 'Bitstream loaded', detail: 'Mock adapter — PL not attached' },
  asic: { status: 'Not fabricated', detail: 'RTL-to-GDS + LVS complete · fabrication planned' },
  currentJob: { id: 'job_4c16', transferred: 8_192, total: 12_288 },
}

export const robots = [
  { id: 'R-01', name: 'Robot-01', status: 'online' as const, battery: 82 },
  { id: 'R-02', name: 'Robot-02', status: 'online' as const, battery: 64 },
  { id: 'R-03', name: 'Robot-03', status: 'online' as const, battery: 41 },
  { id: 'R-04', name: 'Robot-04', status: 'offline' as const, battery: null },
]

export const fields = [
  { id: 'f1', name: 'Field-A North', location: 'Kurunegala · 4.2 ha', robots: 1 },
  { id: 'f2', name: 'Field-B East', location: 'Kurunegala · 3.6 ha', robots: 2 },
  { id: 'f3', name: 'Field-C South', location: 'Polonnaruwa · 5.1 ha', robots: 1 },
]
