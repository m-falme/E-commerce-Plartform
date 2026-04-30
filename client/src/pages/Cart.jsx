import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";


export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Calculate cart total
  // .reduce() iterates through the array and accumulates a single value
  // Here: start at 0, add (price × quantity) for each item
  const total = cart.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="page" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "1.5rem",
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "4rem",
          color: "rgba(201,168,76,0.15)",
        }}>
          ◇
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>Your cart is empty</h3>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Discover our curated collection
        </p>
        <Link to="/products" className="btn btn-gold">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ padding: "3rem 2rem 6rem", maxWidth: "900px" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ color: "var(--gold)", letterSpacing: "0.2em", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Your Selection
          </p>
          <h2>Shopping Cart</h2>
          <div className="divider" />
        </div>

        {/* Cart layout: items left, summary right */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "3rem",
          alignItems: "start",
        }}>

          {/* Cart items list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {cart.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onQuantityChange={(qty) => updateQuantity(item.id, qty)}
              />
            ))}
          </div>

          {/* Order summary */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "2rem",
            position: "sticky",
            top: "6rem", // stays visible while scrolling
          }}>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 400,
              marginBottom: "1.5rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid var(--border)",
            }}>
              Order Summary
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--muted)" }}>Subtotal</span>
                <span>KSh {total.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--muted)" }}>Shipping</span>
                <span style={{ color: "var(--gold)" }}>Free</span>
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1rem 0",
              borderTop: "1px solid var(--border)",
              marginBottom: "1.5rem",
            }}>
              <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>Total</span>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 300,
                color: "var(--gold)",
              }}>
                KSh {total.toLocaleString()}
              </span>
            </div>

            {/* Checkout button — Stripe will hook up here later */}
            <button className="btn btn-gold" style={{ width: "100%", fontSize: "0.85rem" }}>
              Proceed to Checkout
            </button>

            <Link to="/products" style={{
              display: "block",
              textAlign: "center",
              marginTop: "1rem",
              fontSize: "0.8rem",
              color: "var(--muted)",
              letterSpacing: "0.05em",
            }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// CartItemRow — displays one item in the cart
// Props: item (the cart item data), onRemove, onQuantityChange
function CartItemRow({ item, onRemove, onQuantityChange }) {
  const product = item.product;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
      padding: "1.5rem 0",
      borderBottom: "1px solid var(--border)",
      animation: "fadeIn 0.3s ease",
    }}>
      {/* Product image / placeholder */}
      <div style={{
        width: "80px",
        height: "80px",
        background: "var(--surface)",
        borderRadius: "var(--radius-sm)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}>
        {product?.image_url ? (
          <img src={product.image_url} alt={product?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "rgba(201,168,76,0.2)" }}>
            {product?.name?.charAt(0) || "?"}
          </span>
        )}
      </div>

      {/* Product details */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1rem",
          fontWeight: 400,
          marginBottom: "0.25rem",
        }}>
          {product?.name || "Unknown Product"}
        </h3>
        <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
          {product?.category}
        </p>
      </div>

      {/* Quantity controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button
          onClick={() => onQuantityChange(item.quantity - 1)}
          style={{
            width: "28px", height: "28px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--white)",
            cursor: "pointer",
            fontSize: "1rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "var(--transition)",
          }}
        >
          −
        </button>
        <span style={{ minWidth: "20px", textAlign: "center", fontSize: "0.9rem" }}>
          {item.quantity}
        </span>
        <button
          onClick={() => onQuantityChange(item.quantity + 1)}
          style={{
            width: "28px", height: "28px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--white)",
            cursor: "pointer",
            fontSize: "1rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "var(--transition)",
          }}
        >
          +
        </button>
      </div>

      {/* Line total */}
      <div style={{ textAlign: "right", minWidth: "100px" }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          fontWeight: 300,
          color: "var(--gold)",
        }}>
          KSh {((product?.price || 0) * item.quantity).toLocaleString()}
        </span>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          color: "var(--muted)",
          cursor: "pointer",
          fontSize: "1.2rem",
          padding: "0.25rem",
          transition: "var(--transition)",
          lineHeight: 1,
        }}
        title="Remove item"
      >
        ×
      </button>
    </div>
  );
}