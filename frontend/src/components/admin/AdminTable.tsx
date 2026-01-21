interface Column<T> {
  header: string
  accessor: keyof T
}

interface AdminTableProps<T> {
  columns: Column<T>[]
  data: T[]
}

const AdminTable = <T extends { id: string }>({ columns, data }: AdminTableProps<T>) => (
  <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70">
    <table className="min-w-full divide-y divide-slate-800">
      <thead className="bg-slate-950">
        <tr>
          {columns.map((col) => (
            <th key={String(col.accessor)} className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-slate-800/50">
            {columns.map((col) => (
              <td key={String(col.accessor)} className="px-4 py-3 text-sm text-slate-200">
                {String(row[col.accessor])}
              </td>
            ))}
          </tr>
        ))}
        {!data.length && (
          <tr>
            <td className="px-4 py-3 text-sm text-slate-400" colSpan={columns.length}>
              No records found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

export default AdminTable
