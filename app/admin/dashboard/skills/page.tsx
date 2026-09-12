import { prisma } from '@/app/lib/prisma'

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Skills</p>
          <h1 className="mt-2 text-3xl font-bold">Skill Library</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {skills.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-slate-400 md:col-span-2 xl:col-span-3">
            No skills yet.
          </div>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{skill.name}</h2>
                <span className="rounded-full bg-violet-500/10 px-2 py-1 text-xs text-violet-400">{skill.level ?? 0}%</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{skill.category}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
