import { useState } from 'react'

type Customer = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
}

type AddCustomerFormProps = {
  onCustomerAdded: (customer: Customer) => void
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

function AddCustomerForm({
  onCustomerAdded,
}: AddCustomerFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to add customer.')
      }

      const newCustomer: Customer = await response.json()

      onCustomerAdded(newCustomer)

      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setMessage('Customer added successfully.')
    } catch (error) {
      console.error(error)
      setMessage('Unable to add customer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Customer'}
      </button>

      {message && (
        <p className="form-message">{message}</p>
      )}
    </form>
  )
}

export default AddCustomerForm