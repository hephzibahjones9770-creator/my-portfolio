import { prisma } from '@/app/lib/prisma'

export default async function ProfilePage() {
  const profile = await prisma.profile.findFirst()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Profile</p>
          <h1 className="mt-2 text-3xl font-bold">Profile Management</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-400">Name</p>
            <p className="mt-1 text-xl font-semibold text-white">{profile?.name ?? 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Resume URL</p>
            <p className="mt-1 text-xl font-semibold text-white">{profile?.resumeUrl ?? 'Not set'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-slate-400">Bio</p>
            <p className="mt-1 text-white">{profile?.bio ?? 'No bio yet.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
