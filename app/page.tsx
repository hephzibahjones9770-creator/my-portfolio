import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import { sendContactMessage } from '@/actions/contact'
import { trackEvent } from '@/app/lib/telemetry'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'site' } })
  return {
    title: settings?.siteTitle || 'Portfolio | Ideas into useful things',
    description: settings?.siteDescription || 'A portfolio of technology, research, and creative work.',
    openGraph: {
      title: settings?.siteTitle || 'Portfolio | Ideas into useful things',
      description: settings?.siteDescription || 'A portfolio of technology, research, and creative work.',
      images: settings?.socialImageUrl ? [settings.socialImageUrl] : undefined,
    },
  }
}

function formatYear(value: Date | null) {
  return value ? new Intl.DateTimeFormat('en', { year: 'numeric' }).format(value) : 'Present'
}

export default async function Home() {
  await trackEvent('visitor', '/')
  const [profile, schools, colleges, skills, projects, achievements, experience, media, settings] = await Promise.all([
    prisma.profile.findFirst({ where: { published: true } }),
    prisma.school.findMany({ where: { published: true }, include: { certificates: { where: { published: true } } }, orderBy: { startDate: 'desc' } }),
    prisma.college.findMany({ where: { published: true }, orderBy: { name: 'asc' } }),
    prisma.skill.findMany({ where: { published: true }, orderBy: [{ category: 'asc' }, { name: 'asc' }] }),
    prisma.project.findMany({ where: { published: true }, orderBy: { title: 'asc' } }),
    prisma.achievement.findMany({ where: { published: true }, orderBy: { date: 'desc' } }),
    prisma.experience.findMany({ where: { published: true }, orderBy: { startDate: 'desc' } }),
    prisma.mediaItem.findMany({ where: { public: true }, orderBy: { uploadedAt: 'desc' } }),
    prisma.siteSettings.findUnique({ where: { id: 'site' } }),
  ])

  const displayName = profile?.name || 'Your Name'
  const credentials = schools.flatMap((school) => school.certificates)

  return (
    <main className={`public-site ${settings?.animations === false ? 'public-no-motion' : ''} ${settings?.backgroundEffects === false ? 'public-no-effects' : ''}`} style={{ '--primary-color': settings?.primaryColor || '#3d7cff', '--accent-color': settings?.accentColor || '#7fe6e1' } as React.CSSProperties}>
      <nav className="site-nav" aria-label="Primary navigation">
        <Link href="#home" className="brand-mark"><span>◎</span> {displayName}</Link>
        <div className="nav-links"><a href="#about">About</a><a href="#work">Work</a><a href="#education">Education</a><a href="#contact">Contact</a></div>
        <a href="#contact" className="nav-cta">Let&apos;s talk <span>↗</span></a>
      </nav>

      <section id="home" className="hero-section site-shell">
        <div className="hero-copy"><p className="eyebrow">Portfolio / 2026</p><h1>Building useful things at the edge of <em>ideas.</em></h1><p className="hero-intro">{profile?.bio || 'A thoughtful portfolio for work across technology, research, and creative problem solving.'}</p><div className="hero-actions"><a href="#work" className="button button-primary">Explore my work <span>↓</span></a><a href="/resume" className="button button-quiet">View dynamic resume <span>↗</span></a></div></div>
        <div className="hero-orbit" aria-hidden="true"><div className="orbit-ring orbit-ring-one" /><div className="orbit-ring orbit-ring-two" /><div className="orbit-core"><span>01</span><strong>CURIOUS<br />BY DEFAULT</strong></div></div>
        <div className="hero-footnote"><span>Based in the digital / physical overlap</span><span>Scroll to discover ↓</span></div>
      </section>

      <section id="about" className="about-section site-shell section-spacing"><div className="section-index">01 / About me</div><div className="about-grid"><h2>Ideas become<br /><em>real</em> when they<br />meet rigor.</h2><div><p className="section-lead">I work between creative direction and technical execution, turning complex questions into clear, considered experiences.</p><div className="stat-row"><div><strong>{projects.length.toString().padStart(2, '0')}</strong><span>Selected projects</span></div><div><strong>{skills.length.toString().padStart(2, '0')}</strong><span>Tools & skills</span></div><div><strong>{experience.length.toString().padStart(2, '0')}</strong><span>Experiences</span></div></div></div></div></section>

      <section id="work" className="work-section section-band section-spacing"><div className="site-shell"><div className="section-heading"><div><div className="section-index">02 / Selected work</div><h2>Things I&apos;ve <em>made.</em></h2></div><span className="section-count">{projects.length.toString().padStart(2, '0')} projects</span></div><div className="project-grid">{projects.length ? projects.map((project, index) => <article className="project-card" key={project.id}><div className={`project-visual project-visual-${index % 3}`}>{project.imageUrl ? <img src={project.imageUrl} alt="" /> : <span>0{index + 1}</span>}<div className="project-visual-label">Case study / {String(index + 1).padStart(2, '0')}</div></div><div className="project-meta"><div><p className="project-kicker">{index % 2 ? 'Product / Systems' : 'Research / Digital'}</p><h3>{project.title}</h3><p>{project.description}</p></div><div className="project-links">{project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer">Live demo ↗</a>}{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}{project.videoUrl && <a href={project.videoUrl} target="_blank" rel="noreferrer">Video ↗</a>}{project.pptUrl && <a href={project.pptUrl} target="_blank" rel="noreferrer">PPT ↗</a>}{project.otherLinks.map((link) => <a key={link} href={link} target="_blank" rel="noreferrer">More ↗</a>)}</div></div></article>) : <EmptyState label="Published projects will appear here." />}</div></div></section>

      <section id="education" className="education-section site-shell section-spacing"><div className="section-index">03 / The foundation</div><div className="section-heading"><h2>Learning in <em>public.</em></h2><span className="section-count">Education & credentials</span></div><div className="timeline-grid"><div className="timeline-column">{[...schools, ...colleges].length ? schools.map((school) => <div className="timeline-item" key={school.id}><span className="timeline-dot" /><div><p>{formatYear(school.startDate)} — {formatYear(school.endDate)}</p><h3>{school.degree}</h3><span>{school.name}</span></div></div>).concat(colleges.map((college) => <div className="timeline-item" key={college.id}><span className="timeline-dot" /><div><p>Academic record</p><h3>{college.degree}</h3><span>{college.name}</span></div></div>)) : <EmptyState label="Published education will appear here." />}</div><div className="credential-list"><p className="project-kicker">Certifications</p>{credentials.length ? credentials.map((certificate) => <a className="credential-item" href={certificate.fileUrl} target="_blank" rel="noreferrer" key={certificate.id}><span>{certificate.title}</span><b>↗</b></a>) : <p className="muted-copy">Published certifications will appear here.</p>}</div></div></section>

      <section className="skills-section section-band section-spacing"><div className="site-shell"><div className="section-index">04 / The toolkit</div><div className="skills-layout"><h2>Tools for<br /><em>thinking + making.</em></h2><div className="skill-cloud">{skills.length ? skills.map((skill) => <span key={skill.id}>{skill.name}<small>{skill.category}</small></span>) : <EmptyState label="Published skills will appear here." />}</div></div></div></section>

      <section className="experience-section site-shell section-spacing"><div className="section-index">05 / Along the way</div><div className="experience-grid"><h2>Experience<br />with <em>intention.</em></h2><div>{experience.length ? experience.map((item) => <div className="experience-item" key={item.id}><div><p>{formatYear(item.startDate)} — {formatYear(item.endDate)}</p><h3>{item.role}</h3><span>{item.company}</span></div><p>{item.description}</p></div>) : <EmptyState label="Published experience will appear here." />}</div></div></section>

      <section className="achievement-section section-band section-spacing"><div className="site-shell"><div className="section-index">06 / Beyond the brief</div><div className="section-heading"><h2>Small wins, <em>big energy.</em></h2></div><div className="achievement-grid">{achievements.length ? achievements.map((item) => <article key={item.id}><span>{item.date ? formatYear(item.date) : 'Achievement'}</span><h3>{item.title}</h3><p>{item.description}</p>{item.url && <a href={item.url} target="_blank" rel="noreferrer">Read more ↗</a>}</article>) : <EmptyState label="Published achievements will appear here." />}</div></div></section>

      {media.length > 0 && <section className="media-strip site-shell section-spacing"><div className="section-index">07 / Field notes</div><div className="media-grid">{media.slice(0, 4).map((item) => <a href={item.url} target="_blank" rel="noreferrer" key={item.id}><img src={item.url} alt={item.description || item.name} /><span>{item.name} ↗</span></a>)}</div></section>}

      <section id="contact" className="contact-section site-shell section-spacing"><div className="contact-heading"><div className="section-index">08 / Contact</div><h2>Have a good<br /><em>question?</em></h2><p>Tell me what you&apos;re building, learning, or wondering about.</p></div><form action={sendContactMessage} className="contact-form"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" required placeholder="you@example.com" /></label><label>Message<textarea name="message" required rows={5} placeholder="Start a conversation..." /></label><button type="submit" className="button button-primary">Send message <span>↗</span></button></form></section>
      <footer className="site-footer site-shell"><span>{displayName} / Portfolio</span><span>Made with curiosity & care</span><a href="#home">Back to top ↑</a></footer>
    </main>
  )
}

function EmptyState({ label }: { label: string }) {
  return <p className="empty-public-state">{label}</p>
}
