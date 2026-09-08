import { useState } from 'react'

type AddProductFormProps = {
  onProductAdded: () => void
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

function AddProductForm({
  onProductAdded,
}: AddProductFormProps) {
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [quantityInStock, setQuantityInStock] =
    useState('')
  const [reorderLevel, setReorderLevel] =
    useState('')
  const [description, setDescription] =
    useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setMessage('')

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          sku,
          description,
          price: Number(price),
          quantityInStock: Number(quantityInStock),
          reorderLevel: Number(reorderLevel),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()

        throw new Error(
          errorText || 'Unable to add product.'
        )
      }

      setName('')
      setSku('')
      setPrice('')
      setQuantityInStock('')
      setReorderLevel('')
      setDescription('')
      setMessage('Product added successfully.')

      onProductAdded()
    } catch (error) {
      console.error(error)

      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to add product.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit}
    >
      <h2>Add Product</h2>

      <div className="form-grid">
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          required
        />

        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(event) =>
            setSku(event.target.value)
          }
          required
        />

        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Price"
          value={price}
          onChange={(event) =>
            setPrice(event.target.value)
          }
          required
        />

        <input
          type="number"
          min="0"
          placeholder="Quantity in stock"
          value={quantityInStock}
          onChange={(event) =>
            setQuantityInStock(
              event.target.value
            )
          }
          required
        />

        <input
          type="number"
          min="0"
          placeholder="Reorder level"
          value={reorderLevel}
          onChange={(event) =>
            setReorderLevel(
              event.target.value
            )
          }
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
        />
      </div>

      <button
        type="submit"
        className="primary-button"
        disabled={loading}
      >
        {loading
          ? 'Adding Product...'
          : 'Add Product'}
      </button>

      {message && (
        <p className="form-message">
          {message}
        </p>
      )}
    </form>
  )
}

export default AddProductForm