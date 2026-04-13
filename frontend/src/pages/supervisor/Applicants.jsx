import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const statusConfig = {
  pending:  { cls: 's-pending', label: 'Pending' },
  accepted: { cls: 's-accept',  label: 'Accepted' },
  rejected: { cls: 's-reject',  label: 'Rejected' },
}

export default function Applicants() {
  const [internships, setInternships] = useState([])
  const [selected, setSelected] = useState(null)
  const [applications, setApplications] = useState([])
  const [loadingApps, setLoadingApps] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get('/internships/').then(res => setInternships(res.data))
  }, [])

  const loadApplications = async (internship) => {
    setSelected(internship)
    setLoadingApps(true)
    setSuccess('')
    const res = await api.get(`/applications/internship/${internship.id}/`)
    setApplications(res.data)
    setLoadingApps(false)
  }

  const updateStatus = async (appId, status) => {
    await api.patch(`/applications/${appId}/status/`, { status })
    setSuccess(`Application ${status === 'accepted' ? 'accepted ✓' : 'rejected'}.`)
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a))
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-title">Review Applicants</div>
          <div className="page-sub">Select an internship to view and manage its applicants</div>
        </div>
      </div>

      {success && <div className="success-box">✓ {success}</div>}

      <div className="card">
        <div className="card-header">Your Internship Listings</div>
        <table className="tbl">
          <thead>
            <tr><th>Position</th><th>Company</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {internships.length === 0 && (
              <tr><td colSpan={4}>
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <div className="empty-state-title">No listings yet</div>
                  <div className="empty-state-sub">Post an internship to start receiving applicants.</div>
                </div>
              </td></tr>
            )}
            {internships.map(i => (
              <tr key={i.id}>
                <td><b>{i.title}</b></td>
                <td style={{ color: 'var(--text-muted)' }}>{i.company_name}</td>
                <td>
                  <span className={`status ${i.status === 'approved' ? 's-approved' : i.status === 'rejected' ? 's-reject' : 's-pending'}`}>
                    {i.status === 'pending_approval' ? 'Pending Approval' : i.status === 'approved' ? 'Live' : 'Rejected'}
                  </span>
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${selected?.id === i.id ? 'btn-primary' : ''}`}
                    onClick={() => loadApplications(i)}
                  >
                    {selected?.id === i.id ? 'Viewing' : 'View Applicants'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="card">
          <div className="card-header">
            Applicants — {selected.title}
            <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '12px' }}>{applications.length} applicants</span>
          </div>
          <div>
            {loadingApps && (
              <div className="empty-state"><div className="empty-state-sub">Loading applicants...</div></div>
            )}
            {!loadingApps && applications.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">👤</div>
                <div className="empty-state-title">No applicants yet</div>
                <div className="empty-state-sub">Applications will appear here once students apply.</div>
              </div>
            )}
            {applications.map(app => {
              const cfg = statusConfig[app.status] || statusConfig.pending
              return (
                <div key={app.id} className="check-row">
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'var(--blue-light)', border: '1px solid var(--blue-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 13, color: 'var(--blue)', flexShrink: 0
                    }}
                  >
                    {(app.student_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="check-name">{app.student_name || `Applicant #${app.student}`}</div>
                    <div className="check-meta">Applied on {new Date(app.applied_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div className="check-actions">
                    {app.resume && (
                      <a className="btn btn-sm" href={`http://localhost:8000${app.resume}`} target="_blank" rel="noreferrer">
                        View CV
                      </a>
                    )}
                    <span className={`status ${cfg.cls}`}>{cfg.label}</span>
                    {app.status === 'pending' && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => updateStatus(app.id, 'accepted')}>Accept</button>
                        <button className="btn btn-danger btn-sm" onClick={() => updateStatus(app.id, 'rejected')}>Reject</button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Layout>
  )
}
