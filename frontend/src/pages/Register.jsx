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
      const msg = data ? Object.values(data).flat().join(' ') : 'Registration failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-logo">
          <div className="logo-mark">IH</div>
          InternHub
        </div>
        <div className="auth-title">Create account</div>
        <div className="auth-sub">Join the internship platform</div>

        {error && <div className="error-box">{error}</div>}

        {/* Role picker */}
        <div className="role-picker">
          <div className={`role-option ${role === 'student' ? 'selected' : ''}`} onClick={() => setRole('student')}>
            <div className="role-option-title">Student</div>
            <div className="role-option-sub">browse & apply</div>
          </div>
          <div className={`role-option ${role === 'supervisor' ? 'selected' : ''}`} onClick={() => setRole('supervisor')}>
            <div className="role-option-title">Company</div>
            <div className="role-option-sub">post internships</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {role === 'student' ? (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">first name</label>
                  <input className="form-input" name="first_name" value={form.first_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">last name</label>
                  <input className="form-input" name="last_name" value={form.last_name} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">university email *</label>
                <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">faculty / department</label>
                  <input className="form-input" name="faculty" value={form.faculty} onChange={handleChange} placeholder="e.g. Engineering" />
                </div>
                <div className="form-group">
                  <label className="form-label">year of study</label>
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
                <label className="form-label">company name *</label>
                <input className="form-input" name="company_name" value={form.company_name} onChange={handleChange} required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">contact person (first)</label>
                  <input className="form-input" name="first_name" value={form.first_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">contact person (last)</label>
                  <input className="form-input" name="last_name" value={form.last_name} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">work email *</label>
                <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">industry / field</label>
                <input className="form-input" name="industry" value={form.industry} onChange={handleChange} placeholder="e.g. Technology" />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">username *</label>
            <input className="form-input" name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">password *</label>
              <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">confirm password *</label>
              <input className="form-input" type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} required />
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '9px' }} type="submit" disabled={loading}>
            {loading ? 'creating account...' : 'create account →'}
          </button>
        </form>

        <div className="auth-footer">
          already have an account? <Link to="/login">sign in</Link>
        </div>
      </div>
    </div>
  )
}
