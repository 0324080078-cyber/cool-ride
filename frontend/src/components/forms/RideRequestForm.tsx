import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  pickup: z.string().min(2),
  dropoff: z.string().min(2),
  notes: z.string().optional(),
})

export type RideRequestValues = z.infer<typeof schema>

export const RideRequestForm = ({ onSubmit }: { onSubmit: (values: RideRequestValues) => Promise<void> }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RideRequestValues>({ resolver: zodResolver(schema) })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900/70 p-4"
    >
      <div>
        <label className="text-sm text-slate-300">Pickup</label>
        <input
          className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          {...register('pickup')}
        />
        {errors.pickup && <p className="text-xs text-rose-400">{errors.pickup.message}</p>}
      </div>
      <div>
        <label className="text-sm text-slate-300">Dropoff</label>
        <input
          className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          {...register('dropoff')}
        />
        {errors.dropoff && <p className="text-xs text-rose-400">{errors.dropoff.message}</p>}
      </div>
      <div>
        <label className="text-sm text-slate-300">Notes</label>
        <textarea
          className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          rows={3}
          {...register('notes')}
        />
        {errors.notes && <p className="text-xs text-rose-400">{errors.notes.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500 disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting...' : 'Request Ride'}
      </button>
    </form>
  )
}
