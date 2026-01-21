import { useMap } from '../../hooks/useMap'

const TripMap = () => {
  const id = 'trip-map'
  const { ready } = useMap(id)

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Live map</h3>
        <span className="text-xs text-slate-400">{ready ? 'Connected' : 'Initializing...'}</span>
      </div>
      <div id={id} className="h-64 w-full rounded bg-slate-800" />
    </div>
  )
}

export default TripMap
