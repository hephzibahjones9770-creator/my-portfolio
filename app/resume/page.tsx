import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import PrintButton from './PrintButton'
import { trackEvent } from '@/app/lib/telemetry'

export const dynamic = 'force-dynamic'

function year(value: Date | null) {
  return value ? new Intl.DateTimeFormat('en', { year: 'numeric' }).format(value) : 'Present'
}

export default async function PublicResumePage() {
  await trackEvent('resume_view', '/resume')
  const [profile, schools, colleges, skills, projects, achievements, experience] = await Promise.all([
    prisma.profile.findFirst({ where: { published: true } }),
    prisma.school.findMany({ where: { published: true }, orderBy: { startDate: 'desc' } }),
    prisma.college.findMany({ where: { published: true }, orderBy: { name: 'asc' } }),
    prisma.skill.findMany({ where: { published: true }, orderBy: [{ category: 'asc' }, { name: 'asc' }] }),
    prisma.project.findMany({ where: { published: true }, orderBy: { title: 'asc' } }),
    prisma.achievement.findMany({ where: { published: true }, orderBy: { date: 'desc' } }),
    prisma.experience.findMany({ where: { published: true }, orderBy: { startDate: 'desc' } }),
  ])

  return (
    <main className="public-resume-page">
      <div className="public-resume-toolbar"><Link href="/">← Portfolio</Link><PrintButton /></div>
      <article className="public-resume-paper">
        <header className="public-resume-header"><div><p className="eyebrow">Curriculum vitae</p><h1>{profile?.name || 'Your Name'}</h1><p>{profile?.bio || 'Technology, research, and creative problem solving.'}</p></div><span>Selected<br />work & study</span></header>
        <div className="public-resume-columns">
          <div>
            <ResumeSection title="Experience">{experience.map((item) => <ResumeEntry key={item.id} title={item.role} subtitle={item.company} date={`${year(item.startDate)} — ${year(item.endDate)}`} description={item.description} />)}</ResumeSection>
            <ResumeSection title="Projects">{projects.map((item) => <ResumeEntry key={item.id} title={item.title} description={item.description} />)}</ResumeSection>
            <ResumeSection title="Achievements">{achievements.map((item) => <ResumeEntry key={item.id} title={item.title} date={item.date ? year(item.date) : undefined} description={item.description} />)}</ResumeSection>
          </div>
          <div>
            <ResumeSection title="Education">{schools.map((item) => <ResumeEntry key={item.id} title={item.degree} subtitle={item.name} date={`${year(item.startDate)} — ${year(item.endDate)}`} />)}{colleges.map((item) => <ResumeEntry key={item.id} title={item.degree} subtitle={item.name} />)}</ResumeSection>
            <ResumeSection title="Skills"><div className="public-resume-skills">{skills.map((item) => <span key={item.id}>{item.name}</span>)}</div></ResumeSection>
          </div>
        </div>
      </article>
    </main>
  )
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="public-resume-section"><h2>{title}</h2>{children || <p className="muted-copy">No published entries.</p>}</section>
}

function ResumeEntry({ title, subtitle, date, description }: { title: string; subtitle?: string; date?: string; description?: string | null }) {
  return <div className="public-resume-entry"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}{description && <p>{description}</p>}</div>{date && <time>{date}</time>}</div>
}
