interface StatCardProps {
  title: string
  value: string | number
  description?: string
}

const StatCard = ({ title, value, description }: StatCardProps) => (
  <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 shadow">
    <p className="text-sm text-slate-400">{title}</p>
    <p className="text-2xl font-semibold text-white">{value}</p>
    {description && <p className="text-xs text-slate-500">{description}</p>}
  </div>
)

export default StatCard
