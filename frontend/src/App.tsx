import { useCallback, useEffect, useState } from 'react'
import './App.css'

import Products from './components/Products'
import Customers from './components/Customers'
import Orders from './components/Orders'
import ReorderAlerts from './components/ReorderAlerts'
import Reports from './components/Reports'

type Product = {
  id: number
  name: string
  sku: string
  description: string
  price: number
  quantityInStock: number
  reorderLevel: number
}

type Customer = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
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

type View =
  | 'dashboard'
  | 'products'
  | 'customers'
  | 'orders'
  | 'reorder-alerts'
  | 'reports'

const API_BASE = 'http://localhost:8080/api'

function App() {
  const [activeView, setActiveView] = useState<View>('dashboard')

  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [reorderAlerts, setReorderAlerts] = useState<Product[]>([])

  const [reportSummary, setReportSummary] =
    useState<ReportSummary | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const [
        productsResponse,
        customersResponse,
        ordersResponse,
        alertsResponse,
        reportsResponse,
      ] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/customers`),
        fetch(`${API_BASE}/orders`),
        fetch(`${API_BASE}/products/reorder-alerts`),
        fetch(`${API_BASE}/reports/summary`),
      ])

      if (
        !productsResponse.ok ||
        !customersResponse.ok ||
        !ordersResponse.ok ||
        !alertsResponse.ok ||
        !reportsResponse.ok
      ) {
        throw new Error('Unable to load application data.')
      }

      const productsData: Product[] =
        await productsResponse.json()

      const customersData: Customer[] =
        await customersResponse.json()

      const ordersData: Order[] =
        await ordersResponse.json()

      const alertsData: Product[] =
        await alertsResponse.json()

      const reportsData: ReportSummary =
        await reportsResponse.json()

      setProducts(productsData)
      setCustomers(customersData)
      setOrders(ordersData)
      setReorderAlerts(alertsData)
      setReportSummary(reportsData)
    } catch (err) {
      console.error(err)

      setError(
        'Unable to connect to the backend. Make sure Spring Boot is running on port 8080.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const recentOrder =
    orders.length > 0 ? orders[orders.length - 1] : null

  const inventoryValue = products.reduce(
    (total, product) =>
      total +
      Number(product.price) * product.quantityInStock,
    0
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">InventoryPro</div>

        <nav className="nav-menu">
          <button
            className={
              activeView === 'dashboard' ? 'active-nav' : ''
            }
            onClick={() => setActiveView('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={
              activeView === 'products' ? 'active-nav' : ''
            }
            onClick={() => setActiveView('products')}
          >
            Products
          </button>

          <button
            className={
              activeView === 'customers' ? 'active-nav' : ''
            }
            onClick={() => setActiveView('customers')}
          >
            Customers
          </button>

          <button
            className={
              activeView === 'orders' ? 'active-nav' : ''
            }
            onClick={() => setActiveView('orders')}
          >
            Orders
          </button>

          <button
            className={
              activeView === 'reorder-alerts'
                ? 'active-nav'
                : ''
            }
            onClick={() => setActiveView('reorder-alerts')}
          >
            Reorder Alerts
          </button>

          <button
            className={
              activeView === 'reports' ? 'active-nav' : ''
            }
            onClick={() => setActiveView('reports')}
          >
            Reports
          </button>
        </nav>
      </aside>

      <main className="main-content">
        {loading && (
          <div className="message-card">
            <h2>Loading InventoryPro...</h2>
          </div>
        )}

        {!loading && error && (
          <div className="message-card error-message">
            <h2>Connection Error</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          activeView === 'dashboard' && (
            <>
              <header className="topbar">
                <h1>Inventory &amp; Order Management</h1>

                <p>
                  Manage products, customers, orders,
                  inventory, and business reporting.
                </p>
              </header>

              <section className="stats-grid">
                <div className="stat-card">
                  <span>Total Products</span>

                  <strong>
                    {reportSummary?.totalProducts ??
                      products.length}
                  </strong>
                </div>

                <div className="stat-card">
                  <span>Customers</span>
                  <strong>{customers.length}</strong>
                </div>

                <div className="stat-card">
                  <span>Total Orders</span>

                  <strong>
                    {reportSummary?.totalOrders ??
                      orders.length}
                  </strong>
                </div>

                <div className="stat-card alert-card">
                  <span>Low Stock</span>

                  <strong>
                    {reportSummary?.lowStockCount ??
                      reorderAlerts.length}
                  </strong>
                </div>

                <div className="stat-card revenue-card">
                  <span>Total Revenue</span>

                  <strong>
                    $
                    {Number(
                      reportSummary?.totalRevenue ?? 0
                    ).toFixed(2)}
                  </strong>
                </div>

                <div className="stat-card">
                  <span>Inventory Value</span>

                  <strong>
                    ${inventoryValue.toFixed(2)}
                  </strong>
                </div>
              </section>

              <section className="order-status-panel panel">
                <div className="panel-heading">
                  <h2>Orders by Status</h2>
                </div>

                <div className="status-summary-grid">
                  <div className="status-summary-card">
                    <span>Placed</span>
                    <strong>
                      {reportSummary?.placedOrders ?? 0}
                    </strong>
                  </div>

                  <div className="status-summary-card">
                    <span>Processing</span>
                    <strong>
                      {reportSummary?.processingOrders ?? 0}
                    </strong>
                  </div>

                  <div className="status-summary-card">
                    <span>Shipped</span>
                    <strong>
                      {reportSummary?.shippedOrders ?? 0}
                    </strong>
                  </div>

                  <div className="status-summary-card">
                    <span>Completed</span>
                    <strong>
                      {reportSummary?.completedOrders ?? 0}
                    </strong>
                  </div>

                  <div className="status-summary-card">
                    <span>Cancelled</span>
                    <strong>
                      {reportSummary?.cancelledOrders ?? 0}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="dashboard-grid">
                <div className="panel">
                  <div className="panel-heading">
                    <h2>Low Stock Products</h2>

                    <button
                      className="primary-button"
                      onClick={() =>
                        setActiveView('reorder-alerts')
                      }
                    >
                      View All
                    </button>
                  </div>

                  {reorderAlerts.length === 0 ? (
                    <p>
                      No products currently need to be
                      reordered.
                    </p>
                  ) : (
                    reorderAlerts
                      .slice(0, 3)
                      .map((product) => (
                        <div
                          className="low-stock-item"
                          key={product.id}
                        >
                          <div>
                            <h3>{product.name}</h3>
                            <p>SKU: {product.sku}</p>
                          </div>

                          <span className="stock-badge">
                            {product.quantityInStock} in stock
                          </span>
                        </div>
                      ))
                  )}
                </div>

                <div className="panel recent-order">
                  <h2>Recent Order</h2>

                  {recentOrder ? (
                    <div className="recent-order-details">
                      <p>
                        <strong>Customer:</strong>{' '}
                        {recentOrder.customer.firstName}{' '}
                        {recentOrder.customer.lastName}
                      </p>

                      <p>
                        <strong>Status:</strong>{' '}

                        <span className="status-badge">
                          {recentOrder.status}
                        </span>
                      </p>

                      <p>
                        <strong>Total:</strong> $
                        {Number(
                          recentOrder.totalAmount
                        ).toFixed(2)}
                      </p>

                      <p>
                        <strong>Items:</strong>{' '}
                        {recentOrder.items?.length ?? 0}
                      </p>
                    </div>
                  ) : (
                    <p>
                      No orders have been placed yet.
                    </p>
                  )}
                </div>
              </section>
            </>
          )}

        {!loading &&
          !error &&
          activeView === 'products' && (
            <>
              <header className="topbar">
                <h1>Products</h1>

                <p>
                  View inventory, pricing, and reorder
                  levels.
                </p>
              </header>

              <Products
                products={products}
                onRefresh={loadData}
              />
            </>
          )}

        {!loading &&
          !error &&
          activeView === 'customers' && (
            <>
              <header className="topbar">
                <h1>Customers</h1>

                <p>
                  View customer contact information and
                  account details.
                </p>
              </header>

              <Customers
                customers={customers}
                onRefresh={loadData}
              />
            </>
          )}

        {!loading &&
          !error &&
          activeView === 'orders' && (
            <>
              <header className="topbar">
                <h1>Orders</h1>

                <p>
                  View placed orders, totals, customers,
                  and line items.
                </p>
              </header>

              <Orders
                orders={orders}
                customers={customers}
                products={products}
                onRefresh={loadData}
              />
            </>
          )}

        {!loading &&
          !error &&
          activeView === 'reorder-alerts' && (
            <>
              <header className="topbar">
                <h1>Reorder Alerts</h1>

                <p>
                  Products that have reached or fallen
                  below their reorder level.
                </p>
              </header>

              <ReorderAlerts products={reorderAlerts} />
            </>
          )}

        {!loading &&
          !error &&
          activeView === 'reports' && (
            <>
              <header className="topbar">
                <h1>Reports</h1>

                <p>
                  View inventory and order performance
                  metrics.
                </p>
              </header>

              <Reports summary={reportSummary} />
            </>
          )}
      </main>
    </div>
  )
}

export default App