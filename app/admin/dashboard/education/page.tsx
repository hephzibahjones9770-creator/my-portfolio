import { prisma } from '@/app/lib/prisma'

export default async function EducationPage() {
  const schools = await prisma.school.findMany({
    include: { certificates: true },
  })
  const colleges = await prisma.college.findMany({
    include: { semesters: true },
  })

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Education</p>
        <h1 className="mt-2 text-3xl font-bold">Education & Academic History</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold text-white">Schools</h2>
          <div className="mt-4 space-y-4">
            {schools.length === 0 ? (
              <p className="text-slate-400">No schools added yet.</p>
            ) : (
              schools.map((school) => (
                <div key={school.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <h3 className="text-lg font-semibold text-white">{school.name}</h3>
                  <p className="text-slate-400">{school.degree}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {new Date(school.startDate).toLocaleDateString()} - {school.endDate ? new Date(school.endDate).toLocaleDateString() : 'Present'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {school.certificates.map((certificate) => (
                      <span key={certificate.id} className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                        {certificate.title}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold text-white">Colleges</h2>
          <div className="mt-4 space-y-4">
            {colleges.length === 0 ? (
              <p className="text-slate-400">No college records yet.</p>
            ) : (
              colleges.map((college) => (
                <div key={college.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <h3 className="text-lg font-semibold text-white">{college.name}</h3>
                  <p className="text-slate-400">{college.degree}</p>
                  <div className="mt-3 space-y-2">
                    {college.semesters.map((semester) => (
                      <div key={semester.id} className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">
                        Semester {semester.number} • GPA {semester.gpa ?? 'N/A'}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
