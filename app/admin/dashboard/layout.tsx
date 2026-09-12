import Link from 'next/link'
import { logoutAction } from '@/actions/auth'

export const dynamic = 'force-dynamic'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/dashboard/profile', label: 'Profile' },
  { href: '/admin/dashboard/education', label: 'Education' },
  { href: '/admin/dashboard/skills', label: 'Skills' },
  { href: '/admin/dashboard/projects', label: 'Projects' },
  { href: '/admin/dashboard/resume', label: 'Resume Builder' },
  { href: '/admin/dashboard/analytics', label: 'Analytics' },
  { href: '/admin/dashboard/activity', label: 'Activity Log' },
  { href: '/admin/dashboard/media', label: 'Media Library' },
  { href: '/admin/dashboard/certifications', label: 'Certifications' },
  { href: '/admin/dashboard/settings', label: 'Settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Portfolio</h2>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/70 hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <form action={logoutAction} className="pt-4">
              <button
                type="submit"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-red-400"
              >
                Logout
              </button>
            </form>
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
