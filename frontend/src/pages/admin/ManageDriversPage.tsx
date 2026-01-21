import { useQuery } from '@tanstack/react-query'
import AdminTable from '../../components/admin/AdminTable'
import { adminApi } from '../../utils/api'

interface Driver {
  id: string
  name: string
  status: 'active' | 'offline'
  rating: number
}

const ManageDriversPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const res = await adminApi.get('/admin/drivers')
      return res.data as Driver[]
    },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Drivers</h1>
      {isLoading ? (
        <p className="text-slate-400">Loading drivers...</p>
      ) : (
        <AdminTable
          columns={[
            { header: 'Name', accessor: 'name' },
            { header: 'Status', accessor: 'status' },
            { header: 'Rating', accessor: 'rating' },
          ]}
          data={data ?? []}
        />
      )}
    </div>
  )
}

export default ManageDriversPage
