import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import '../styles/design.css'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login/', form)
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
      const me = await api.get('/auth/me/')
      localStorage.setItem('user', JSON.stringify(me.data))
      const role = me.data.role
      if (role === 'student') navigate('/student/browse')
      else if (role === 'supervisor') navigate('/supervisor/post')
      else if (role === 'admin') navigate('/admin/listings')
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-mark">IH</div>
          InternHub
        </div>
        <div className="auth-title">Sign in</div>
        <div className="auth-sub">Access your internship dashboard</div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">username</label>
            <input className="form-input" name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">password</label>
            <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: '9px' }} type="submit" disabled={loading}>
            {loading ? 'signing in...' : 'sign in →'}
          </button>
        </form>

        <div className="auth-footer">
          no account? <Link to="/register">register here</Link>
        </div>
      </div>
    </div>
  )
}
