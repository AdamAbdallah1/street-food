import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaHistory,
  FaMapMarkerAlt,
  FaMinus,
  FaMotorcycle,
  FaPhoneAlt,
  FaPlus,
  FaReceipt,
  FaStore,
  FaTimes,
  FaTrash,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa";

import toast from "react-hot-toast";

const DELIVERY_FEE = 1;

const CART_STORAGE_KEY = "streetfood_cart";
const LAST_ORDER_KEY = "streetfood_last_order";

export default function OrderPanel({
  phone,
  cart,
  setCart,
  isOpen,
  setIsOpen,
}) {
  const panelRef = useRef(null);

  const startY = useRef(0);
  const currentY = useRef(0);

  const [dragging, setDragging] = useState(false);

  const [note, setNote] = useState("");
  const [orderType, setOrderType] =
    useState("delivery");

  const [customerName, setCustomerName] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [manualAddress, setManualAddress] =
    useState("");

  const [customerLocation, setCustomerLocation] =
    useState(null);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [lastOrder, setLastOrder] =
    useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem(
      CART_STORAGE_KEY
    );

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const recent = localStorage.getItem(
      LAST_ORDER_KEY
    );

    if (recent) {
      setLastOrder(JSON.parse(recent));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + Number(item.price) * item.qty,
      0
    );
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.qty,
      0
    );
  }, [cart]);

  const deliveryFee =
    orderType === "delivery" &&
    cart.length > 0
      ? DELIVERY_FEE
      : 0;

  const total = (
    subtotal + deliveryFee
  ).toFixed(2);

  function vibrate(type = "light") {
    if (!navigator.vibrate) return;

    if (type === "light") {
      navigator.vibrate(10);
    }

    if (type === "success") {
      navigator.vibrate([20, 50, 20]);
    }
  }

  function increase(name) {
    vibrate();

    setCart((current) =>
      current.map((item) =>
        item.name === name
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item
      )
    );
  }

  function decrease(name) {
    vibrate();

    setCart((current) =>
      current
        .map((item) =>
          item.name === name
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function clearOrder() {
    setCart([]);

    localStorage.removeItem(
      CART_STORAGE_KEY
    );

    toast("Order cleared");
  }

  function restoreLastOrder() {
    if (!lastOrder?.items) return;

    setCart(lastOrder.items);

    toast.success("Order restored");
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      toast.error(
        "Location not supported"
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomerLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        toast.success("Location added");

        vibrate("success");
      },
      () => {
        toast.error("Location denied");
      }
    );
  }

  function sendWhatsAppOrder() {
    if (cart.length === 0) {
      toast.error("Add items first");
      return;
    }

    const orderLines = cart
      .map(
        (item) =>
          `• ${item.name} x${item.qty}`
      )
      .join("\n");

    const locationLine =
      orderType === "delivery"
        ? customerLocation
          ? `https://www.google.com/maps?q=${customerLocation.lat},${customerLocation.lng}`
          : manualAddress
        : "Pickup";

    const message = `NEW ORDER

${orderLines}

Total: $${total}

Customer:
${customerName || "Not provided"}

Phone:
${customerPhone || "Not provided"}

Location:
${locationLine}

Note:
${note || "No note"}
`;

    localStorage.setItem(
      LAST_ORDER_KEY,
      JSON.stringify({
        items: cart,
        total,
      })
    );

    setLastOrder({
      items: cart,
      total,
    });

    setShowSuccess(true);

    vibrate("success");

    setTimeout(() => {
      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(
          message
        )}`
      );
    }, 900);
  }

  function handleTouchStart(e) {
    startY.current =
      e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    currentY.current =
      e.touches[0].clientY;

    const diff =
      currentY.current - startY.current;

    if (diff > 0) {
      setDragging(true);

      if (panelRef.current) {
        panelRef.current.style.transform = `translateY(${diff}px)`;
      }
    }
  }

  function handleTouchEnd() {
    const diff =
      currentY.current - startY.current;

    if (diff > 140) {
      setIsOpen(false);
    }

    if (panelRef.current) {
      panelRef.current.style.transform =
        "translateY(0px)";
    }

    setDragging(false);
  }

  return (
    <>
      {cart.length > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="cart-bubble fixed left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center justify-center gap-3 rounded-full px-5 py-3 text-xs font-black shadow-2xl"
        >
          <FaWhatsapp />

          {totalItems} Items • ${total}
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl">
          <div
            ref={panelRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`order-sheet fixed bottom-0 left-0 right-0 mx-auto flex h-[94vh] max-w-md flex-col overflow-hidden rounded-t-[2rem] border border-theme bg-[var(--card)] transition-transform ${
              dragging
                ? ""
                : "duration-300"
            }`}
          >
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[var(--soft)]" />

            {showSuccess ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-black">
                  <FaCheckCircle className="text-4xl" />
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  Order Sent
                </h2>

                <p className="mt-2 text-sm text-muted">
                  Redirecting to WhatsApp...
                </p>
              </div>
            ) : (
              <>
                <header className="border-b border-theme px-4 pb-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-soft">
                        Checkout
                      </p>

                      <h2 className="mt-1 text-xl font-black">
                        Your Order
                      </h2>
                    </div>

                    <button
                      onClick={() =>
                        setIsOpen(false)
                      }
                      className="btn-primary flex h-10 w-10 items-center justify-center rounded-full"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </header>

                <div className="order-scroll flex-1 overflow-y-auto px-4 py-4">

                  {lastOrder?.items && (
                    <button
                      onClick={
                        restoreLastOrder
                      }
                      className="btn-secondary mb-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black"
                    >
                      <FaHistory />
                      Order Again
                    </button>
                  )}

                  <div className="grid gap-3">
                    {cart.map((item) => (
                      <div
                        key={item.name}
                        className="glass rounded-3xl p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-black">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-soft">
                              ${item.price}
                            </p>
                          </div>

                          <p className="text-sm font-black">
                            $
                            {(
                              Number(
                                item.price
                              ) * item.qty
                            ).toFixed(2)}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                decrease(
                                  item.name
                                )
                              }
                              className="btn-secondary flex h-9 w-9 items-center justify-center rounded-full"
                            >
                              <FaMinus />
                            </button>

                            <span className="w-8 text-center text-sm font-black">
                              {item.qty}
                            </span>

                            <button
                              onClick={() =>
                                increase(
                                  item.name
                                )
                              }
                              className="btn-primary flex h-9 w-9 items-center justify-center rounded-full"
                            >
                              <FaPlus />
                            </button>
                          </div>

                          <button
                            onClick={
                              clearOrder
                            }
                            className="text-soft"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3">
                    <Field
                      icon={<FaUser />}
                      value={customerName}
                      onChange={
                        setCustomerName
                      }
                      placeholder="Your name"
                    />

                    <Field
                      icon={<FaPhoneAlt />}
                      value={customerPhone}
                      onChange={
                        setCustomerPhone
                      }
                      placeholder="Phone number"
                    />
                  </div>

                  {orderType ===
                    "delivery" && (
                    <>
                      <button
                        onClick={
                          requestLocation
                        }
                        className="btn-secondary mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black"
                      >
                        <FaMapMarkerAlt />
                        Share Location
                      </button>

                      <textarea
                        value={
                          manualAddress
                        }
                        onChange={(e) =>
                          setManualAddress(
                            e.target.value
                          )
                        }
                        placeholder="Delivery address..."
                        className="mt-3 min-h-24 w-full resize-none rounded-2xl border border-theme bg-transparent p-4 text-sm outline-none placeholder:text-soft"
                      />
                    </>
                  )}

                  <textarea
                    value={note}
                    onChange={(e) =>
                      setNote(
                        e.target.value
                      )
                    }
                    placeholder="Extra notes..."
                    className="mt-4 min-h-20 w-full resize-none rounded-2xl border border-theme bg-transparent p-4 text-sm outline-none placeholder:text-soft"
                  />
                </div>

                <footer className="order-footer border-t border-theme p-4">
                  <div className="mb-4 flex items-center justify-between rounded-3xl border border-theme p-4">
                    <div>
                      <p className="text-xs text-muted">
                        Total
                      </p>

                      <p className="mt-1 text-2xl font-black">
                        ${total}
                      </p>
                    </div>

                    <button
                      onClick={
                        sendWhatsAppOrder
                      }
                      className="btn-primary rounded-full px-6 py-4 text-sm font-black"
                    >
                      Order Now
                    </button>
                  </div>
                </footer>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  icon,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-theme px-4 py-3">
      <span className="text-soft">
        {icon}
      </span>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-soft"
      />
    </div>
  );
}