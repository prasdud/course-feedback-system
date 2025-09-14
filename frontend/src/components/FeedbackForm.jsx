// src/components/FeedbackForm.jsx
import { useState, useEffect } from 'react'
import axios from '../utils/api'

export default function FeedbackForm({ onSubmit }) {
  const [courses, setCourses] = useState([])
  const [form, setForm] = useState({ course: '', rating: 1, message: '' })

  useEffect(() => {
    axios.get('/courses/').then(res => setCourses(res.data))
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(form)
    setForm({ course: '', rating: 1, message: '' })
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Submit Feedback</h2>
      <select name="course" value={form.course} onChange={handleChange} required>
        <option value="">Select Course</option>
        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <input type="number" name="rating" min="1" max="5" value={form.rating} onChange={handleChange} required />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your feedback" required />
      <button className="primary" type="submit">Submit</button>
    </form>
  )
}
