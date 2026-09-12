import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ActivityPage() {
  const activity = await prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })

  return <div className="space-y-6"><div className="border-b border-slate-800 pb-4"><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Activity log</p><h1 className="mt-2 text-3xl font-bold">What changed</h1></div><section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"><div className="divide-y divide-slate-800">{activity.length ? activity.map((item) => <div className="flex items-center justify-between gap-4 py-4" key={item.id}><div><p className="font-medium text-slate-200">{item.action}</p><p className="mt-1 text-xs text-slate-500">{item.entityType}{item.entityId ? ` · ${item.entityId}` : ''}</p></div><time className="text-xs text-slate-500">{item.createdAt.toLocaleString()}</time></div>) : <p className="text-slate-400">No activity recorded yet.</p>}</div></section></div>
}
