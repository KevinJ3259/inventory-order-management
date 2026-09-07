import { useState } from 'react'

type Customer = {
  id: number
  firstName: string
  lastName: string
}

type Product = {
  id: number
  name: string
  price: number
  quantityInStock: number
}

type AddOrderFormProps = {
  customers: Customer[]
  products: Product[]
  onOrderAdded: () => void
}

function AddOrderForm({
  customers,
  products,
  onOrderAdded,
}: AddOrderFormProps) {
  const [customerId, setCustomerId] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [message, setMessage] = useState('')

  const selectedProduct = products.find(
    (product) => product.id === Number(productId)
  )

  const estimatedTotal =
    selectedProduct && Number(quantity) > 0
      ? selectedProduct.price * Number(quantity)
      : 0

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')

    const response = await fetch('http://localhost:8080/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: {
          id: Number(customerId),
        },
        items: [
          {
            product: {
              id: Number(productId),
            },
            quantity: Number(quantity),
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      setMessage(errorText || 'Unable to create order.')
      return
    }

    setCustomerId('')
    setProductId('')
    setQuantity('1')
    setMessage('Order created successfully.')

    onOrderAdded()
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h2>Create Order</h2>

      <div className="form-grid">
        <select
          value={customerId}
          onChange={(event) => setCustomerId(event.target.value)}
          required
        >
          <option value="">Select customer</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </select>

        <select
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
          required
        >
          <option value="">Select product</option>

          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.quantityInStock} in stock)
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          max={selectedProduct?.quantityInStock}
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="Quantity"
          required
        />

        <div className="order-total-preview">
          <span>Estimated Total</span>
          <strong>${estimatedTotal.toFixed(2)}</strong>
        </div>
      </div>

      <button type="submit" className="primary-button">
        Place Order
      </button>

      {message && <p className="form-message">{message}</p>}
    </form>
  )
}

export default AddOrderForm