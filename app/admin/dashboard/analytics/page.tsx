import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

const metricLabels: Record<string, string> = {
  visitor: 'Visitors',
  project_view: 'Project views',
  resume_view: 'Resume views',
  resume_download: 'Resume downloads',
  certificate_view: 'Certificate views',
}

export default async function AnalyticsPage() {
  const [groups, recent] = await Promise.all([
    prisma.analyticsEvent.groupBy({ by: ['type'], _count: { _all: true }, orderBy: { _count: { type: 'desc' } } }),
    prisma.analyticsEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 12 }),
  ])

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4"><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Analytics</p><h1 className="mt-2 text-3xl font-bold">Portfolio performance</h1><p className="mt-2 text-slate-400">Views and downloads captured from the public experience.</p></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{Object.keys(metricLabels).map((type) => { const item = groups.find((group) => group.type === type); return <div key={type} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-sm text-slate-400">{metricLabels[type]}</p><p className="mt-3 text-4xl font-bold text-cyan-400">{item?._count._all ?? 0}</p></div> })}</div>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"><h2 className="text-xl font-semibold">Recent events</h2><div className="mt-4 divide-y divide-slate-800">{recent.length ? recent.map((event) => <div key={event.id} className="flex items-center justify-between py-3 text-sm"><span className="text-slate-300">{metricLabels[event.type] || event.type}</span><span className="text-slate-500">{event.path || event.entityId || 'Portfolio'} · {event.createdAt.toLocaleString()}</span></div>) : <p className="py-3 text-slate-400">No analytics events yet.</p>}</div></section>
    </div>
  )
}
