'use client'

import { useEffect, useState } from 'react'

type ResumeData = {
  profile: {
    name: string
    bio: string | null
  } | null
  education: Array<{
    name: string
    degree: string
    startDate: string
    endDate: string | null
  }>
  skills: Array<{
    name: string
    category: string
    level: number | null
  }>
  projects: Array<{
    title: string
    description: string
    demoUrl: string | null
    githubUrl: string | null
  }>
  certifications: Array<{
    title: string
    schoolName: string
    fileUrl: string
  }>
  achievements: Array<{
    title: string
    description: string | null
    date: string | null
  }>
  experience: Array<{
    company: string
    role: string
    description: string | null
    startDate: string
    endDate: string | null
  }>
}

type SectionKey = 'profile' | 'education' | 'skills' | 'projects' | 'certifications' | 'achievements' | 'experience'
type TemplateKey = 'academic' | 'modern' | 'technical' | 'minimal'

const sectionLabels: Record<SectionKey, string> = {
  profile: 'Profile',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  achievements: 'Achievements',
  experience: 'Experience',
}

const defaultOrder: SectionKey[] = ['profile', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements']
const templates: Array<{ key: TemplateKey; label: string; description: string }> = [
  { key: 'academic', label: 'Academic', description: 'Structured and credentials-first' },
  { key: 'modern', label: 'Modern', description: 'Editorial with clear visual rhythm' },
  { key: 'technical', label: 'Technical', description: 'Dense, scan-friendly and precise' },
  { key: 'minimal', label: 'Minimal', description: 'Quiet typography with maximum clarity' },
]

function readSavedPreferences() {
  const fallback = {
    template: 'modern' as TemplateKey,
    order: defaultOrder,
    enabled: {
      profile: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      achievements: false,
      experience: false,
    } as Record<SectionKey, boolean>,
  }

  if (typeof window === 'undefined') return fallback
  const saved = window.localStorage.getItem('portfolio-resume-builder')
  if (!saved) return fallback

  try {
    const value = JSON.parse(saved) as {
      template?: TemplateKey
      order?: SectionKey[]
      enabled?: Record<SectionKey, boolean>
    }
    return {
      template: value.template && templates.some((item) => item.key === value.template) ? value.template : fallback.template,
      order: value.order?.length === defaultOrder.length ? value.order : fallback.order,
      enabled: value.enabled ? { ...fallback.enabled, ...value.enabled } : fallback.enabled,
    }
  } catch {
    window.localStorage.removeItem('portfolio-resume-builder')
    return fallback
  }
}

export default function ResumeBuilder({ data }: { data: ResumeData }) {
  const savedPreferences = readSavedPreferences()
  const [template, setTemplate] = useState<TemplateKey>(savedPreferences.template)
  const [order, setOrder] = useState<SectionKey[]>(savedPreferences.order)
  const [enabled, setEnabled] = useState<Record<SectionKey, boolean>>(savedPreferences.enabled)

  useEffect(() => {
    window.localStorage.setItem('portfolio-resume-builder', JSON.stringify({ template, order, enabled }))
  }, [template, order, enabled])

  function moveSection(section: SectionKey, direction: -1 | 1) {
    setOrder((current) => {
      const index = current.indexOf(section)
      const nextIndex = index + direction
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current
      const next = [...current]
      ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
      return next
    })
  }

  return (
    <div className="resume-builder space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Resume Engine</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Build a resume from your portfolio</h1>
          <p className="mt-2 max-w-2xl text-slate-400">Select the content, arrange the story, and preview the result before exporting it as a PDF.</p>
        </div>
        <button type="button" onClick={() => window.print()} className="rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
          Generate PDF
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="resume-controls space-y-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Step 1</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Choose template</h2>
              </div>
              <span className="text-xs text-slate-500">{template}</span>
            </div>
            <div className="mt-4 space-y-2">
              {templates.map((item) => (
                <button key={item.key} type="button" onClick={() => setTemplate(item.key)} className={`w-full rounded-xl border p-3 text-left transition ${template === item.key ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-700 hover:border-slate-500'}`}>
                  <span className="block font-medium text-white">{item.label}</span>
                  <span className="mt-1 block text-xs text-slate-400">{item.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Step 2</p>
              <h2 className="mt-1 text-lg font-semibold text-white">Choose and arrange</h2>
            </div>
            <div className="mt-4 space-y-2">
              {order.map((section, index) => (
                <div key={section} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/50 p-2">
                  <span className="select-none px-1 text-slate-500" aria-hidden="true">☰</span>
                  <label className="flex min-w-0 flex-1 items-center gap-2 text-sm text-slate-200">
                    <input type="checkbox" checked={enabled[section]} onChange={(event) => setEnabled((current) => ({ ...current, [section]: event.target.checked }))} className="h-4 w-4 accent-cyan-400" />
                    <span className="truncate">{sectionLabels[section]}</span>
                  </label>
                  <button type="button" title="Move section up" aria-label={`Move ${sectionLabels[section]} up`} disabled={index === 0} onClick={() => moveSection(section, -1)} className="rounded px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30">↑</button>
                  <button type="button" title="Move section down" aria-label={`Move ${sectionLabels[section]} down`} disabled={index === order.length - 1} onClick={() => moveSection(section, 1)} className="rounded px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30">↓</button>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Step 3</p>
              <h2 className="mt-1 text-lg font-semibold text-white">Live preview</h2>
            </div>
            <span className="text-sm text-slate-500">Saved in this browser</span>
          </div>
          <ResumePreview data={data} template={template} order={order} enabled={enabled} />
        </section>
      </div>
    </div>
  )
}

function ResumePreview({ data, template, order, enabled }: { data: ResumeData; template: TemplateKey; order: SectionKey[]; enabled: Record<SectionKey, boolean> }) {
  const templateClass = `resume-paper resume-${template}`
  const profileName = data.profile?.name || 'Your Name'

  return (
    <article className={templateClass} aria-label="Resume preview">
      {order.filter((section) => enabled[section]).map((section) => {
        if (section === 'profile') return <header key={section} className="resume-profile"><h1>{profileName}</h1><p>{data.profile?.bio || 'Add a profile summary from the Profile section.'}</p></header>
        if (section === 'education') return <ResumeSection key={section} title="Education">{data.education.length ? data.education.map((item) => <div key={`${item.name}-${item.degree}`} className="resume-entry"><div><strong>{item.degree}</strong><span>{item.name}</span></div><small>{formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Present'}</small></div>) : <EmptyEntry />}</ResumeSection>
        if (section === 'skills') return <ResumeSection key={section} title="Skills">{data.skills.length ? <div className="resume-skill-list">{data.skills.map((item) => <span key={`${item.category}-${item.name}`}>{item.name}{item.category ? ` · ${item.category}` : ''}</span>)}</div> : <EmptyEntry />}</ResumeSection>
        if (section === 'projects') return <ResumeSection key={section} title="Projects">{data.projects.length ? data.projects.map((item) => <div key={item.title} className="resume-entry"><div><strong>{item.title}</strong><span>{item.description}</span></div><small>{item.githubUrl || item.demoUrl || ''}</small></div>) : <EmptyEntry />}</ResumeSection>
        if (section === 'certifications') return <ResumeSection key={section} title="Certifications">{data.certifications.length ? data.certifications.map((item) => <div key={item.title} className="resume-entry"><div><strong>{item.title}</strong><span>{item.schoolName}</span></div></div>) : <EmptyEntry />}</ResumeSection>
        if (section === 'experience') return <ResumeSection key={section} title="Experience">{data.experience.length ? data.experience.map((item) => <div key={`${item.company}-${item.role}`} className="resume-entry"><div><strong>{item.role}</strong><span>{item.company}{item.description ? ` - ${item.description}` : ''}</span></div><small>{formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Present'}</small></div>) : <EmptyEntry />}</ResumeSection>
        if (section === 'achievements') return <ResumeSection key={section} title="Achievements">{data.achievements.length ? data.achievements.map((item) => <div key={item.title} className="resume-entry"><div><strong>{item.title}</strong><span>{item.description || ''}</span></div><small>{item.date ? formatDate(item.date) : ''}</small></div>) : <EmptyEntry />}</ResumeSection>
        return <ResumeSection key={section} title={sectionLabels[section]}><EmptyEntry /></ResumeSection>
      })}
    </article>
  )
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="resume-section"><h2>{title}</h2>{children}</section>
}

function EmptyEntry() {
  return <p className="resume-empty">No entries added yet.</p>
}

function formatDate(value: string) {
  if (!value) return 'Date not set'
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(value))
}
