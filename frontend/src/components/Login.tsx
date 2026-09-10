import { useState } from 'react'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

type LoginProps = {
  onLogin: (token: string, userName: string) => void
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error('Invalid email or password.')
      }

      const data = await response.json()

      localStorage.setItem('inventory_token', data.token)
      localStorage.setItem(
        'inventory_user',
        `${data.firstName} ${data.lastName}`
      )

      onLogin(
        data.token,
        `${data.firstName} ${data.lastName}`
      )
    } catch (error) {
      console.error(error)
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>InventoryPro</h1>
        <p>Sign in to manage your inventory and orders.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login