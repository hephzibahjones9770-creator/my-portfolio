import { prisma } from '@/app/lib/prisma'

export default async function CertificationsPage() {
  const schools = await prisma.school.findMany({ include: { certificates: true } })
  const certificates = schools.flatMap((school) => school.certificates.map((certificate) => ({
    ...certificate,
    schoolName: school.name,
  })))

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Certifications</p>
        <h1 className="mt-2 text-3xl font-bold">Certificates & Achievements</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {certificates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-slate-400 md:col-span-2 xl:col-span-3">
            No certifications yet.
          </div>
        ) : (
          certificates.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-sm text-slate-400">{item.schoolName}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{item.title}</h2>
              <a href={item.fileUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-indigo-400 hover:text-indigo-300">
                View certificate
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
