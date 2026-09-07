import { useState } from 'react'

type CustomerFormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

type AddCustomerFormProps = {
  onCustomerAdded: () => void
}

function AddCustomerForm({ onCustomerAdded }: AddCustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const [message, setMessage] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')

    const response = await fetch('http://localhost:8080/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      setMessage('Unable to add customer.')
      return
    }

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    })

    setMessage('Customer added successfully.')
    onCustomerAdded()
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <h2>Add Customer</h2>

      <div className="form-grid">
        <input
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          name="lastName"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="primary-button">
        Add Customer
      </button>

      {message && <p className="form-message">{message}</p>}
    </form>
  )
}

export default AddCustomerForm