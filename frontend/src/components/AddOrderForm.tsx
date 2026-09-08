import { useMemo, useState } from 'react'

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

type OrderItemDraft = {
  productId: number
  productName: string
  quantity: number
  price: number
}

type AddOrderFormProps = {
  customers: Customer[]
  products: Product[]
  onOrderAdded: () => void
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

function AddOrderForm({
  customers,
  products,
  onOrderAdded,
}: AddOrderFormProps) {
  const [customerId, setCustomerId] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('1')

  const [orderItems, setOrderItems] =
    useState<OrderItemDraft[]>([])

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedProduct = products.find(
    (product) => product.id === Number(productId)
  )

  const orderTotal = useMemo(() => {
    return orderItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    )
  }, [orderItems])

  const handleAddItem = () => {
    setMessage('')

    if (!productId || !selectedProduct) {
      setMessage('Select a product first.')
      return
    }

    const quantityNumber = Number(quantity)

    if (
      !Number.isInteger(quantityNumber) ||
      quantityNumber <= 0
    ) {
      setMessage(
        'Quantity must be a whole number greater than zero.'
      )
      return
    }

    const existingItem = orderItems.find(
      (item) => item.productId === selectedProduct.id
    )

    const quantityAlreadyAdded =
      existingItem?.quantity ?? 0

    if (
      quantityAlreadyAdded + quantityNumber >
      selectedProduct.quantityInStock
    ) {
      setMessage(
        `Only ${selectedProduct.quantityInStock} units of ${selectedProduct.name} are available.`
      )
      return
    }

    if (existingItem) {
      setOrderItems((currentItems) =>
        currentItems.map((item) =>
          item.productId === selectedProduct.id
            ? {
                ...item,
                quantity:
                  item.quantity + quantityNumber,
              }
            : item
        )
      )
    } else {
      setOrderItems((currentItems) => [
        ...currentItems,
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity: quantityNumber,
          price: Number(selectedProduct.price),
        },
      ])
    }

    setProductId('')
    setQuantity('1')
  }

  const handleRemoveItem = (productIdToRemove: number) => {
    setOrderItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.productId !== productIdToRemove
      )
    )
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setMessage('')

    if (!customerId) {
      setMessage('Select a customer.')
      return
    }

    if (orderItems.length === 0) {
      setMessage('Add at least one product to the order.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            id: Number(customerId),
          },
          items: orderItems.map((item) => ({
            product: {
              id: item.productId,
            },
            quantity: item.quantity,
          })),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()

        throw new Error(
          errorText || 'Unable to create order.'
        )
      }

      setCustomerId('')
      setProductId('')
      setQuantity('1')
      setOrderItems([])
      setMessage('Order created successfully.')

      onOrderAdded()
    } catch (error) {
      console.error(error)

      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to create order.'
      )
    } finally {
      setLoading(false)
    }
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

        <select
          value={productId}
          onChange={(event) =>
            setProductId(event.target.value)
          }
        >
          <option value="">Select product</option>

          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
              disabled={
                product.quantityInStock <= 0
              }
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

      {orderItems.length > 0 && (
        <div className="order-items-preview">
          <h3>Order Items</h3>

          <div className="order-items-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Line Total</span>
            <span>Action</span>
          </div>

          {orderItems.map((item) => (
            <div
              className="order-items-row"
              key={item.productId}
            >
              <span>{item.productName}</span>

              <span>{item.quantity}</span>

              <span>
                ${item.price.toFixed(2)}
              </span>

              <span>
                $
                {(
                  item.price * item.quantity
                ).toFixed(2)}
              </span>

              <span>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    handleRemoveItem(
                      item.productId
                    )
                  }
                >
                  Remove
                </button>
              </span>
            </div>
          ))}

          <div className="order-total">
            <span>Order Total</span>

            <strong>
              ${orderTotal.toFixed(2)}
            </strong>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="primary-button"
        disabled={loading}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
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