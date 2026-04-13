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
    setSuccess(`Listing ${status}.`)
    setInternships(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  const pending = internships.filter(i => i.status === 'pending_approval')
  const approved = internships.filter(i => i.status === 'approved')

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-title">Approve listings</div>
          <div className="page-sub">Review company-submitted internship posts before they go live</div>
        </div>
      </div>
      <div className="arch-callout">
        <span className="label">PATCH</span>
        /api/internships/{'<id>'}/approve/ → admin sets status: pending_approval → approved | rejected
      </div>

      {success && <div className="success-box">{success}</div>}

      <div className="metric-row">
        <div className="metric">
          <div className="metric-label">awaiting approval</div>
          <div className="metric-value amber">{pending.length}</div>
        </div>
        <div className="metric">
          <div className="metric-label">live listings</div>
          <div className="metric-value green">{approved.length}</div>
        </div>
        <div className="metric">
          <div className="metric-label">total listings</div>
          <div className="metric-value">{internships.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">pending listings</div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Position</th>
              <th>Company</th>
              <th>Deadline</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>loading...</td></tr>
            )}
            {!loading && internships.length === 0 && (
              <tr><td colSpan={5} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>no listings.</td></tr>
            )}
            {internships.map(item => (
              <tr key={item.id}>
                <td><b>{item.title}</b></td>
                <td className="text-muted">{item.company_name}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{item.deadline}</td>
                <td>
                  <span className={`status ${item.status === 'approved' ? 's-approved' : item.status === 'rejected' ? 's-reject' : 's-pending'}`}>
                    {item.status}
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
