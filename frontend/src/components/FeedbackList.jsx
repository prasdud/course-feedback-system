// src/components/FeedbackList.jsx
import { useEffect, useState } from 'react'
import axios from '../utils/api'
import FeedbackForm from './FeedbackForm'

export default function FeedbackList({ user }) {
  const [feedbacks, setFeedbacks] = useState([])
  const [editing, setEditing] = useState(null)

  const fetchFeedbacks = async () => {
    const res = await axios.get('/feedback/')
    setFeedbacks(res.data)
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const handleEdit = fb => setEditing(fb)
  const handleDelete = async id => {
    if (confirm('Are you sure?')) {
      await axios.delete(`/feedback/${id}/`)
      fetchFeedbacks()
    }
  }

  const handleUpdate = async updated => {
    await axios.put(`/feedback/${editing._id}/`, updated)
    setEditing(null)
    fetchFeedbacks()
  }

  return (
    <div>
      {editing && <FeedbackForm onSubmit={handleUpdate} initial={editing} />}
      {feedbacks.map(fb => (
        <div key={fb._id} className="card">
          <h3>{fb.courseName}</h3>
          <p>Rating: {fb.rating}</p>
          <p>{fb.message}</p>
          {user && fb.userId === user._id && (
            <div style={{ marginTop: '0.5rem' }}>
              <button className="primary" onClick={() => handleEdit(fb)}>Edit</button>
              <button className="primary" onClick={() => handleDelete(fb._id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
