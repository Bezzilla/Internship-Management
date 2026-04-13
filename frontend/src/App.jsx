import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/student/Browse'
import Applications from './pages/student/Applications'
import PostInternship from './pages/supervisor/PostInternship'
import Applicants from './pages/supervisor/Applicants'
import Listings from './pages/admin/Listings'

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('access_token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!token) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student/browse" element={<PrivateRoute role="student"><Browse /></PrivateRoute>} />
        <Route path="/student/applications" element={<PrivateRoute role="student"><Applications /></PrivateRoute>} />

        <Route path="/supervisor/post" element={<PrivateRoute role="supervisor"><PostInternship /></PrivateRoute>} />
        <Route path="/supervisor/applicants" element={<PrivateRoute role="supervisor"><Applicants /></PrivateRoute>} />

        <Route path="/admin/listings" element={<PrivateRoute role="admin"><Listings /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
