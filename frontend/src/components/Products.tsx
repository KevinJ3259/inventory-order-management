import { useMemo, useState } from 'react'
import AddProductForm from './AddProductForm'
import { apiFetch } from '../api'

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
  onRefresh: () => void
}

function Products({ products, onRefresh }: ProductsProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return products
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      )
    })
  }, [products, searchTerm])

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Delete ${product.name}? This cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    const response = await apiFetch(`/products/${product.id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      alert('Unable to delete product.')
      return
    }

    onRefresh()
  }

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingProduct) return

    const { name, value } = event.target

    setEditingProduct({
      ...editingProduct,
      [name]:
        name === 'price' ||
        name === 'quantityInStock' ||
        name === 'reorderLevel'
          ? Number(value)
          : value,
    })
  }

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!editingProduct) return

    const response = await apiFetch(`/products/${editingProduct.id}`, {
      method: 'PUT',
      body: JSON.stringify(editingProduct),
    })

    if (!response.ok) {
      alert('Unable to update product.')
      return
    }

    setEditingProduct(null)
    onRefresh()
  }

  return (
    <div className="products-page">
      <section className="panel">
        <AddProductForm onProductAdded={onRefresh} />
      </section>

      {editingProduct && (
        <section className="panel">
          <form className="product-form" onSubmit={handleUpdate}>
            <h2>Edit Product</h2>

            <div className="form-grid">
              <input
                name="name"
                value={editingProduct.name}
                onChange={handleEditChange}
                required
              />

              <input
                name="sku"
                value={editingProduct.sku}
                onChange={handleEditChange}
                required
              />

              <input
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                value={editingProduct.price}
                onChange={handleEditChange}
                required
              />

              <input
                name="quantityInStock"
                type="number"
                min="0"
                value={editingProduct.quantityInStock}
                onChange={handleEditChange}
                required
              />

              <input
                name="reorderLevel"
                type="number"
                min="0"
                value={editingProduct.reorderLevel}
                onChange={handleEditChange}
                required
              />

              <textarea
                name="description"
                value={editingProduct.description ?? ''}
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
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="panel-header">
          <h2>Products</h2>
        </div>

        <div className="search-bar">
          <input
            type="search"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <p>No matching products found.</p>
        ) : (
          <div className="products-table">
            <div className="products-table-header">
              <span>Name</span>
              <span>SKU</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Reorder Level</span>
              <span>Actions</span>
            </div>

            {filteredProducts.map((product) => (
              <div className="products-table-row" key={product.id}>
                <span>{product.name}</span>
                <span>{product.sku}</span>
                <span>${Number(product.price).toFixed(2)}</span>
                <span>{product.quantityInStock}</span>
                <span>{product.reorderLevel}</span>

                <span className="action-buttons">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => setEditingProduct(product)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(product)}
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

export default Products