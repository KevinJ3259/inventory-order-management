import { useState } from 'react'
import AddCustomerForm from './AddCustomerForm'

type Customer = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
}

type CustomersProps = {
  customers: Customer[]
  onRefresh: () => void
}

function Customers({ customers, onRefresh }: CustomersProps) {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const handleDelete = async (customer: Customer) => {
    const confirmed = window.confirm(
      `Delete ${customer.firstName} ${customer.lastName}? This cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    const response = await fetch(
      `http://localhost:8080/api/customers/${customer.id}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      alert('Unable to delete customer.')
      return
    }

    onRefresh()
  }

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!editingCustomer) return

    const { name, value } = event.target

    setEditingCustomer({
      ...editingCustomer,
      [name]: value,
    })
  }

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!editingCustomer) return

    const response = await fetch(
      `http://localhost:8080/api/customers/${editingCustomer.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCustomer),
      }
    )

    if (!response.ok) {
      alert('Unable to update customer.')
      return
    }

    setEditingCustomer(null)
    onRefresh()
  }

  return (
    <div className="customers-page">
      <section className="panel">
        <AddCustomerForm onCustomerAdded={onRefresh} />
      </section>

      {editingCustomer && (
        <section className="panel">
          <form className="customer-form" onSubmit={handleUpdate}>
            <h2>Edit Customer</h2>

            <div className="form-grid">
              <input
                name="firstName"
                value={editingCustomer.firstName}
                onChange={handleEditChange}
                required
              />

              <input
                name="lastName"
                value={editingCustomer.lastName}
                onChange={handleEditChange}
                required
              />

              <input
                name="email"
                type="email"
                value={editingCustomer.email}
                onChange={handleEditChange}
                required
              />

              <input
                name="phone"
                value={editingCustomer.phone ?? ''}
                onChange={handleEditChange}
              />
            </div>

            <div className="edit-actions">
              <button type="submit" className="primary-button">
                Save Changes
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={() => setEditingCustomer(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="panel-header">
          <h2>Customers</h2>
        </div>

        {customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <div className="customers-table">
            <div className="customers-table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Phone</span>
              <span>Actions</span>
            </div>

            {customers.map((customer) => (
              <div className="customers-table-row" key={customer.id}>
                <span>
                  {customer.firstName} {customer.lastName}
                </span>

                <span>{customer.email}</span>

                <span>{customer.phone}</span>

                <span className="action-buttons">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => setEditingCustomer(customer)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(customer)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Customers