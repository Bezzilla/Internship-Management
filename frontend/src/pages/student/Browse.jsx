import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

export default function Browse() {
  const [internships, setInternships] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(null)
  const [resume, setResume] = useState(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/internships/').then(res => {
      setInternships(res.data)
      setLoading(false)
    })
  }, [])

  const filtered = internships.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.company_name.toLowerCase().includes(search.toLowerCase())
  )

  const handleApply = async (internship) => {
    if (!resume) { setError('Please select a resume file.'); return }
    setError('')
    const formData = new FormData()
    formData.append('internship', internship.id)
    formData.append('resume', resume)
    try {
      await api.post('/applications/apply/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSuccess(`Applied to ${internship.title} successfully!`)
      setApplying(null)
      setResume(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to apply.')
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-title">Browse internships</div>
          <div className="page-sub">{filtered.length} positions available</div>
        </div>
      </div>
      <div className="arch-callout">
        <span className="label">GET</span>
        /api/internships/ → returns only admin-approved listings
      </div>

      {success && <div className="success-box">{success}</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="search-row">
        <input
          className="search-input"
          placeholder="Search by role or company..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="card-header">listings</div>
        <div>
          {loading && <div style={{ padding: '16px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>loading...</div>}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: '16px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>no internships found.</div>
          )}
          {filtered.map(item => (
            <div key={item.id} className="intern-item">
              <div className="company-mark">{item.company_name.slice(0, 2).toUpperCase()}</div>
              <div className="intern-info">
                <div className="intern-title">{item.title}</div>
                <div className="intern-meta">{item.company_name} · {item.location} · {item.duration}</div>
                <div className="tags">
                  <span className="tag">{item.location}</span>
                  <span className="tag">deadline: {item.deadline}</span>
                </div>
              </div>
              <div className="intern-actions">
                {applying === item.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                    <input type="file" accept=".pdf" onChange={e => setResume(e.target.files[0])} style={{ fontSize: '11px' }} />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-sm" onClick={() => setApplying(null)}>cancel</button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleApply(item)}>submit →</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => { setApplying(item.id); setError(''); setSuccess('') }}>
                    Apply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
