import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="space-y-4 text-center text-slate-200">
    <h1 className="text-3xl font-bold">404 - Not found</h1>
    <p className="text-slate-400">The page you are looking for does not exist.</p>
    <Link className="text-indigo-400 underline" to="/">
      Back home
    </Link>
  </div>
)

export default NotFoundPage
