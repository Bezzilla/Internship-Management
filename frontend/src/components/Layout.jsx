import { useNavigate, useLocation, Link } from 'react-router-dom'

const SIDEBAR = {
  student: [
    { label: 'Browse Internships', path: '/student/browse',       icon: '🔍' },
    { label: 'My Applications',    path: '/student/applications',  icon: '📋' },
  ],
  supervisor: [
    { label: 'Post Internship',   path: '/supervisor/post',       icon: '➕' },
    { label: 'Review Applicants', path: '/supervisor/applicants', icon: '👥' },
  ],
  admin: [
    { label: 'Approve Listings',  path: '/admin/listings',        icon: '✅' },
  ],
}

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = user.role || 'student'
  const items = SIDEBAR[role] || []
  const initials = (user.first_name?.[0] || user.username?.[0] || '?').toUpperCase()

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const roleLabel = { student: 'Student', supervisor: 'Supervisor', admin: 'Admin' }

  return (
    <>
      <nav className="top-nav">
        <div className="logo">
          <div className="logo-mark">IM</div>
          Internship Management System
        </div>
        <div className="nav-right">
          <div className="nav-user">
            <div className="nav-avatar">{initials}</div>
            <div>
              <div className="nav-username">{user.first_name || user.username}</div>
            </div>
            <span className="nav-role-badge">{roleLabel[role]}</span>
          </div>
          <button className="nav-logout" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div className="app">
        <div className="sidebar">
          <div className="sidebar-section">Menu</div>
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
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
