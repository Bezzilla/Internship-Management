import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import '../styles/design.css'

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirm_password: '',
    first_name: '', last_name: '',
    faculty: '', year_of_study: '',
    company_name: '', industry: '', phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const payload = { ...form, role }
      delete payload.confirm_password
      await api.post('/auth/register/', payload)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      const msg = data ? Object.values(data).flat().join(' ') : 'Registration failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container" style={{ padding: '20px 0' }}>
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-logo">
          <div className="logo-mark">IM</div>
          Internship Management System
        </div>
        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Join the platform to find or post internships</div>

        {error && <div className="error-box">{error}</div>}

        <div className="role-picker">
          <div className={`role-option ${role === 'student' ? 'selected' : ''}`} onClick={() => setRole('student')}>
            <div className="role-option-icon">🎓</div>
            <div className="role-option-title">Student</div>
            <div className="role-option-sub">Browse & apply for internships</div>
          </div>
          <div className={`role-option ${role === 'supervisor' ? 'selected' : ''}`} onClick={() => setRole('supervisor')}>
            <div className="role-option-icon">🏢</div>
            <div className="role-option-title">Supervisor</div>
            <div className="role-option-sub">Post & manage internships</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {role === 'student' ? (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last name" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">University Email *</label>
                <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@university.edu" required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Faculty / Department</label>
                  <input className="form-input" name="faculty" value={form.faculty} onChange={handleChange} placeholder="e.g. Engineering" />
                </div>
                <div className="form-group">
                  <label className="form-label">Year of Study</label>
                  <select className="form-input" name="year_of_study" value={form.year_of_study} onChange={handleChange}>
                    <option value="">Select year</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input className="form-input" name="company_name" value={form.company_name} onChange={handleChange} placeholder="e.g. Acme Corp" required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Contact First Name</label>
                  <input className="form-input" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Last Name</label>
                  <input className="form-input" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last name" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Work Email *</label>
                <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Industry / Field</label>
                <input className="form-input" name="industry" value={form.industry} onChange={handleChange} placeholder="e.g. Technology, Finance" />
              </div>
            </>
          )}

          <div className="divider" />

          <div className="form-group">
            <label className="form-label">Username *</label>
            <input className="form-input" name="username" value={form.username} onChange={handleChange} placeholder="Choose a username" required />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className="form-input" type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} placeholder="Repeat password" required />
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '14px' }} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
