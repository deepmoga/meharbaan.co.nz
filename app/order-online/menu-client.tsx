"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CartItem,
  MenuProduct,
  MenuStore,
  SizeOption,
} from "@/lib/menu-types";

const cartKey = "meharbaan-cart";
const checkoutKey = "meharbaan-checkout";

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function todayName() {
  return new Intl.DateTimeFormat("en-NZ", {
    weekday: "long",
    timeZone: "Pacific/Auckland",
  }).format(
    new Date(),
  );
}

function halfFullPrices(product: MenuProduct) {
  const half = product.sizeOptions.find((option) => option.name.toLowerCase() === "half");
  const full = product.sizeOptions.find((option) => option.name.toLowerCase() === "full");
  if (!half || !full) return null;
  return {
    half: product.price + half.extra,
    full: product.price + full.extra,
  };
}

function lineId(product: MenuProduct, size?: SizeOption, spice?: string) {
  return `${product.id}-${size?.name ?? "regular"}-${spice ?? "standard"}`;
}

export default function MenuClient() {
  const [store, setStore] = useState<MenuStore | null>(null);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [time, setTime] = useState("");
  const [selected, setSelected] = useState<MenuProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetch("/api/menu", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("The menu could not be loaded.");
        return (await response.json()) as MenuStore;
      })
      .then((data) => {
        setStore(data);
        setActiveCategory(data.categories[0]?.id ?? "");
        setMode(data.orderOptions.delivery ? "delivery" : "pickup");
      })
      .catch((reason: Error) => setError(reason.message));

    const saved = window.localStorage.getItem(cartKey);
    if (saved) {
      queueMicrotask(() => {
        setCart(JSON.parse(saved) as CartItem[]);
      });
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart]);

  const products = useMemo(
    () =>
      store?.products.filter(
        (product) => product.active && product.categoryId === activeCategory,
      ) ?? [],
    [activeCategory, store],
  );
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const timeSlots =
    store?.timeSlots[todayName()] ??
    Object.values(store?.timeSlots ?? {})[0] ??
    [];

  function addItem(
    product: MenuProduct,
    options?: { size?: SizeOption; spice?: string; quantity?: number },
  ) {
    const id = lineId(product, options?.size, options?.spice);
    const quantity = options?.quantity ?? 1;
    const price = product.price + (options?.size?.extra ?? 0);
    setCart((items) => {
      const found = items.find((item) => item.id === id);
      if (found) {
        return items.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...items,
        {
          id,
          productId: product.id,
          name: product.name,
          price,
          quantity,
          size: options?.size,
          spice: options?.spice,
        },
      ];
    });
  }

  function addProduct(product: MenuProduct) {
    if (product.sizeOptions.length || product.spiceOptions.length) {
      setSelected(product);
    } else {
      addItem(product);
    }
  }

  function updateQuantity(id: string, change: number) {
    setCart((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function checkout() {
    window.localStorage.setItem(
      checkoutKey,
      JSON.stringify({ items: cart, mode, time }),
    );
    window.location.href = "/checkout";
  }

  if (error) {
    return (
      <main className="commerce-loading">
        <strong>{error}</strong>
        <p>Please refresh the page to try again.</p>
      </main>
    );
  }

  if (!store) {
    return <main className="commerce-loading">Preparing today&apos;s menu…</main>;
  }

  return (
    <main className="commerce-page">
      <section className="commerce-hero">
        <div className="commerce-hero-copy shell">
          <p className="eyebrow">Fresh from our kitchen</p>
          <h1>
            Choose your
            <br />
            <em>favourites.</em>
          </h1>
          <p>
            Authentic curries, tandoori plates, biryani, momos, vegan dishes and
            Indo-Chinese favourites—prepared fresh for pickup or delivery.
          </p>
        </div>
        <img src="/biryani.webp" alt="Aromatic Indian biryani" />
      </section>

      <section className="commerce-shell shell">
        <div className="menu-workspace">
          <div className="category-rail" aria-label="Menu categories">
            {store.categories.map((category) => (
              <button
                className={activeCategory === category.id ? "active" : ""}
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="menu-results">
            <div className="menu-results-heading">
              <div>
                <p>Explore the menu</p>
                <h2>
                  {store.categories.find(
                    (category) => category.id === activeCategory,
                  )?.name ?? "Menu"}
                </h2>
              </div>
              <span>{products.length} dishes</span>
            </div>
            <div className="online-product-grid">
              {products.map((product) => {
                const cartItem = cart.find((item) => item.productId === product.id);
                const qty = cartItem ? cartItem.quantity : 0;
                const portionPrices = halfFullPrices(product);
                return (
                  <article className="online-product-card" key={product.id}>
                    <div className="online-product-body">
                      <div className="online-product-title">
                        <h3>{product.name}</h3>
                        {portionPrices ? (
                          <strong className="portion-prices">
                            <span>Half {money(portionPrices.half)}</span>
                            <span>Full {money(portionPrices.full)}</span>
                          </strong>
                        ) : (
                          <strong>{money(product.price)}</strong>
                        )}
                      </div>
                      <p>
                        {product.description ||
                          "Prepared fresh to order in the Meharbaan kitchen."}
                      </p>
                      <div className="product-qty-controls">
                        {qty > 0 ? (
                          <>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => {
                                if (cartItem) updateQuantity(cartItem.id, -1);
                              }}
                            >
                              −
                            </button>
                            <span className="qty-value">{qty}</span>
                          </>
                        ) : null}
                        <button
                          type="button"
                          className="qty-btn qty-add"
                          onClick={() => addProduct(product)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <button
          className="cart-mobile-toggle"
          type="button"
          onClick={() => setCartOpen((value) => !value)}
        >
          <span>My order · {itemCount} items</span>
          <div className="cart-mobile-toggle-right">
            <strong>{money(total)}</strong>
            <span className="toggle-arrow" aria-hidden="true">
              {cartOpen ? "▼" : "▲"}
            </span>
          </div>
        </button>

        <aside className={`order-cart ${cartOpen ? "open" : ""}`}>
          <div className="order-cart-inner">
            <div className="order-cart-heading">
              <div>
                <span>Your order</span>
                <h2>Meharbaan</h2>
              </div>
              <button
                type="button"
                className="cart-close-btn"
                onClick={() => setCartOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="fulfilment-tabs">
              {store.orderOptions.delivery ? (
                <button
                  className={mode === "delivery" ? "active" : ""}
                  type="button"
                  onClick={() => setMode("delivery")}
                >
                  Delivery
                </button>
              ) : null}
              {store.orderOptions.pickup ? (
                <button
                  className={mode === "pickup" ? "active" : ""}
                  type="button"
                  onClick={() => setMode("pickup")}
                >
                  Pickup
                </button>
              ) : null}
            </div>
            <label>
              <span>{mode === "delivery" ? "Delivery" : "Pickup"} time</span>
              <select
                value={time}
                onChange={(event) => setTime(event.target.value)}
              >
                <option value="">Choose a time</option>
                {timeSlots.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </select>
            </label>
            <div className="order-lines">
              {cart.length ? (
                cart.map((item) => (
                  <div className="order-line" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <small>
                        {item.size?.name}
                        {item.size && item.spice ? " · " : ""}
                        {item.spice}
                      </small>
                      <span>{money(item.price * item.quantity)}</span>
                    </div>
                    <div className="line-quantity">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label={`Remove one ${item.name}`}
                      >
                        −
                      </button>
                      <b>{item.quantity}</b>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label={`Add one ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-order">
                  <span aria-hidden="true">✦</span>
                  <p>Your order is waiting for something delicious.</p>
                </div>
              )}
            </div>
            <div className="order-total">
              <span>Total</span>
              <strong>{money(total)}</strong>
            </div>
            <button
              className="cart-checkout"
              type="button"
              disabled={!cart.length || !time}
              onClick={checkout}
            >
              Continue to checkout <span aria-hidden="true">→</span>
            </button>
          </div>
        </aside>
      </section>

      {selected ? (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={(options) => {
            addItem(selected, options);
            setSelected(null);
          }}
        />
      ) : null}
    </main>
  );
}

function ProductModal({
  product,
  onClose,
  onAdd,
}: {
  product: MenuProduct;
  onClose: () => void;
  onAdd: (options: {
    size?: SizeOption;
    spice?: string;
    quantity: number;
  }) => void;
}) {
  const [size, setSize] = useState<SizeOption | undefined>(
    product.sizeOptions[0],
  );
  const [spice, setSpice] = useState(product.spiceOptions[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const total = (product.price + (size?.extra ?? 0)) * quantity;

  return (
    <div className="product-modal-backdrop" role="dialog" aria-modal="true">
      <div className="product-modal">
        <button className="modal-x" type="button" onClick={onClose}>
          ×
        </button>
        <p className="eyebrow navy">Make it yours</p>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        {product.sizeOptions.length ? (
          <label>
            <span>Size</span>
            <select
              value={size?.name}
              onChange={(event) =>
                setSize(
                  product.sizeOptions.find(
                    (option) => option.name === event.target.value,
                  ),
                )
              }
            >
              {product.sizeOptions.map((option) => (
                <option key={option.name} value={option.name}>
                  {option.name} · {money(product.price + option.extra)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {product.spiceOptions.length ? (
          <label>
            <span>Spice level</span>
            <select
              value={spice}
              onChange={(event) => setSpice(event.target.value)}
            >
              {product.spiceOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="modal-footer">
          <div className="line-quantity">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              −
            </button>
            <b>{quantity}</b>
            <button type="button" onClick={() => setQuantity(quantity + 1)}>
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => onAdd({ size, spice: spice || undefined, quantity })}
          >
            Add · {money(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
