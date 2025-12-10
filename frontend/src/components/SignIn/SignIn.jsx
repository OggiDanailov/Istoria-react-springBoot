import { useState } from 'react'
import { API_BASE_URL } from '../../config/api'
import './SignIn.css'

function SignIn({ onSignInSuccess, onSwitchToSignUp }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate
    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      if (!response.ok) {
        const errorMessage = await response.text()
        setError(errorMessage || 'Login failed')
        return
      }

      const loginData = await response.json()

      // Store token in localStorage
      localStorage.setItem('token', loginData.token)
      localStorage.setItem('user', JSON.stringify({
        id: loginData.id,
        email: loginData.email,
        accountType: loginData.accountType
      }))

      // Call callback to navigate to main app
      onSignInSuccess(loginData)
    } catch (err) {
      setError('Failed to login: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <button type="button" onClick={onSwitchToSignUp} className="link-btn">Sign Up</button>
        </p>
      </div>
    </div>
  )
}

export default SignIn