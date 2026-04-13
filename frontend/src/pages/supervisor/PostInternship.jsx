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
      setSuccess('Your internship has been submitted and is pending admin approval.')
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
          <div className="page-title">Post an Internship</div>
          <div className="page-sub">Fill in the details below. Your listing will go live after admin approval.</div>
        </div>
      </div>

      {success && <div className="success-box">✓ {success}</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="card">
        <div className="card-header">Internship Details</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Position Title *</label>
                <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Software Engineering Intern" required />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input className="form-input" name="company_name" value={form.company_name} onChange={handleChange} placeholder="e.g. Acme Corp" required />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input className="form-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangkok, Thailand" required />
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input className="form-input" name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 months" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Application Deadline *</label>
              <input className="form-input" type="date" name="deadline" value={form.deadline} onChange={handleChange} required style={{ maxWidth: '240px' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-input" name="description" value={form.description} onChange={handleChange} required rows={5} placeholder="Describe the role, responsibilities, and requirements..." />
            </div>
            <div className="divider" />
            <div className="flex justify-end gap-8">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit for Approval →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
