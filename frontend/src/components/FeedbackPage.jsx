// src/pages/FeedbackPage.jsx
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import FeedbackForm from '../components/FeedbackForm'
import FeedbackList from '../components/FeedbackList'
import axios from '../utils/api'

export default function FeedbackPage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.reload()
  }

  const handleSubmit = async data => {
    await axios.post('/feedback/submit/', data)
    window.location.reload() // refresh list
  }

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <FeedbackForm onSubmit={handleSubmit} />
      <FeedbackList user={user} />
    </div>
  )
}
