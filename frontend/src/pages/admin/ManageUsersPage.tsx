import { useQuery } from '@tanstack/react-query'
import AdminTable from '../../components/admin/AdminTable'
import { adminApi } from '../../utils/api'

interface User {
  id: string
  name: string
  email: string
  role: string
}

const ManageUsersPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await adminApi.get('/admin/users')
      return res.data as User[]
    },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Users</h1>
      {isLoading ? (
        <p className="text-slate-400">Loading users...</p>
      ) : (
        <AdminTable
          columns={[
            { header: 'Name', accessor: 'name' },
            { header: 'Email', accessor: 'email' },
            { header: 'Role', accessor: 'role' },
          ]}
          data={data ?? []}
        />
      )}
    </div>
  )
}

export default ManageUsersPage
