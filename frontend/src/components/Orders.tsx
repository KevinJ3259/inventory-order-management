import { useMemo, useState } from 'react'

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

const ORDER_STATUSES = [
  'PLACED',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
]

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

function Orders({
  orders,
  customers,
  products,
  onRefresh,
}: OrdersProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const [expandedOrderId, setExpandedOrderId] =
    useState<number | null>(null)

  const [updatingOrderId, setUpdatingOrderId] =
    useState<number | null>(null)

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return orders
    }

    return orders.filter((order) => {
      const customerName =
        `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase()

      return (
        String(order.id).includes(query) ||
        customerName.includes(query) ||
        order.status.toLowerCase().includes(query)
      )
    })
  }, [orders, searchTerm])

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrderId((current) =>
      current === orderId ? null : orderId
    )
  }

  const handleStatusChange = async (
    orderId: number,
    newStatus: string
  ) => {
    try {
      setUpdatingOrderId(orderId)

      const response = await fetch(
        `${API_BASE}/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      )

      if (!response.ok) {
        alert('Unable to update order status.')
        return
      }

      onRefresh()
    } catch (error) {
      console.error(error)
      alert('Unable to update order status.')
    } finally {
      setUpdatingOrderId(null)
    }
  }

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

        <div className="search-bar">
          <input
            type="search"
            placeholder="Search by order number, customer, or status..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        {filteredOrders.length === 0 ? (
          <p>No matching orders found.</p>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div
                className="order-card"
                key={order.id}
              >
                <div className="orders-table-row">
                  <span>#{order.id}</span>

                  <span>
                    {order.customer.firstName}{' '}
                    {order.customer.lastName}
                  </span>

                  <span>
                    <select
                      className="status-select"
                      value={order.status}
                      disabled={
                        updatingOrderId === order.id
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          order.id,
                          event.target.value
                        )
                      }
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </span>

                  <span>
                    $
                    {Number(
                      order.totalAmount
                    ).toFixed(2)}
                  </span>

                  <span>
                    {order.items?.length ?? 0}
                  </span>

                  <span>
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() =>
                        toggleOrderDetails(order.id)
                      }
                    >
                      {expandedOrderId === order.id
                        ? 'Hide'
                        : 'Details'}
                    </button>
                  </span>
                </div>

                {expandedOrderId === order.id && (
                  <div className="order-details">
                    <h3>
                      Order #{order.id} Details
                    </h3>

                    {order.orderDate && (
                      <p>
                        <strong>
                          Order Date:
                        </strong>{' '}
                        {new Date(
                          order.orderDate
                        ).toLocaleString()}
                      </p>
                    )}

                    <p>
                      <strong>Status:</strong>{' '}
                      <span className="status-badge">
                        {order.status}
                      </span>
                    </p>

                    <div className="order-items-table">
                      <div className="order-items-header">
                        <span>Product</span>
                        <span>SKU</span>
                        <span>Quantity</span>
                        <span>Unit Price</span>
                        <span>Line Total</span>
                      </div>

                      {order.items.map((item) => (
                        <div
                          className="order-items-row"
                          key={item.id}
                        >
                          <span>
                            {item.product.name}
                          </span>

                          <span>
                            {item.product.sku}
                          </span>

                          <span>
                            {item.quantity}
                          </span>

                          <span>
                            $
                            {Number(
                              item.unitPrice
                            ).toFixed(2)}
                          </span>

                          <span>
                            $
                            {Number(
                              item.lineTotal
                            ).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Orders