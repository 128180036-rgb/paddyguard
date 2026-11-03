'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { CheckCircle2, Upload, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { DISEASE_CLASSES, getDisease } from '@/lib/paddy'
import { toast } from 'sonner'

type FileItem = {
  id: string
  file: File
  preview: string
  status: 'pending' | 'processing' | 'done' | 'error'
  classId?: number
  durationMs?: number
  error?: string
}

function mockInfer(): { classId: number; durationMs: number } {
  const classId = Math.random() < 0.79 ? 8 : Math.floor(Math.random() * 8)
  return { classId, durationMs: 15 + Math.floor(Math.random() * 10) }
}

export default function UploadPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<FileItem[]>([])
  const [running, setRunning] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (!arr.length) return
    const next: FileItem[] = arr.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      preview: URL.createObjectURL(f),
      status: 'pending',
    }))
    setItems((prev) => [...prev, ...next])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }, [])

  function removeItem(id: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) URL.revokeObjectURL(item.preview)
      return prev.filter((i) => i.id !== id)
    })
  }

  async function processAll() {
    const pending = items.filter((i) => i.status === 'pending')
    if (!pending.length || !user) return
    setRunning(true)

    const supabase = createClient()

    for (const item of pending) {
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: 'processing' } : i))

      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400))
      const { classId, durationMs } = mockInfer()
      const disease = getDisease(classId)
      const jobId = `job_${Math.random().toString(36).slice(2, 8)}`

      const { error } = await supabase.from('detections').insert({
        image_url: item.preview,
        class_id: classId,
        class_name: disease.name,
        healthy: disease.healthy,
        status: 'completed',
        source: 'Mock gateway',
        duration_ms: durationMs,
        job_id: jobId,
      })

      setItems((prev) => prev.map((i) =>
        i.id === item.id
          ? { ...i, status: error ? 'error' : 'done', classId, durationMs, error: error?.message }
          : i
      ))
    }

    setRunning(false)
    toast.success('Processing complete')
  }

  const pendingCount = items.filter((i) => i.status === 'pending').length
  const doneCount = items.filter((i) => i.status === 'done').length
  const processingItem = items.find((i) => i.status === 'processing')

  return (
    <>
      <PageHeader
        title="Upload & Process"
        description="Upload paddy leaf images for disease classification via the mock hardware gateway."
        actions={
          <Button onClick={processAll} disabled={running || !pendingCount}>
            <Upload data-icon="inline-start" />
            {running ? 'Processing…' : `Process ${pendingCount || ''} image${pendingCount !== 1 ? 's' : ''}`}
          </Button>
        }
      />

      {/* Drop zone */}
      <label
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors ${dragOver ? 'border-primary bg-secondary/50' : 'border-border hover:border-primary/50 hover:bg-muted/40'}`}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
          <Upload className="size-5" />
        </span>
        <div>
          <p className="font-medium">Drag &amp; drop images here</p>
          <p className="text-sm text-muted-foreground">or click to browse · JPG, PNG, WebP</p>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </label>

      {/* Processing progress */}
      {running && processingItem && (
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
              <Image src={processingItem.preview} alt="" fill className="object-cover" unoptimized />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-sm font-medium">Classifying {processingItem.file.name}…</p>
              <Progress value={undefined} className="h-1.5" aria-label="Processing" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results grid */}
      {items.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{items.length} image{items.length !== 1 ? 's' : ''} · {doneCount} classified</p>
            <Button variant="ghost" size="sm" onClick={() => setItems([])}>Clear all</Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => {
              const disease = item.classId !== undefined ? getDisease(item.classId) : null
              return (
                <div key={item.id} className="group relative flex flex-col gap-2 rounded-xl border bg-card p-2">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <Image src={item.preview} alt={item.file.name} fill className="object-cover" unoptimized />
                    {item.status === 'processing' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                        <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    )}
                    {item.status === 'done' && (
                      <CheckCircle2 className="absolute right-1.5 top-1.5 size-4 text-success drop-shadow" />
                    )}
                    {item.status === 'error' && (
                      <AlertTriangle className="absolute right-1.5 top-1.5 size-4 text-destructive drop-shadow" />
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute right-1 top-1 hidden size-5 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 ring-1 ring-border transition-opacity hover:text-foreground group-hover:flex group-hover:opacity-100"
                    aria-label="Remove"
                  >
                    <X className="size-3" />
                  </button>
                  <div className="min-w-0 px-0.5 pb-0.5">
                    <p className="truncate text-xs font-medium">{item.file.name}</p>
                    {disease ? (
                      <StatusBadge tone={disease.healthy ? 'success' : 'critical'} className="mt-1 text-[10px]">
                        {disease.name}
                      </StatusBadge>
                    ) : item.status === 'pending' ? (
                      <span className="mt-1 text-xs text-muted-foreground">Pending</span>
                    ) : null}
                    {item.durationMs && (
                      <p className="font-mono text-[10px] text-muted-foreground">{item.durationMs} ms</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
