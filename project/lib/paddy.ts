export type DiseaseClass = {
  id: number
  name: string
  healthy: boolean
}

// Class mapping must be verified against the trained CNN model before HARDWARE mode.
export const DISEASE_CLASSES: DiseaseClass[] = [
  { id: 0, name: 'Bacterial leaf blight', healthy: false },
  { id: 1, name: 'Bacterial leaf streak', healthy: false },
  { id: 2, name: 'Bacterial panicle blight', healthy: false },
  { id: 3, name: 'Blast', healthy: false },
  { id: 4, name: 'Brown spot', healthy: false },
  { id: 5, name: 'Dead heart', healthy: false },
  { id: 6, name: 'Downy mildew', healthy: false },
  { id: 7, name: 'Hispa', healthy: false },
  { id: 8, name: 'Normal / Healthy', healthy: true },
  { id: 9, name: 'Tungro', healthy: false },
]

export function getDisease(classId: number) {
  return DISEASE_CLASSES.find((d) => d.id === classId) ?? DISEASE_CLASSES[8]
}

export type SystemMode = 'DEMO' | 'HARDWARE'
export type InferenceStatus = 'completed' | 'queued' | 'running' | 'failed'
export type HardwareSource = 'ASIC' | 'Mock gateway'
export type AlertSeverity = 'critical' | 'warning' | 'info'

export function healthRatio(healthy: number, totalValid: number) {
  if (totalValid === 0) return 0
  return (healthy / totalValid) * 100
}
