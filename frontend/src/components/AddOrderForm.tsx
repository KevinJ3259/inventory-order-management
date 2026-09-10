import { useState } from 'react'
import { apiFetch } from '../api'

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

type OrderItemInput = {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
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
  const [items, setItems] = useState<OrderItemInput[]>([])
  const [message, setMessage] = useState('')

  const selectedProduct = products.find(
    (product) => product.id === Number(productId)
  )

  const orderTotal = items.reduce(
    (total, item) =>
      total + item.unitPrice * item.quantity,
    0
  )

  const handleAddItem = () => {
    setMessage('')

    if (!selectedProduct) {
      setMessage('Please select a product.')
      return
    }

    const quantityNumber = Number(quantity)

    if (
      !quantityNumber ||
      quantityNumber < 1 ||
      quantityNumber > selectedProduct.quantityInStock
    ) {
      setMessage('Please enter a valid quantity.')
      return
    }

    setItems((current) => [
      ...current,
      {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: quantityNumber,
        unitPrice: Number(selectedProduct.price),
      },
    ])

    setProductId('')
    setQuantity('1')
  }

  const handleRemoveItem = (index: number) => {
    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')

    if (!customerId) {
      setMessage('Please select a customer.')
      return
    }

    if (items.length === 0) {
      setMessage('Add at least one item to the order.')
      return
    }

    const response = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer: {
          id: Number(customerId),
        },
        items: items.map((item) => ({
          product: {
            id: item.productId,
          },
          quantity: item.quantity,
        })),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()

      setMessage(
        errorText || 'Unable to create order.'
      )

      return
    }

    setCustomerId('')
    setProductId('')
    setQuantity('1')
    setItems([])
    setMessage('Order created successfully.')

    onOrderAdded()
  }

  return (
    <form
      className="order-form"
      onSubmit={handleSubmit}
    >
      <h2>Create Order</h2>

      <div className="form-grid">
        <select
          value={customerId}
          onChange={(event) =>
            setCustomerId(event.target.value)
          }
          required
        >
          <option value="">
            Select customer
          </option>

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

        <select
          value={productId}
          onChange={(event) =>
            setProductId(event.target.value)
          }
        >
          <option value="">
            Select product
          </option>

          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
            >
              {product.name} (
              {product.quantityInStock} in stock)
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          max={selectedProduct?.quantityInStock}
          value={quantity}
          onChange={(event) =>
            setQuantity(event.target.value)
          }
          placeholder="Quantity"
        />

        <button
          type="button"
          className="primary-button"
          onClick={handleAddItem}
        >
          Add Item
        </button>
      </div>

      {items.length > 0 && (
        <div className="order-items-preview">
          <h3>Order Items</h3>

          {items.map((item, index) => (
            <div
              className="order-preview-row"
              key={`${item.productId}-${index}`}
            >
              <span>
                {item.productName}
              </span>

              <span>
                Qty: {item.quantity}
              </span>

              <span>
                $
                {(
                  item.unitPrice * item.quantity
                ).toFixed(2)}
              </span>

              <button
                type="button"
                className="delete-button"
                onClick={() =>
                  handleRemoveItem(index)
                }
              >
                Remove
              </button>
            </div>
          ))}

          <div className="order-total-preview">
            <span>Estimated Total</span>
            <strong>
              ${orderTotal.toFixed(2)}
            </strong>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="primary-button"
      >
        Place Order
      </button>

      {message && (
        <p className="form-message">
          {message}
        </p>
      )}
    </form>
  )
}

export default AddOrderForm