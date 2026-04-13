import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const statusClass = { pending: 's-pending', accepted: 's-accept', rejected: 's-reject' }
const statusLabel = { pending: 'Pending', accepted: 'Accepted', rejected: 'Rejected' }

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
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-title">My applications</div>
          <div className="page-sub">Track your application status in real time</div>
        </div>
      </div>
      <div className="arch-callout">
        <span className="label">GET</span>
        /api/applications/ → filtered by authenticated student via JWT
      </div>

      <div className="metric-row">
        <div className="metric">
          <div className="metric-label">applied</div>
          <div className="metric-value">{counts.total}</div>
        </div>
        <div className="metric">
          <div className="metric-label">pending</div>
          <div className="metric-value amber">{counts.pending}</div>
        </div>
        <div className="metric">
          <div className="metric-label">accepted</div>
          <div className="metric-value green">{counts.accepted}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">applications</div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Position</th>
              <th>Company</th>
              <th>Applied</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>loading...</td></tr>
            )}
            {!loading && applications.length === 0 && (
              <tr><td colSpan={4} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>no applications yet.</td></tr>
            )}
            {applications.map(app => (
              <tr key={app.id}>
                <td><b>{app.internship_title}</b></td>
                <td className="text-muted">{app.internship_title}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {new Date(app.applied_at).toLocaleDateString()}
                </td>
                <td><span className={`status ${statusClass[app.status]}`}>{statusLabel[app.status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
