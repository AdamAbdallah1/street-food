import { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaTimes,
  FaWhatsapp,
  FaMotorcycle,
  FaStore,
  FaMapMarkerAlt,
  FaUser,
  FaPhoneAlt,
  FaCheckCircle,
  FaReceipt,
} from "react-icons/fa";

const DELIVERY_FEE = 1;

export default function OrderPanel({ phone, cart, setCart, isOpen, setIsOpen }) {
  const [note, setNote] = useState("");
  const [orderType, setOrderType] = useState("delivery");
  const [locationStatus, setLocationStatus] = useState("");
  const [customerLocation, setCustomerLocation] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [error, setError] = useState("");

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const deliveryFee =
    orderType === "delivery" && cart.length > 0 ? DELIVERY_FEE : 0;

  const total = (subtotal + deliveryFee).toFixed(2);

  const hasDeliveryLocation =
    orderType === "pickup" ||
    customerLocation ||
    manualAddress.trim().length >= 5;

  function increase(name) {
    if (navigator.vibrate) navigator.vibrate(15);

    setCart((current) =>
      current.map((item) =>
        item.name === name ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }

  function decrease(name) {
    if (navigator.vibrate) navigator.vibrate(15);

    setCart((current) =>
      current
        .map((item) =>
          item.name === name ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function clearOrder() {
    setCart([]);
    setNote("");
    setCustomerName("");
    setCustomerPhone("");
    setManualAddress("");
    setCustomerLocation(null);
    setLocationStatus("");
    setError("");
    setOrderType("delivery");
  }

  function closeAndScrollToMenu() {
    setIsOpen(false);

    setTimeout(() => {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  }

  function requestLocation() {
    setError("");

    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported on this device.");
      return;
    }

    setLocationStatus("Requesting location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomerLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        setLocationStatus("Location added successfully.");
      },
      () => {
        setLocationStatus(
          "Location permission was denied. You can type your address instead."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  }

  function sendWhatsAppOrder() {
    setError("");

    if (cart.length === 0) {
      setError("Add at least one item first.");
      return;
    }

    if (orderType === "delivery" && !hasDeliveryLocation) {
      setError("For delivery, share your location or type your address.");
      return;
    }

    const orderLines = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} x${item.qty} - $${(
            Number(item.price) * item.qty
          ).toFixed(2)}`
      )
      .join("\n");

    const customerLines = `Name: ${
      customerName.trim() || "Not provided"
    }\nPhone: ${customerPhone.trim() || "Not provided"}`;

    const locationLine =
      orderType === "delivery"
        ? customerLocation
          ? `Google Maps:\nhttps://www.google.com/maps?q=${customerLocation.lat},${customerLocation.lng}`
          : `Address:\n${manualAddress.trim()}`
        : "Pickup from store";

    const noteLine = note.trim() ? note.trim() : "No note";

    const message = `NEW ORDER - The Street Food LB

Type: ${orderType.toUpperCase()}

Items:
${orderLines}

Subtotal: $${subtotal.toFixed(2)}
Delivery: $${deliveryFee.toFixed(2)}
Total: $${total}

Customer:
${customerLines}

Location:
${locationLine}

Note:
${noteLine}`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  }

  return (
    <>
      {cart.length > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="cart-bubble fixed left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full px-5 py-3 text-xs font-black shadow-2xl"
        >
          <FaWhatsapp />
          Order List ({totalItems})
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/60 px-0 pb-0 pt-8 backdrop-blur-xl sm:items-center sm:px-4 sm:py-5">
          <div className="card order-sheet mx-auto flex h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-[2rem] shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-[1.75rem]">
            <div className="order-grabber mx-auto mt-2 h-1.5 w-12 rounded-full bg-[var(--soft)] sm:hidden" />

            <div className="flex items-center justify-between border-b border-theme px-4 pb-4 pt-3 sm:p-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-soft">
                  Checkout
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <h3 className="text-xl font-black">Review Order</h3>
                  {cart.length > 0 && (
                    <span className="rounded-full bg-[var(--primary)] px-2 py-1 text-[10px] font-black text-[var(--primary-text)]">
                      {totalItems} items
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary flex h-10 w-10 items-center justify-center rounded-full"
                aria-label="Close order panel"
              >
                <FaTimes />
              </button>
            </div>

            <div className="order-scroll flex-1 overflow-y-auto px-4 py-4">
              <SectionTitle number="01" title="Items" />

              {cart.length === 0 ? (
                <div className="glass rounded-3xl p-5 text-center">
                  <FaReceipt className="mx-auto text-2xl text-soft" />
                  <p className="mt-3 text-sm font-black">No items added yet.</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Add items from the menu to start the order.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {cart.map((item) => (
                    <div key={item.name} className="glass rounded-3xl p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-sm font-black">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-soft">
                            ${item.price} each
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-black">
                          ${(Number(item.price) * item.qty).toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decrease(item.name)}
                            className="btn-secondary flex h-9 w-9 items-center justify-center rounded-full text-xs"
                            aria-label="Decrease quantity"
                          >
                            <FaMinus />
                          </button>

                          <span className="w-8 text-center text-sm font-black">
                            {item.qty}
                          </span>

                          <button
                            onClick={() => increase(item.name)}
                            className="btn-primary flex h-9 w-9 items-center justify-center rounded-full text-xs"
                            aria-label="Increase quantity"
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <p className="rounded-full border border-theme px-3 py-1 text-[11px] font-black text-muted">
                          Qty {item.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={closeAndScrollToMenu}
                className="btn-secondary mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black"
              >
                <FaArrowLeft />
                Add More Items
              </button>

              <SectionTitle number="02" title="Order Type" />

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setOrderType("pickup");
                    setCustomerLocation(null);
                    setManualAddress("");
                    setLocationStatus("");
                    setError("");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
                    orderType === "pickup" ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  <FaStore />
                  Pickup
                </button>

                <button
                  onClick={() => {
                    setOrderType("delivery");
                    setError("");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
                    orderType === "delivery" ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  <FaMotorcycle />
                  Delivery
                </button>
              </div>

              <SectionTitle number="03" title="Customer Info" />

              <div className="grid gap-3">
                <FieldShell icon={<FaUser />}>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer name optional"
                    className="w-full bg-transparent text-sm text-app outline-none placeholder:text-soft"
                  />
                </FieldShell>

                <FieldShell icon={<FaPhoneAlt />}>
                  <input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Customer phone optional"
                    inputMode="tel"
                    className="w-full bg-transparent text-sm text-app outline-none placeholder:text-soft"
                  />
                </FieldShell>
              </div>

              {orderType === "delivery" && (
                <>
                  <SectionTitle number="04" title="Delivery Details" />

                  <div className="rounded-3xl border border-theme bg-transparent p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-soft">
                        Delivery Fee
                      </p>
                      <p className="text-sm font-black">
                        ${deliveryFee.toFixed(2)}
                      </p>
                    </div>

                    <p className="mt-1 text-xs text-muted">
                      Delivery starts from $1. Final fee may vary by area.
                    </p>
                  </div>

                  <button
                    onClick={requestLocation}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black ${
                      customerLocation ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {customerLocation ? <FaCheckCircle /> : <FaMapMarkerAlt />}
                    {customerLocation ? "Location Added" : "Share Current Location"}
                  </button>

                  <textarea
                    value={manualAddress}
                    onChange={(e) => {
                      setManualAddress(e.target.value);
                      setError("");
                    }}
                    placeholder="Or type delivery address manually..."
                    className="mt-3 min-h-20 w-full resize-none rounded-2xl border border-theme bg-transparent p-4 text-sm text-app outline-none placeholder:text-soft"
                  />

                  {locationStatus && (
                    <p className="mt-2 text-center text-xs text-muted">
                      {locationStatus}
                    </p>
                  )}
                </>
              )}

              <SectionTitle number={orderType === "delivery" ? "05" : "04"} title="Order Note" />

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="No pickles, extra sauce, delivery details..."
                className="min-h-24 w-full resize-none rounded-2xl border border-theme bg-transparent p-4 text-sm text-app outline-none placeholder:text-soft"
              />

              {error && (
                <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-xs font-bold text-red-400">
                  {error}
                </p>
              )}
            </div>

            <div className="order-footer border-t border-theme p-4">
              <div className="mb-3 rounded-3xl border border-theme bg-transparent p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm text-muted">Subtotal</p>
                  <p className="text-sm font-black">${subtotal.toFixed(2)}</p>
                </div>

                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-muted">
                    Delivery {orderType === "delivery" ? "" : "(Pickup)"}
                  </p>
                  <p className="text-sm font-black">${deliveryFee.toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between border-t border-theme pt-3">
                  <p className="text-sm font-black">Estimated Total</p>
                  <p className="text-2xl font-black">${total}</p>
                </div>
              </div>

              <div className="grid grid-cols-[0.7fr_1.3fr] gap-3">
                <button
                  onClick={clearOrder}
                  className="btn-secondary rounded-full px-4 py-3 text-xs font-black"
                >
                  Clear
                </button>

                <button
                  onClick={sendWhatsAppOrder}
                  disabled={cart.length === 0}
                  className="btn-primary rounded-full px-4 py-3 text-xs font-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send WhatsApp Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionTitle({ number, title }) {
  return (
    <div className="mb-3 mt-5 flex items-center gap-3 first:mt-0">
      <span className="rounded-full border border-theme px-2.5 py-1 text-[10px] font-black text-soft">
        {number}
      </span>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-soft">
        {title}
      </p>
    </div>
  );
}

function FieldShell({ icon, children }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-theme bg-transparent px-4 py-3">
      <span className="text-sm text-soft">{icon}</span>
      {children}
    </div>
  );
}