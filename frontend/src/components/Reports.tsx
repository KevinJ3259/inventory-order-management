import { useEffect, useState } from 'react'

type ReportSummary = {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  lowStockCount: number
  placedOrders: number
  processingOrders: number
  shippedOrders: number
  completedOrders: number
  cancelledOrders: number
}

type TopSellingProduct = {
  productName: string
  sku: string
  unitsSold: number
  revenue: number
}

type Customer = {
  id: number
  firstName: string
  lastName: string
}

type CustomerOrder = {
  orderId: number
  orderDate: string
  status: string
  totalAmount: number
  itemCount: number
}

type CustomerSales = {
  customerId: number
  firstName: string
  lastName: string
  orderCount: number
  itemsPurchased: number
  totalSpent: number
}

type ReportsProps = {
  summary: ReportSummary | null
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

function Reports({ summary }: ReportsProps) {
  const [topSellingProducts, setTopSellingProducts] =
    useState<TopSellingProduct[]>([])

  const [loadingTopProducts, setLoadingTopProducts] =
    useState(true)

  const [topProductsError, setTopProductsError] =
    useState('')

  const [customers, setCustomers] =
    useState<Customer[]>([])

  const [selectedCustomerId, setSelectedCustomerId] =
    useState('')

  const [customerOrders, setCustomerOrders] =
    useState<CustomerOrder[]>([])

  const [loadingCustomerOrders, setLoadingCustomerOrders] =
    useState(false)

  const [customerOrdersError, setCustomerOrdersError] =
    useState('')

  const [salesByCustomer, setSalesByCustomer] =
    useState<CustomerSales[]>([])

  const [loadingSalesByCustomer, setLoadingSalesByCustomer] =
    useState(true)

  const [salesByCustomerError, setSalesByCustomerError] =
    useState('')

  useEffect(() => {
    const loadTopSellingProducts = async () => {
      try {
        setLoadingTopProducts(true)
        setTopProductsError('')

        const response = await fetch(
          `${API_BASE}/reports/top-selling-products`
        )

        if (!response.ok) {
          throw new Error(
            'Unable to load top-selling products.'
          )
        }

        const data: TopSellingProduct[] =
          await response.json()

        setTopSellingProducts(data)
      } catch (error) {
        console.error(error)

        setTopProductsError(
          'Unable to load top-selling products.'
        )
      } finally {
        setLoadingTopProducts(false)
      }
    }

    loadTopSellingProducts()
  }, [])

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/customers`
        )

        if (!response.ok) {
          throw new Error('Unable to load customers.')
        }

        const data: Customer[] = await response.json()

        setCustomers(data)
      } catch (error) {
        console.error(error)
      }
    }

    loadCustomers()
  }, [])

  useEffect(() => {
    const loadSalesByCustomer = async () => {
      try {
        setLoadingSalesByCustomer(true)
        setSalesByCustomerError('')

        const response = await fetch(
          `${API_BASE}/reports/sales-by-customer`
        )

        if (!response.ok) {
          throw new Error(
            'Unable to load sales by customer.'
          )
        }

        const data: CustomerSales[] =
          await response.json()

        setSalesByCustomer(data)
      } catch (error) {
        console.error(error)

        setSalesByCustomerError(
          'Unable to load sales by customer.'
        )
      } finally {
        setLoadingSalesByCustomer(false)
      }
    }

    loadSalesByCustomer()
  }, [])

  const handleCustomerChange = async (
    customerId: string
  ) => {
    setSelectedCustomerId(customerId)
    setCustomerOrders([])
    setCustomerOrdersError('')

    if (!customerId) {
      return
    }

    try {
      setLoadingCustomerOrders(true)

      const response = await fetch(
        `${API_BASE}/reports/customers/${customerId}/orders`
      )

      if (!response.ok) {
        throw new Error(
          'Unable to load customer order history.'
        )
      }

      const data: CustomerOrder[] =
        await response.json()

      setCustomerOrders(data)
    } catch (error) {
      console.error(error)

      setCustomerOrdersError(
        'Unable to load customer order history.'
      )
    } finally {
      setLoadingCustomerOrders(false)
    }
  }

  if (!summary) {
    return (
      <section className="panel">
        <p>No report data available.</p>
      </section>
    )
  }

  return (
    <div className="reports-page">
      <section className="reports-summary-grid">
        <div className="report-card">
          <span>Total Revenue</span>
          <strong>
            ${Number(summary.totalRevenue).toFixed(2)}
          </strong>
        </div>

        <div className="report-card">
          <span>Total Orders</span>
          <strong>{summary.totalOrders}</strong>
        </div>

        <div className="report-card">
          <span>Total Products</span>
          <strong>{summary.totalProducts}</strong>
        </div>

        <div className="report-card alert-card">
          <span>Low Stock Products</span>
          <strong>{summary.lowStockCount}</strong>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Orders by Status</h2>
        </div>

        <div className="status-summary-grid">
          <div className="status-summary-card">
            <span>Placed</span>
            <strong>{summary.placedOrders}</strong>
          </div>

          <div className="status-summary-card">
            <span>Processing</span>
            <strong>{summary.processingOrders}</strong>
          </div>

          <div className="status-summary-card">
            <span>Shipped</span>
            <strong>{summary.shippedOrders}</strong>
          </div>

          <div className="status-summary-card">
            <span>Completed</span>
            <strong>{summary.completedOrders}</strong>
          </div>

          <div className="status-summary-card">
            <span>Cancelled</span>
            <strong>{summary.cancelledOrders}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Top Selling Products</h2>
        </div>

        {loadingTopProducts && (
          <p>Loading top-selling products...</p>
        )}

        {!loadingTopProducts && topProductsError && (
          <p className="form-message">
            {topProductsError}
          </p>
        )}

        {!loadingTopProducts &&
          !topProductsError &&
          topSellingProducts.length === 0 && (
            <p>No product sales data available.</p>
          )}

        {!loadingTopProducts &&
          !topProductsError &&
          topSellingProducts.length > 0 && (
            <div className="top-products-table">
              <div className="top-products-header">
                <span>Rank</span>
                <span>Product</span>
                <span>SKU</span>
                <span>Units Sold</span>
                <span>Revenue</span>
              </div>

              {topSellingProducts.map(
                (product, index) => (
                  <div
                    className="top-products-row"
                    key={product.sku}
                  >
                    <span>#{index + 1}</span>
                    <span>{product.productName}</span>
                    <span>{product.sku}</span>
                    <span>{product.unitsSold}</span>
                    <span>
                      $
                      {Number(product.revenue).toFixed(2)}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Sales by Customer</h2>
        </div>

        {loadingSalesByCustomer && (
          <p>Loading customer sales...</p>
        )}

        {!loadingSalesByCustomer &&
          salesByCustomerError && (
            <p className="form-message">
              {salesByCustomerError}
            </p>
          )}

        {!loadingSalesByCustomer &&
          !salesByCustomerError &&
          salesByCustomer.length === 0 && (
            <p>No customer sales data available.</p>
          )}

        {!loadingSalesByCustomer &&
          !salesByCustomerError &&
          salesByCustomer.length > 0 && (
            <div className="sales-customer-table">
              <div className="sales-customer-header">
                <span>Customer</span>
                <span>Orders</span>
                <span>Items Purchased</span>
                <span>Total Spent</span>
              </div>

              {salesByCustomer.map((customer) => (
                <div
                  className="sales-customer-row"
                  key={customer.customerId}
                >
                  <span>
                    {customer.firstName}{' '}
                    {customer.lastName}
                  </span>

                  <span>{customer.orderCount}</span>
                  <span>{customer.itemsPurchased}</span>

                  <span>
                    $
                    {Number(customer.totalSpent).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Customer Order History</h2>
        </div>

        <div className="customer-history-controls">
          <select
            value={selectedCustomerId}
            onChange={(event) =>
              handleCustomerChange(event.target.value)
            }
          >
            <option value="">Select customer</option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.firstName}{' '}
                {customer.lastName}
              </option>
            ))}
          </select>
        </div>

        {loadingCustomerOrders && (
          <p>Loading customer orders...</p>
        )}

        {!loadingCustomerOrders &&
          customerOrdersError && (
            <p className="form-message">
              {customerOrdersError}
            </p>
          )}

        {!loadingCustomerOrders &&
          selectedCustomerId &&
          !customerOrdersError &&
          customerOrders.length === 0 && (
            <p>This customer has no orders.</p>
          )}

        {!loadingCustomerOrders &&
          customerOrders.length > 0 && (
            <div className="customer-orders-table">
              <div className="customer-orders-header">
                <span>Order</span>
                <span>Date</span>
                <span>Status</span>
                <span>Items</span>
                <span>Total</span>
              </div>

              {customerOrders.map((order) => (
                <div
                  className="customer-orders-row"
                  key={order.orderId}
                >
                  <span>#{order.orderId}</span>

                  <span>
                    {new Date(
                      order.orderDate
                    ).toLocaleDateString()}
                  </span>

                  <span>
                    <span className="status-badge">
                      {order.status}
                    </span>
                  </span>

                  <span>{order.itemCount}</span>

                  <span>
                    $
                    {Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
      </section>
    </div>
  )
}

export default Reports