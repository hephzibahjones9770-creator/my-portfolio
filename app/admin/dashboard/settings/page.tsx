import { prisma } from '@/app/lib/prisma'
import SettingsForm from './SettingsForm'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'site' },
    create: { id: 'site' },
    update: {},
  })

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Settings</p>
        <h1 className="mt-2 text-3xl font-bold">Portfolio control center</h1>
      </div>

      <SettingsForm settings={settings} />
    </div>
  )
}
