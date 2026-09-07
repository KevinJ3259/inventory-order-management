type Product = {
  id: number
  name: string
  sku: string
  description: string
  price: number
  quantityInStock: number
  reorderLevel: number
}

type ProductsProps = {
  products: Product[]
}

function Products({ products }: ProductsProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Products</h2>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-table">
          <div className="products-table-header">
            <span>Name</span>
            <span>SKU</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Reorder Level</span>
          </div>

          {products.map((product) => (
            <div className="products-table-row" key={product.id}>
              <span>{product.name}</span>
              <span>{product.sku}</span>
              <span>${Number(product.price).toFixed(2)}</span>
              <span>{product.quantityInStock}</span>
              <span>{product.reorderLevel}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Products