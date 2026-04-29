
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems, cartTotal, cartLoading,
    removeFromCart, updateQuantity, clearCart
  } = useCart();

  if (cartLoading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingText}>Loading your cart...</div>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="page-enter" style={styles.emptyPage}>
        <div style={styles.emptyContent}>
          <p style={{ fontSize: 64, marginBottom: 24 }}>🛒</p>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>
            Looks like you haven't added anything yet.
          </p>
          <Link to="/products" className="btn-primary" style={{ textDecoration: "none", display: "inline-block", marginTop: 24 }}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="container" style={{ padding: "48px 24px" }}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>◆ Your Selection</p>
            <h1 style={styles.title}>Shopping Cart</h1>
          </div>
          <button
            className="btn-ghost"
            style={{ fontSize: 12, color: "var(--text-muted)" }}
            onClick={clearCart}
          >
            Clear all
          </button>
        </div>

        <div style={styles.layout}>
          {/* LEFT: CART ITEMS LIST */}
          <div style={styles.itemsList}>
            {cartItems.map(item => (
              <CartRow
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onQtyChange={(qty) => updateQuantity(item.id, qty)}
              />
            ))}
          </div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>

            <div style={styles.summaryRows}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryValue}>
                  KES {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Shipping</span>
                <span style={{ ...styles.summaryValue, color: "var(--gold)" }}>
                  {cartTotal >= 5000 ? "FREE" : "KES 300"}
                </span>
              </div>
              {cartTotal < 5000 && (
                <p style={styles.shippingNote}>
                  Add KES {(5000 - cartTotal).toLocaleString()} more for free shipping
                </p>
              )}
            </div>

            <div style={styles.divider} />

            <div style={styles.summaryRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalValue}>
                KES {(cartTotal + (cartTotal >= 5000 ? 0 : 300)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button className="btn-primary" style={styles.checkoutBtn}>
              Proceed to Checkout
            </button>

            <Link to="/products" style={styles.continueLink}>
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// CartRow is a sub-component defined in the same file.
// It's small and only used here so no need for a separate file.
function CartRow({ item, onRemove, onQtyChange }) {
  const product = item.product;
  const lineTotal = product ? product.price * item.quantity : 0;

  return (
    <div style={styles.row}>
      {/* Product image */}
      <div style={styles.rowImage}>
        <img
          src={product?.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop"}
          alt={product?.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Product info */}
      <div style={styles.rowInfo}>
        <h3 style={styles.rowName}>{product?.name || `Product #${item.product_id}`}</h3>
        {product?.category && (
          <span style={styles.rowCategory}>{product.category}</span>
        )}
        <p style={styles.rowPrice}>KES {product?.price?.toLocaleString()}</p>
      </div>

      {/* Quantity controls */}
      <div style={styles.qtyControls}>
        <button
          style={styles.qtyBtn}
          onClick={() => onQtyChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <span style={styles.qty}>{item.quantity}</span>
        <button
          style={styles.qtyBtn}
          onClick={() => onQtyChange(item.quantity + 1)}
        >
          +
        </button>
      </div>

      {/* Line total + remove */}
      <div style={styles.rowRight}>
        <span style={styles.lineTotal}>
          KES {lineTotal.toLocaleString()}
        </span>
        <button
          style={styles.removeBtn}
          onClick={onRemove}
          title="Remove item"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

const styles = {
  loadingPage: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { color: "var(--text-secondary)", fontSize: 15 },
  emptyPage: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContent: { textAlign: "center" },
  emptyTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 28,
    color: "var(--text-primary)",
    marginBottom: 12,
  },
  emptyText: { color: "var(--text-secondary)", fontSize: 15 },
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 40,
    flexWrap: "wrap",
    gap: 16,
  },
  eyebrow: {
    color: "var(--gold)",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 36,
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 40,
    alignItems: "start",
  },
  itemsList: { display: "flex", flexDirection: "column", gap: 16 },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: 20,
  },
  rowImage: {
    width: 80, height: 80,
    borderRadius: "var(--radius-sm)",
    overflow: "hidden",
    flexShrink: 0,
    background: "var(--bg-tertiary)",
  },
  rowInfo: { flex: 1, minWidth: 0 },
  rowName: {
    fontFamily: "var(--font-display)",
    fontSize: 16,
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: 4,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  rowCategory: {
    fontSize: 11,
    color: "var(--gold)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: 600,
  },
  rowPrice: {
    fontSize: 14,
    color: "var(--text-secondary)",
    marginTop: 4,
  },
  qtyControls: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "var(--bg-tertiary)",
    borderRadius: "var(--radius-sm)",
    padding: "6px 12px",
  },
  qtyBtn: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    fontSize: 18,
    cursor: "pointer",
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    transition: "all 0.2s",
  },
  qty: {
    fontSize: 15,
    fontWeight: 600,
    color: "var(--text-primary)",
    minWidth: 20,
    textAlign: "center",
  },
  rowRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 12,
    flexShrink: 0,
  },
  lineTotal: {
    fontFamily: "var(--font-display)",
    fontSize: 16,
    fontWeight: 700,
    color: "var(--gold)",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    fontSize: 13,
    padding: 4,
    transition: "color 0.2s",
  },
  summary: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: 28,
    position: "sticky",
    top: 84,
  },
  summaryTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 20,
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: 24,
  },
  summaryRows: { display: "flex", flexDirection: "column", gap: 14 },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 14, color: "var(--text-secondary)" },
  summaryValue: { fontSize: 14, fontWeight: 500, color: "var(--text-primary)" },
  shippingNote: {
    fontSize: 12,
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    background: "var(--border)",
    margin: "20px 0",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  totalValue: {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    fontWeight: 700,
    color: "var(--gold)",
  },
  checkoutBtn: {
    width: "100%",
    padding: 16,
    fontSize: 15,
    marginTop: 24,
  },
  continueLink: {
    display: "block",
    textAlign: "center",
    marginTop: 16,
    color: "var(--text-secondary)",
    fontSize: 13,
    textDecoration: "none",
    transition: "color 0.2s",
  },
};

export default Cart;