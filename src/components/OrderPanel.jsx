import { useMemo, useState } from "react";
import {
  FaMinus,
  FaPlus,
  FaTimes,
  FaWhatsapp,
  FaMotorcycle,
  FaStore,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function OrderPanel({ phone, cart, setCart, isOpen, setIsOpen }) {
  const [note, setNote] = useState("");
  const [orderType, setOrderType] = useState("delivery");
  const [locationStatus, setLocationStatus] = useState("");
  const [customerLocation, setCustomerLocation] = useState(null);

  const total = useMemo(() => {
    return cart
      .reduce((sum, item) => sum + Number(item.price) * item.qty, 0)
      .toFixed(2);
  }, [cart]);

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
    setCustomerLocation(null);
    setLocationStatus("");
    setOrderType("delivery");
  }

  function requestLocation() {
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
        setLocationStatus("Location added to order.");
      },
      () => {
        setLocationStatus("Location permission was denied.");
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  }

  function sendWhatsAppOrder() {
    if (cart.length === 0) return;

    const orderLines = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} x${item.qty} - $${(
            Number(item.price) * item.qty
          ).toFixed(2)}`
      )
      .join("\n");

    const locationLine =
      orderType === "delivery"
        ? customerLocation
          ? `\nCustomer Location:\nhttps://www.google.com/maps?q=${customerLocation.lat},${customerLocation.lng}`
          : "\nCustomer Location: Not shared"
        : "\nCustomer Location: Pickup from store";

    const noteLine = note.trim() ? `\nNote: ${note.trim()}` : "";

    const message = `Hello The Street Food LB, I want to order:

Order Type: ${orderType.toUpperCase()}

${orderLines}

Total: $${total}${noteLine}${locationLine}`;

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
          Order List ({cart.length})
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 px-4 py-5 backdrop-blur-xl">
          <div className="card mx-auto flex max-h-full max-w-md flex-col overflow-hidden rounded-[1.75rem] shadow-2xl">
            <div className="flex items-center justify-between border-b border-theme p-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-soft">
                  Current Order
                </p>
                <h3 className="mt-1 text-xl font-black">Review Items</h3>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary flex h-10 w-10 items-center justify-center rounded-full"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <p className="glass rounded-2xl p-4 text-sm text-muted">
                  No items added yet.
                </p>
              ) : (
                <div className="grid gap-3">
                  {cart.map((item) => (
                    <div key={item.name} className="glass rounded-2xl p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black">{item.name}</p>
                          <p className="mt-1 text-xs text-soft">
                            ${item.price} each
                          </p>
                        </div>

                        <p className="text-sm font-black">
                          ${(Number(item.price) * item.qty).toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => decrease(item.name)}
                          className="btn-secondary flex h-8 w-8 items-center justify-center rounded-full text-xs"
                        >
                          <FaMinus />
                        </button>

                        <span className="w-8 text-center text-sm font-black">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => increase(item.name)}
                          className="btn-primary flex h-8 w-8 items-center justify-center rounded-full text-xs"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setOrderType("pickup");
                    setCustomerLocation(null);
                    setLocationStatus("");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
                    orderType === "pickup" ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  <FaStore />
                  Pickup
                </button>

                <button
                  onClick={() => setOrderType("delivery")}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
                    orderType === "delivery" ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  <FaMotorcycle />
                  Delivery
                </button>
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add note: no pickles, extra sauce, delivery details..."
                className="mt-4 min-h-24 w-full resize-none rounded-2xl border border-theme bg-transparent p-4 text-sm text-app outline-none placeholder:text-soft"
              />

              {orderType === "delivery" && (
                <button
                  onClick={requestLocation}
                  className="btn-secondary mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black"
                >
                  <FaMapMarkerAlt />
                  Share Current Location
                </button>
              )}

              {locationStatus && (
                <p className="mt-2 text-center text-xs text-muted">
                  {locationStatus}
                </p>
              )}
            </div>

            <div className="border-t border-theme p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-muted">Estimated Total</p>
                <p className="text-xl font-black">${total}</p>
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