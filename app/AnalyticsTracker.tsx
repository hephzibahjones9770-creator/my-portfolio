'use client'

import { useEffect } from 'react'

export default function AnalyticsTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest('a,button') : null
      if (!target) return

      let type: string | undefined
      if (target.closest('.project-links')) type = 'project_view'
      if (target.closest('.credential-item')) type = 'certificate_view'
      if (target.matches('a[href="/resume"]')) type = 'resume_view'
      if (target.matches('[data-resume-download]')) type = 'resume_download'
      if (!type) return

      void fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, path: window.location.pathname }),
        keepalive: true,
      })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
