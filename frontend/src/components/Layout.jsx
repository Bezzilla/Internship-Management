import { useNavigate, useLocation, Link } from 'react-router-dom'

const SIDEBAR_ITEMS = {
  student: [
    { label: 'Browse Internships', path: '/student/browse', dot: false },
    { label: 'My Applications',    path: '/student/applications', dot: true },
  ],
  supervisor: [
    { label: 'Post Internship',    path: '/supervisor/post', dot: false },
    { label: 'Review Applicants',  path: '/supervisor/applicants', dot: true },
  ],
  admin: [
    { label: 'Approve Listings',   path: '/admin/listings', dot: true },
  ],
}

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = user.role || 'student'
  const items = SIDEBAR_ITEMS[role] || []

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <>
      <nav className="top-nav">
        <div className="logo">
          <div className="logo-mark">IH</div>
          InternHub
        </div>
        <div className="nav-right">
          <span className="nav-role">role: {role} · {user.username}</span>
          <button className="nav-logout" onClick={logout}>logout</button>
        </div>
      </nav>

      <div className="app">
        <div className="sidebar">
          <div className="sidebar-role">{role}</div>
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
              {item.dot && <span className="sidebar-dot" />}
            </Link>
          ))}
        </div>

        <div className="content">
          {children}
        </div>
      </div>
    </>
  )
}
