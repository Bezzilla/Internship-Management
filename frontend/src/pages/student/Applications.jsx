import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const statusConfig = {
  pending:  { cls: 's-pending',  label: 'Pending Review' },
  accepted: { cls: 's-accept',   label: 'Accepted' },
  rejected: { cls: 's-reject',   label: 'Rejected' },
}

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/applications/').then(res => {
      setApplications(res.data)
      setLoading(false)
    })
  }, [])

  const counts = {
    total:    applications.length,
    pending:  applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-title">My Applications</div>
          <div className="page-sub">Track the status of all your internship applications</div>
        </div>
      </div>

      <div className="metric-row">
        <div className="metric">
          <div className="metric-label">Total Applied</div>
          <div className="metric-value">{counts.total}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Under Review</div>
          <div className="metric-value amber">{counts.pending}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Accepted</div>
          <div className="metric-value green">{counts.accepted}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Application History</div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Position</th>
              <th>Date Applied</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>Loading...</td></tr>
            )}
            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={3}>
                  <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <div className="empty-state-title">No applications yet</div>
                    <div className="empty-state-sub">Browse internships and start applying!</div>
                  </div>
                </td>
              </tr>
            )}
            {applications.map(app => {
              const cfg = statusConfig[app.status] || statusConfig.pending
              return (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{app.internship_title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.internship_company}</div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(app.applied_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td>
                    <span className={`status ${cfg.cls}`}>{cfg.label}</span>
                    {app.status === 'accepted' && app.supervisor_email && (
                      <div style={{
                        marginTop: '8px',
                        padding: '10px 12px',
                        background: 'var(--green-light)',
                        border: '1px solid var(--green-border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}>
                        <div style={{ fontWeight: 600, color: 'var(--green)', marginBottom: '4px' }}>
                          🎉 Congratulations! You've been accepted.
                        </div>
                        <div style={{ color: 'var(--text)' }}>
                          Contact your supervisor to get started:
                        </div>
                        <div style={{ marginTop: '4px' }}>
                          <strong>{app.supervisor_name}</strong>
                          {' · '}
                          <a href={`mailto:${app.supervisor_email}`} style={{ color: 'var(--blue)', fontWeight: 500 }}>
                            {app.supervisor_email}
                          </a>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
