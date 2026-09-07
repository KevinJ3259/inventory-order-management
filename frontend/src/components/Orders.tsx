import AddOrderForm from './AddOrderForm'

type Customer = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
}

type Product = {
  id: number
  name: string
  sku: string
  price: number
  quantityInStock: number
}

type OrderItem = {
  id: number
  quantity: number
  unitPrice: number
  lineTotal: number
  product: Product
}

type Order = {
  id: number
  status: string
  totalAmount: number
  orderDate: string
  customer: Customer
  items: OrderItem[]
}

type OrdersProps = {
  orders: Order[]
  customers: Customer[]
  products: Product[]
  onRefresh: () => void
}

function Orders({
  orders,
  customers,
  products,
  onRefresh,
}: OrdersProps) {
  return (
    <div className="orders-page">
      <section className="panel">
        <AddOrderForm
          customers={customers}
          products={products}
          onOrderAdded={onRefresh}
        />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Orders</h2>
        </div>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="orders-table">
            <div className="orders-table-header">
              <span>Order</span>
              <span>Customer</span>
              <span>Status</span>
              <span>Total</span>
              <span>Items</span>
            </div>

            {orders.map((order) => (
              <div className="orders-table-row" key={order.id}>
                <span>#{order.id}</span>

                <span>
                  {order.customer.firstName} {order.customer.lastName}
                </span>

                <span>
                  <span className="status-badge">{order.status}</span>
                </span>

                <span>${Number(order.totalAmount).toFixed(2)}</span>

                <span>{order.items?.length ?? 0}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Orders