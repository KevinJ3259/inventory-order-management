import { useState } from 'react'

type ProductFormData = {
  name: string
  sku: string
  description: string
  price: string
  quantityInStock: string
  reorderLevel: string
}

type AddProductFormProps = {
  onProductAdded: () => void
}

function AddProductForm({ onProductAdded }: AddProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    description: '',
    price: '',
    quantityInStock: '',
    reorderLevel: '',
  })

  const [message, setMessage] = useState('')

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')

    const response = await fetch('http://localhost:8080/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        price: Number(formData.price),
        quantityInStock: Number(formData.quantityInStock),
        reorderLevel: Number(formData.reorderLevel),
      }),
    })

    if (!response.ok) {
      setMessage('Unable to add product.')
      return
    }

    setFormData({
      name: '',
      sku: '',
      description: '',
      price: '',
      quantityInStock: '',
      reorderLevel: '',
    })

    setMessage('Product added successfully.')
    onProductAdded()
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Add Product</h2>

      <div className="form-grid">
        <input
          name="name"
          placeholder="Product name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="sku"
          placeholder="SKU"
          value={formData.sku}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          name="quantityInStock"
          type="number"
          min="0"
          placeholder="Quantity in stock"
          value={formData.quantityInStock}
          onChange={handleChange}
          required
        />

        <input
          name="reorderLevel"
          type="number"
          min="0"
          placeholder="Reorder level"
          value={formData.reorderLevel}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="primary-button">
        Add Product
      </button>

      {message && <p className="form-message">{message}</p>}
    </form>
  )
}

export default AddProductForm