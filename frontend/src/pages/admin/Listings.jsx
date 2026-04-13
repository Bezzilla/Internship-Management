import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

export default function Listings() {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get('/internships/').then(res => {
      setInternships(res.data)
      setLoading(false)
    })
  }, [])

  const updateStatus = async (id, status) => {
    await api.patch(`/internships/${id}/approve/`, { status })
    setSuccess(`Listing ${status === 'approved' ? 'approved and is now live ✓' : 'rejected'}.`)
    setInternships(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  const pending  = internships.filter(i => i.status === 'pending_approval')
  const approved = internships.filter(i => i.status === 'approved')
  const rejected = internships.filter(i => i.status === 'rejected')

  const statusLabel = {
    pending_approval: 'Pending Review',
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
          <div className="page-title">Approve Listings</div>
          <div className="page-sub">Review and approve internship posts submitted by companies</div>
        </div>
      </div>

      {success && <div className="success-box">✓ {success}</div>}

      <div className="metric-row">
        <div className="metric">
          <div className="metric-label">Awaiting Approval</div>
          <div className="metric-value amber">{pending.length}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Live Listings</div>
          <div className="metric-value green">{approved.length}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Rejected</div>
          <div className="metric-value" style={{ color: 'var(--red)' }}>{rejected.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">All Listings</div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Position</th>
              <th>Company</th>
              <th>Location</th>
              <th>Deadline</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>Loading...</td></tr>
            )}
            {!loading && internships.length === 0 && (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <div className="empty-state-title">No listings submitted yet</div>
                </div>
              </td></tr>
            )}
            {internships.map(item => (
              <tr key={item.id}>
                <td><b>{item.title}</b></td>
                <td style={{ color: 'var(--text-muted)' }}>{item.company_name}</td>
                <td style={{ color: 'var(--text-muted)' }}>{item.location}</td>
                <td style={{ color: 'var(--text-muted)' }}>{item.deadline}</td>
                <td>
                  <span className={`status ${statusCls[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {item.status === 'pending_approval' && (
                    <div className="flex gap-8 justify-end">
                      <button className="btn btn-success btn-sm" onClick={() => updateStatus(item.id, 'approved')}>Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateStatus(item.id, 'rejected')}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
