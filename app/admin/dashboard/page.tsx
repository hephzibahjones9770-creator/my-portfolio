'use client'

import { logoutAction } from '@/actions/auth'

const sidebarItems = [
  'Dashboard',
  'Profile',
  'Education',
  'Skills',
  'Projects',
  'Achievements',
  'Certifications',
  'Resume Builder',
  'Contact',
  'Media Library',
  'Settings',
]

const stats = [
  { label: 'Projects', value: '12', accent: 'text-cyan-400' },
  { label: 'Skills', value: '18', accent: 'text-violet-400' },
  { label: 'Certificates', value: '8', accent: 'text-emerald-400' },
]

const recentActivity = [
  'Updated portfolio profile',
  'Published new project case study',
  'Added new certification',
  'Refreshed resume preview',
]

const portfolioStatus = [
  { label: 'Published', value: 'Live', tone: 'text-emerald-400' },
  { label: 'Drafts', value: '3', tone: 'text-amber-400' },
  { label: 'Private', value: '2', tone: 'text-slate-300' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Portfolio</h2>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={item}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Overview</p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Dashboard</h1>
            </div>

            <button
              onClick={() => logoutAction()}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-red-400"
            >
              Logout Session
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/30"
              >
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className={`mt-4 text-4xl font-bold ${item.accent}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold text-slate-200">Recent Activity</h3>
              <div className="mt-5 space-y-4">
                {recentActivity.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3"
                  >
                    <span className="text-slate-300">{item}</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold text-slate-200">Portfolio Status</h3>
              <div className="mt-5 space-y-4">
                {portfolioStatus.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-slate-300">{item.label}</span>
                    <span className={`font-semibold ${item.tone}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
