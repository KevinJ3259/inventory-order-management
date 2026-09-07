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

type OrderLine = {
  productId: number
  quantity: number
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
  const [items, setItems] = useState<OrderLine[]>([])
  const [message, setMessage] = useState('')

  const selectedProduct = products.find(
    (product) => product.id === Number(productId)
  )

  const orderTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const product = products.find(
        (product) => product.id === item.productId
      )

      if (!product) {
        return total
      }

      return total + Number(product.price) * item.quantity
    }, 0)
  }, [items, products])

  const handleAddItem = () => {
    setMessage('')

    const selectedProductId = Number(productId)
    const selectedQuantity = Number(quantity)

    if (!selectedProductId) {
      setMessage('Select a product first.')
      return
    }

    if (selectedQuantity <= 0) {
      setMessage('Quantity must be greater than zero.')
      return
    }

    if (
      selectedProduct &&
      selectedQuantity > selectedProduct.quantityInStock
    ) {
      setMessage(
        `Only ${selectedProduct.quantityInStock} units are available.`
      )
      return
    }

    const existingItem = items.find(
      (item) => item.productId === selectedProductId
    )

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + selectedQuantity

      if (
        selectedProduct &&
        newQuantity > selectedProduct.quantityInStock
      ) {
        setMessage(
          `Only ${selectedProduct.quantityInStock} units are available.`
        )
        return
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.productId === selectedProductId
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        )
      )
    } else {
      setItems((currentItems) => [
        ...currentItems,
        {
          productId: selectedProductId,
          quantity: selectedQuantity,
        },
      ])
    }

    setProductId('')
    setQuantity('1')
  }

  const handleRemoveItem = (productIdToRemove: number) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.productId !== productIdToRemove
      )
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')

    if (!customerId) {
      setMessage('Select a customer.')
      return
    }

    if (items.length === 0) {
      setMessage('Add at least one product to the order.')
      return
    }

    const response = await fetch(
      'http://localhost:8080/api/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      setMessage(errorText || 'Unable to create order.')
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
    <form className="order-form" onSubmit={handleSubmit}>
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
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
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
        <div className="order-builder">
          <h3>Order Items</h3>

          <div className="order-builder-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Line Total</span>
            <span>Action</span>
          </div>

          {items.map((item) => {
            const product = products.find(
              (product) => product.id === item.productId
            )

            if (!product) {
              return null
            }

            const lineTotal =
              Number(product.price) * item.quantity

            return (
              <div
                className="order-builder-row"
                key={item.productId}
              >
                <span>{product.name}</span>
                <span>{item.quantity}</span>
                <span>
                  ${Number(product.price).toFixed(2)}
                </span>
                <span>${lineTotal.toFixed(2)}</span>

                <span>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleRemoveItem(item.productId)
                    }
                  >
                    Remove
                  </button>
                </span>
              </div>
            )
          })}

          <div className="order-builder-total">
            <span>Order Total</span>
            <strong>${orderTotal.toFixed(2)}</strong>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="primary-button place-order-button"
      >
        Place Order
      </button>

      {message && (
        <p className="form-message">{message}</p>
      )}
    </form>
  )
}

export default AddOrderForm