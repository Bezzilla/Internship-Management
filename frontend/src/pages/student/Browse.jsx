import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

export default function Browse() {
  const [internships, setInternships] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(null)
  const [expanded, setExpanded] = useState(null)
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
      await api.post('/applications/apply/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess(`Successfully applied to ${internship.title}!`)
      setApplying(null)
      setResume(null)
    } catch (err) {
      setError(err.response?.data?.detail || Object.values(err.response?.data || {}).flat().join(' ') || 'Failed to apply.')
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-title">Browse Internships</div>
          <div className="page-sub">{filtered.length} positions available — find your next opportunity</div>
        </div>
      </div>

      {success && <div className="success-box">✓ {success}</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="search-row">
        <input
          className="search-input"
          placeholder="🔍  Search by role, company, or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="card-header">
          Available Positions
          <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '12px' }}>{filtered.length} results</span>
        </div>
        <div>
          {loading && (
            <div className="empty-state">
              <div className="empty-state-sub">Loading internships...</div>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-title">No internships found</div>
              <div className="empty-state-sub">Try a different search or check back later.</div>
            </div>
          )}
          {filtered.map(item => {
            const isExpanded = expanded === item.id
            return (
              <div key={item.id} className="intern-item" style={{ flexDirection: 'column', alignItems: 'stretch', cursor: 'pointer', gap: 0 }}
                onClick={() => setExpanded(isExpanded ? null : item.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {item.logo ? (
                    <img src={item.logo} alt="logo" style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} />
                  ) : (
                    <div className="company-mark">{item.company_name.slice(0, 2).toUpperCase()}</div>
                  )}
                  <div className="intern-info" style={{ flex: 1 }}>
                    <div className="intern-title">{item.title}</div>
                    <div className="intern-company">{item.company_name}</div>
                    <div className="intern-meta">📍 {item.location} &nbsp;·&nbsp; ⏱ {item.duration} &nbsp;·&nbsp; 📅 Deadline: {item.deadline}</div>
                    <div className="tags">
                      <span className="tag">{item.location}</span>
                      <span className="tag">{item.duration}</span>
                    </div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '18px', paddingRight: '4px' }}>{isExpanded ? '▲' : '▼'}</div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}
                    onClick={e => e.stopPropagation()}>
                    {item.description && (
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.6' }}>{item.description}</p>
                    )}
                    <div className="intern-actions" style={{ justifyContent: 'flex-end' }}>
                      {applying === item.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                          <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Upload Resume (PDF)</label>
                          <input type="file" accept=".pdf" onChange={e => setResume(e.target.files[0])} style={{ fontSize: '12px' }} />
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-sm" onClick={() => { setApplying(null); setError('') }}>Cancel</button>
                            <button className="btn btn-primary btn-sm" onClick={() => handleApply(item)}>Submit Application</button>
                          </div>
                        </div>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => { setApplying(item.id); setError(''); setSuccess('') }}>
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
