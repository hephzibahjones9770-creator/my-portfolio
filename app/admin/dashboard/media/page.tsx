import { prisma } from '@/app/lib/prisma'
import UploadForm from './UploadForm'

export default async function MediaPage() {
  const media = await prisma.mediaItem.findMany({
    orderBy: { uploadedAt: 'desc' },
    take: 20,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Media</p>
          <h1 className="mt-2 text-3xl font-bold">Media Library</h1>
        </div>

        <UploadForm />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {['Images', 'Videos', 'Documents', 'Presentations', 'PDFs'].map((section) => (
          <div key={section} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-400">{section}</p>
            <p className="mt-3 text-2xl font-bold text-white">
              {media.filter((item) => item.category === section.toLowerCase().replace(/s$/, '')).length}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold text-white">Uploaded Files</h2>

        <div className="mt-5 space-y-3">
          {media.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-6 text-slate-400">
              No files uploaded yet.
            </div>
          ) : (
            media.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">
                    {item.type} • {item.size} bytes • {item.category}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <span className={`rounded-full px-2 py-1 ${item.public ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>
                    {item.public ? 'Public' : 'Private'}
                  </span>
                  <span className="text-slate-400">{item.usedBy ?? 'Not linked'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
