type Product = {
  id: number
  name: string
  sku: string
  description: string
  price: number
  quantityInStock: number
  reorderLevel: number
}

type ReorderAlertsProps = {
  products: Product[]
}

function ReorderAlerts({ products }: ReorderAlertsProps) {
  return (
    <section className="panel">
      <h2>Reorder Alerts</h2>

      {products.length === 0 ? (
        <p>No products currently need to be reordered.</p>
      ) : (
        <div className="reorder-table">
          <div className="reorder-table-header">
            <span>Product</span>
            <span>SKU</span>
            <span>Stock</span>
            <span>Reorder Level</span>
            <span>Status</span>
          </div>

          {products.map((product) => (
            <div className="reorder-table-row" key={product.id}>
              <span>{product.name}</span>
              <span>{product.sku}</span>
              <span>{product.quantityInStock}</span>
              <span>{product.reorderLevel}</span>
              <span className="stock-warning">Reorder</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default ReorderAlerts