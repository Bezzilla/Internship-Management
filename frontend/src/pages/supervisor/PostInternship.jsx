import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

export default function PostInternship() {
  const [form, setForm] = useState({
    title: '', company_name: '', location: '',
    duration: '', deadline: '', description: '',
  })
  const [listings, setListings] = useState([])
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/internships/').then(res => setListings(res.data))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    setLogo(file)
    setLogoPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      if (logo) formData.append('logo', logo)
      const res = await api.post('/internships/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess('Your internship has been submitted and is pending admin approval.')
      setListings(prev => [res.data, ...prev])
      setForm({ title: '', company_name: '', location: '', duration: '', deadline: '', description: '' })
      setLogo(null); setLogoPreview(null)
    } catch (err) {
      const data = err.response?.data
      setError(data ? Object.values(data).flat().join(' ') : 'Failed to post internship.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    await api.delete(`/internships/${id}/delete/`)
    setListings(prev => prev.filter(i => i.id !== id))
    setSuccess('Listing deleted.')
  }

  const statusLabel = {
    pending_approval: 'Pending Approval',
    approved: 'Live',
    rejected: 'Rejected',
  }
  const statusCls = {
    pending_approval: 's-pending',
    approved: 's-approved',
    rejected: 's-reject',
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
            <div className="form-group">
              <label className="form-label">Company Logo <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional, PNG/JPG)</span></label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {logoPreview ? (
                  <img src={logoPreview} alt="logo preview" style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                ) : (
                  <div className="company-mark" style={{ flexShrink: 0 }}>IMG</div>
                )}
                <input type="file" accept="image/*" onChange={handleLogoChange} style={{ fontSize: '13px' }} />
              </div>
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

      {/* My Listings */}
      <div className="card">
        <div className="card-header">
          My Listings
          <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '12px' }}>{listings.length} total</span>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Position</th>
              <th>Location</th>
              <th>Deadline</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>No listings yet.</td></tr>
            )}
            {listings.map(item => (
              <tr key={item.id}>
                <td><b>{item.title}</b><br /><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.company_name}</span></td>
                <td style={{ color: 'var(--text-muted)' }}>{item.location}</td>
                <td style={{ color: 'var(--text-muted)' }}>{item.deadline}</td>
                <td><span className={`status ${statusCls[item.status]}`}>{statusLabel[item.status]}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
