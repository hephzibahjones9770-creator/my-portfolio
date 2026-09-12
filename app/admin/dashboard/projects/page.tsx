import { prisma } from '@/app/lib/prisma'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { id: 'desc' },
    take: 10,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Projects</p>
          <h1 className="mt-2 text-3xl font-bold">Project Portfolio</h1>
        </div>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-slate-400">
            No projects yet.
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">{project.title}</h2>
                  <p className="mt-2 text-slate-400">{project.description}</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">Published</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
