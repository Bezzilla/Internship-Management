import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

export default function Applicants() {
  const [internships, setInternships] = useState([])
  const [selected, setSelected] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get('/internships/').then(res => setInternships(res.data))
  }, [])

  const loadApplications = async (internshipId) => {
    setSelected(internshipId)
    setLoading(true)
    const res = await api.get(`/applications/internship/${internshipId}/`)
    setApplications(res.data)
    setLoading(false)
  }

  const updateStatus = async (appId, status) => {
    await api.patch(`/applications/${appId}/status/`, { status })
    setSuccess(`Application ${status}.`)
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a))
  }

  const statusClass = { pending: 's-pending', accepted: 's-accept', rejected: 's-reject' }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-title">Review applicants</div>
          <div className="page-sub">Select an internship to view its applicants</div>
        </div>
      </div>
      <div className="arch-callout">
        <span className="label">PATCH</span>
        /api/applications/{'<id>'}/status/ → updates status: pending → accepted | rejected
      </div>

      {success && <div className="success-box">{success}</div>}

      {/* Internship selector */}
      <div className="card mb-16">
        <div className="card-header">your internship listings</div>
        <table className="tbl">
          <thead><tr><th>Position</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {internships.length === 0 && (
              <tr><td colSpan={3} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>no listings yet.</td></tr>
            )}
            {internships.map(i => (
              <tr key={i.id}>
                <td><b>{i.title}</b><br /><span className="text-muted" style={{ fontSize: '12px' }}>{i.company_name}</span></td>
                <td><span className={`status ${i.status === 'approved' ? 's-approved' : 's-pending'}`}>{i.status}</span></td>
                <td>
                  <button className={`btn btn-sm ${selected === i.id ? 'btn-primary' : ''}`} onClick={() => loadApplications(i.id)}>
                    View applicants
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Applications list */}
      {selected && (
        <div className="card">
          <div className="card-header">applicants</div>
          <div>
            {loading && <div style={{ padding: '16px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>loading...</div>}
            {!loading && applications.length === 0 && (
              <div style={{ padding: '16px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>no applications yet.</div>
            )}
            {applications.map(app => (
              <div key={app.id} className="check-row">
                <div style={{ flex: 1 }}>
                  <div className="check-name">{app.student_name || app.student}</div>
                  <div className="check-meta">applied: {new Date(app.applied_at).toLocaleDateString()}</div>
                </div>
                <div className="check-actions">
                  {app.resume && (
                    <a className="btn btn-sm" href={`http://localhost:8000${app.resume}`} target="_blank" rel="noreferrer">
                      View CV
                    </a>
                  )}
                  <span className={`status ${statusClass[app.status]}`}>{app.status}</span>
                  {app.status === 'pending' && (
                    <>
                      <button className="btn btn-success btn-sm" onClick={() => updateStatus(app.id, 'accepted')}>Accept</button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateStatus(app.id, 'rejected')}>Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}
