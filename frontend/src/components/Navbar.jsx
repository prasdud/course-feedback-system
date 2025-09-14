// src/components/Navbar.jsx
export default function Navbar({ user, onLogout }) {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', backgroundColor: '#0ABAB5', color: '#fff', borderRadius: '0 0 12px 12px' }}>
      <h1>Course Feedback</h1>
      {user && (
        <div>
          <span style={{ marginRight: '1rem' }}>{user.name}</span>
          <button className="primary" onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  )
}
