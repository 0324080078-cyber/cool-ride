import { useEffect } from 'react'
import { useUIStore } from '../store/uiStore'

export const useRealtime = () => {
  const addNotification = useUIStore((s) => s.addNotification)

  useEffect(() => {
    let ws: WebSocket | null = null
    try {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:4000/ws'
      ws = new WebSocket(wsUrl)
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data?.type === 'ride:update') {
          addNotification(`Ride update: ${data.message}`, 'info')
        }
      }
    } catch (e) {
      console.error('WebSocket error', e)
    }

    return () => {
      ws?.close()
    }
  }, [addNotification])
}
