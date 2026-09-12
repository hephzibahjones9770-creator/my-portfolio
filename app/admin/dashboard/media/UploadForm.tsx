'use client'

import { useState } from 'react'

export default function UploadForm() {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(formData: FormData) {
    setBusy(true)
    setMessage('')
    const response = await fetch('/api/admin/media', { method: 'POST', body: formData })
    const result = await response.json() as { error?: string }
    setMessage(response.ok ? 'Upload complete. Refresh to see the file.' : result.error || 'Upload failed.')
    setBusy(false)
  }

  return <form action={submit} className="flex flex-wrap items-center gap-3"><input name="file" type="file" required accept="image/*,video/mp4,application/pdf,.ppt,.pptx,.doc,.docx" className="max-w-full text-sm text-slate-300" /><button disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Uploading...' : 'Upload file'}</button>{message && <p className="basis-full text-sm text-slate-400">{message}</p>}</form>
}
