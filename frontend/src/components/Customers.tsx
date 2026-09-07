type Customer = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
}

type CustomersProps = {
  customers: Customer[]
}

function Customers({ customers }: CustomersProps) {
  return (
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
          </div>

          {customers.map((customer) => (
            <div className="customers-table-row" key={customer.id}>
              <span>
                {customer.firstName} {customer.lastName}
              </span>

              <span>{customer.email}</span>

              <span>{customer.phone}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Customers