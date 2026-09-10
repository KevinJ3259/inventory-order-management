import { useState } from 'react'
import { apiFetch } from '../api'

type AddCustomerFormProps = {
  onCustomerAdded: () => void
}

function AddCustomerForm({
  onCustomerAdded,
}: AddCustomerFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()
    setMessage('')

    const response = await apiFetch('/customers', {
      method: 'POST',
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
      }),
    })

    if (!response.ok) {
      setMessage('Unable to add customer.')
      return
    }

    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')

    setMessage('Customer added successfully.')
    onCustomerAdded()
  }

  return (
    <form
      className="customer-form"
      onSubmit={handleSubmit}
    >
      <h2>Add Customer</h2>

      <div className="form-grid">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(event) =>
            setFirstName(event.target.value)
          }
          required
        />

        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(event) =>
            setLastName(event.target.value)
          }
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(event) =>
            setPhone(event.target.value)
          }
        />
      </div>

      <button
        type="submit"
        className="primary-button"
      >
        Add Customer
      </button>

      {message && (
        <p className="form-message">
          {message}
        </p>
      )}
    </form>
  )
}

export default AddCustomerForm