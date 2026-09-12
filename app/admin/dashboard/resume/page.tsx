import { prisma } from '@/app/lib/prisma'
import ResumeBuilder from './ResumeBuilder'

export default async function ResumeBuilderPage() {
  const [profile, schools, colleges, skills, projects, achievements, experience] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.school.findMany({
      orderBy: { startDate: 'desc' },
      include: { certificates: true },
    }),
    prisma.college.findMany({ include: { semesters: true } }),
    prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { name: 'asc' }] }),
    prisma.project.findMany({ orderBy: { title: 'asc' } }),
    prisma.achievement.findMany({ orderBy: { date: 'desc' } }),
    prisma.experience.findMany({ orderBy: { startDate: 'desc' } }),
  ])

  const education = [
    ...schools.map((school) => ({
      name: school.name,
      degree: school.degree,
      startDate: school.startDate.toISOString(),
      endDate: school.endDate?.toISOString() ?? null,
    })),
    ...colleges.map((college) => ({
      name: college.name,
      degree: college.degree,
      startDate: '',
      endDate: null,
    })),
  ]

  const certifications = schools.flatMap((school) =>
    school.certificates.map((certificate) => ({
      title: certificate.title,
      schoolName: school.name,
      fileUrl: certificate.fileUrl,
    })),
  )

  return (
    <ResumeBuilder
      data={{
        profile: profile ? { name: profile.name, bio: profile.bio } : null,
        education,
        skills,
        projects,
        certifications,
        achievements: achievements.map((item) => ({
          title: item.title,
          description: item.description,
          date: item.date?.toISOString() ?? null,
        })),
        experience: experience.map((item) => ({
          company: item.company,
          role: item.role,
          description: item.description,
          startDate: item.startDate.toISOString(),
          endDate: item.endDate?.toISOString() ?? null,
        })),
      }}
    />
  )
}
