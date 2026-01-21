import { useEffect, useState } from 'react'

export const useMap = (containerId: string) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Placeholder map integration, ready for Google Maps/Mapbox swap
    const container = document.getElementById(containerId)
    if (!container) return
    container.innerHTML = '<div style=\"height:100%;display:flex;align-items:center;justify-content:center;color:#9ca3af;\">Map placeholder (hook ready for Maps API)</div>'
    setReady(true)
  }, [containerId])

  return { ready }
}
