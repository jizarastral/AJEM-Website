'use client'

import { useEffect } from 'react'

export default function RootPage() {
  useEffect(() => {
    window.location.replace('/show/')
  }, [])

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        background: '#101418',
        color: '#F3F0E8',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <a href="/show/" style={{ color: '#F3F0E8', fontSize: '18px' }}>
        Enter the AJEM site
      </a>
    </main>
  )
}
