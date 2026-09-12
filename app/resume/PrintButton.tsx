'use client'

export default function PrintButton() {
  return <button type="button" data-resume-download onClick={() => window.print()}>Print / Save PDF ↗</button>
}
