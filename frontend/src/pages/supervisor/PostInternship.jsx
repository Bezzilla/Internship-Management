import { useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

export default function PostInternship() {
  const [form, setForm] = useState({
    title: '', company_name: '', location: '',
    duration: '', deadline: '', description: '',
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    setLoading(true)
    try {
      await api.post('/internships/create/', form)
      setSuccess('Internship submitted for admin approval.')
      setForm({ title: '', company_name: '', location: '', duration: '', deadline: '', description: '' })
    } catch (err) {
      const data = err.response?.data
      setError(data ? Object.values(data).flat().join(' ') : 'Failed to post internship.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-title">Post internship</div>
          <div className="page-sub">Submitted listings require admin approval before going live</div>
        </div>
      </div>
      <div className="arch-callout">
        <span className="label">POST</span>
        /api/internships/create/ → creates listing with status="pending_approval"
      </div>

      {success && <div className="success-box">{success}</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">position title *</label>
                <input className="form-input" name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">company name *</label>
                <input className="form-input" name="company_name" value={form.company_name} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">location *</label>
                <input className="form-input" name="location" value={form.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">duration</label>
                <input className="form-input" name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 months" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">application deadline *</label>
              <input className="form-input" type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">description *</label>
              <textarea className="form-input" name="description" value={form.description} onChange={handleChange} required rows={4} />
            </div>
            <div className="flex justify-end">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'submitting...' : 'Submit for approval →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
