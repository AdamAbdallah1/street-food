import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaSearch,
  FaShareAlt,
  FaHeart,
  FaUtensils,
  FaQrcode,
  FaMotorcycle,
  FaClock,
} from "react-icons/fa";
import logo from "./assets/streetfood-logo.jpg";
import { categories, items } from "./data/menu";
import OrderPanel from "./components/OrderPanel";
import ItemActions from "./components/ItemActions";
import BackToTop from "./components/BackToTop";
import ThemeToggle from "./components/ThemeToggle";

const phone = "96176884818";
const mapLink = "https://maps.app.goo.gl/xbshzPMtQXAxVaGw5";
const menuUrl = "https://cedarstech.info/demo/street-food/";
const FAVORITES_KEY = "streetfood_saved_items";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedNames, setSavedNames] = useState([]);
  const [loading, setLoading] = useState(true);

  const featuredItem = items.find((item) => item.image) || items[0];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1300);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/demo/street-food/sw.js")
    }

    setSavedNames(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));

    return () => clearTimeout(timer);
  }, []);

  function refreshSaved() {
    setSavedNames(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
  }

  const filteredItems = useMemo(() => {
  const query = search.trim().toLowerCase();

  return items.filter((item) => {
    const categoryMatch =
      activeCategory === "All" || item.category === activeCategory;

    if (!categoryMatch) return false;

    const savedMatch = !showSavedOnly || savedNames.includes(item.name);

    if (!savedMatch) return false;

    if (!query) return true;

    return (
      item.name.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query)
    );
  });
}, [activeCategory, search, showSavedOnly, savedNames]);

  function addToCart(item) {
    if (navigator.vibrate) navigator.vibrate(25);

    setCart((current) => {
      const exists = current.find((cartItem) => cartItem.name === item.name);

      if (exists) {
        return current.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }

      return [...current, { ...item, qty: 1 }];
    });
  }

  function quickOrder(item) {
    addToCart(item);
    setIsOrderOpen(true);
  }

  async function shareMenu() {
    const shareData = {
      title: "The Street Food LB Menu",
      text: "Check The Street Food LB digital menu.",
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Menu link copied.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-app text-app">
      <AnimatePresence>{loading && <SplashLoader logo={logo} />}</AnimatePresence>

      <section className="relative overflow-hidden px-4 pb-14 pt-4 sm:px-6 lg:min-h-screen lg:px-8">
        <div className="hero-bg" />
        <div className="grid-bg" />

        <nav className="glass relative z-20 mx-auto flex max-w-6xl items-center justify-between rounded-full px-3 py-2 shadow-2xl">
          <a href="#" className="flex min-w-0 items-center gap-3">
            <img
              src={logo}
              alt="The Street Food LB"
              className="h-9 w-9 shrink-0 rounded-full border border-theme object-cover sm:h-10 sm:w-10"
            />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-black uppercase tracking-[-0.02em] sm:text-[13px]">
                The Street Food
              </p>
              <p className="text-[10px] font-semibold text-soft">#foodhub</p>
            </div>
          </a>

          <div className="hidden items-center gap-6 text-xs font-bold text-muted md:flex">
            <a href="#menu" className="transition hover:text-app">
              Menu
            </a>
            <a href="#qr" className="transition hover:text-app">
              QR
            </a>
            <a href="#location" className="transition hover:text-app">
              Location
            </a>
            <button onClick={shareMenu} className="transition hover:text-app">
              Share
            </button>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOrderOpen(true)}
              className="btn-primary shrink-0 rounded-full px-4 py-2 text-[11px] font-black transition active:scale-95 sm:text-xs"
            >
              Order {cart.length > 0 ? `(${cart.length})` : ""}
            </button>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-6xl gap-8 pt-9 sm:pt-12 lg:min-h-[calc(100vh-88px)] lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:pt-3">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="text-center lg:text-left"
          >
            <OpeningStatus />

            <h1 className="mx-auto mt-4 max-w-[440px] text-[2.75rem] font-black uppercase leading-[0.86] tracking-[-0.075em] min-[380px]:text-[3.05rem] sm:text-6xl md:text-7xl lg:mx-0 lg:max-w-[560px] lg:text-[5.8rem]">
              Street
              <span className="block text-fade">Food</span>
            </h1>

            <p className="mx-auto mt-5 max-w-md text-[13px] font-medium leading-6 text-muted sm:text-sm sm:leading-7 lg:mx-0">
              Loaded baked potatoes, burgers, wings, wraps, hotdogs and fries —
              built into a clean mobile-first menu.
            </p>

            <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3 sm:flex sm:max-w-none sm:justify-center lg:justify-start">
              <a
                href="#menu"
                className="btn-primary rounded-full px-5 py-3 text-center text-xs font-black transition active:scale-95 sm:text-sm"
              >
                Explore Menu
              </a>

              <button
                onClick={shareMenu}
                className="btn-secondary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-center text-xs font-black transition active:scale-95 sm:text-sm"
              >
                <FaShareAlt className="text-[11px]" />
                Share
              </button>
            </div>

            <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-2 lg:mx-0">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-2xl p-2.5 sm:p-3"
                >
                  <p className="text-sm font-black tracking-tight sm:text-base">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[9px] font-semibold text-soft sm:text-[10px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="relative mx-auto w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[470px]"
          >
            <div className="glow absolute -inset-6 rounded-full blur-3xl" />

            <div className="glass relative overflow-hidden rounded-[1.7rem] p-2 shadow-2xl">
              <div className="relative overflow-hidden rounded-[1.25rem] bg-card">
                <img
                  src={featuredItem.image}
                  alt={featuredItem.name}
                  className="h-[310px] w-full object-cover min-[380px]:h-[340px] sm:h-[420px] lg:h-[450px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

                <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/80 backdrop-blur">
                  Signature
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/55 sm:text-[10px]">
                    Most Wanted
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <h3 className="max-w-[210px] text-lg font-black tracking-tight sm:max-w-[250px] sm:text-xl">
                      {featuredItem.name}
                    </h3>

                    <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-black text-black">
                      ${featuredItem.price}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(featuredItem)}
                    className="mt-4 w-full rounded-full bg-white px-4 py-3 text-xs font-black text-black transition active:scale-95"
                  >
                    Add Signature To Order
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="menu" className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-soft">
                Digital Menu
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
                Full Menu
              </h2>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="glass flex flex-1 items-center gap-3 rounded-full px-4 py-3">
              <FaSearch className="text-sm text-soft" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search burgers, fries, wings..."
                className="w-full bg-transparent text-sm font-semibold text-app outline-none placeholder:text-soft"
              />
            </div>

            <button
              onClick={() => setShowSavedOnly((value) => !value)}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-black transition ${
                showSavedOnly ? "btn-primary" : "btn-secondary"
              }`}
            >
              <FaHeart className="text-[11px]" />
              Saved ({savedNames.length})
            </button>
          </div>

          <div className="sticky top-3 z-30 -mx-4 mb-7 overflow-x-auto border-y border-theme bg-app/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-full sm:border">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                    activeCategory === category ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="glass rounded-[1.5rem] p-8 text-center">
              <FaUtensils className="mx-auto text-2xl text-soft" />
              <h3 className="mt-3 text-lg font-black">No items found</h3>
              <p className="mt-2 text-sm text-muted">
                Try another search or category.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, index) =>
                item.image ? (
                  <FoodCard
                    key={item.name}
                    item={item}
                    index={index}
                    onAddToCart={addToCart}
                    onQuickOrder={quickOrder}
                    onSavedChange={refreshSaved}
                  />
                ) : (
                  <SimpleCard
                    key={item.name}
                    item={item}
                    index={index}
                    onAddToCart={addToCart}
                    onQuickOrder={quickOrder}
                    onSavedChange={refreshSaved}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      <section
        id="qr"
        className="relative px-4 pb-6 pt-4 sm:px-6 lg:px-8"
      >
        <div className="card mx-auto max-w-6xl overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted">
                <FaQrcode />
                QR Ready
              </div>

              <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
                Scan & Order
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-muted">
                Customers scan the QR code from the counter or social media,
                browse the menu, add items, share location and send the order
                directly on WhatsApp.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="glass rounded-2xl p-4">
                  <FaQrcode className="text-lg text-soft" />
                  <p className="mt-3 text-sm font-black">QR Menu</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Ready for print.
                  </p>
                </div>

                <div className="glass rounded-2xl p-4">
                  <FaWhatsapp className="text-lg text-soft" />
                  <p className="mt-3 text-sm font-black">WhatsApp Order</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Sends full cart.
                  </p>
                </div>

                <div className="glass rounded-2xl p-4">
                  <FaMotorcycle className="text-lg text-soft" />
                  <p className="mt-3 text-sm font-black">Delivery Flow</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Location enabled.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative rounded-[2rem] border border-theme bg-white p-5 shadow-2xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                    menuUrl
                  )}`}
                  alt="The Street Food LB QR Code"
                  className="h-[230px] w-[230px] sm:h-[260px] sm:w-[260px]"
                />

                <div className="absolute -bottom-4 left-1/2 w-[88%] -translate-x-1/2 rounded-full bg-black px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-xl">
                  Scan The Menu
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="location"
        className="relative px-4 pb-24 pt-5 sm:px-6 lg:px-8"
      >
        <div className="card mx-auto max-w-6xl overflow-hidden rounded-[2rem]">
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="glow absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl" />

              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-soft">
                Visit & Delivery
              </p>

              <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
                Location & Contact
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-muted">
                Built for fast delivery orders: customer chooses pickup or
                delivery, shares location, then sends everything on WhatsApp.
              </p>

              <div className="mt-7 grid gap-3">
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-soft">
                        Opening Status
                      </p>
                      <p className="mt-2 text-sm font-black">
                        Open Now • Delivery Available
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[11px] font-black text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      LIVE
                    </div>
                  </div>
                </div>

                <ActionButton
                  href={mapLink}
                  icon={<FaMapMarkerAlt />}
                  title="Open Google Maps"
                />

                <ActionButton
                  href={`https://wa.me/${phone}`}
                  icon={<FaWhatsapp />}
                  title="WhatsApp Delivery"
                />

                <ActionButton
                  href="tel:+96176884818"
                  icon={<FaPhoneAlt />}
                  title="Call 76 884 818"
                />

                <ActionButton
                  href="https://instagram.com/thestreetfoodlb"
                  icon={<FaInstagram />}
                  title="@thestreetfoodlb"
                />
              </div>
            </div>

            <div className="relative min-h-[430px] overflow-hidden border-t border-theme lg:border-l lg:border-t-0">
              <iframe
                title="The Street Food LB Location"
                src="https://www.google.com/maps?q=The%20Street%20Food%20LB&output=embed"
                className="absolute inset-0 h-full w-full map-frame"
                loading="lazy"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-5">
                <div className="glass flex items-center justify-between gap-4 rounded-2xl p-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                      Fast Access
                    </p>

                    <p className="mt-1 text-sm font-black text-white">
                      Open map or order directly
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/${phone}`}
                    target="_blank"
                    className="rounded-full bg-white px-4 py-2 text-xs font-black text-black"
                  >
                    Order
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OrderPanel
        phone={phone}
        cart={cart}
        setCart={setCart}
        isOpen={isOrderOpen}
        setIsOpen={setIsOrderOpen}
      />

      <MobileDock
        cart={cart}
        openOrder={() => setIsOrderOpen(true)}
        shareMenu={shareMenu}
      />

      <BackToTop />
    </main>
  );
}

function SplashLoader({ logo }) {
  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-app"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.86 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <img
          src={logo}
          alt="The Street Food LB"
          className="mx-auto h-24 w-24 rounded-full border border-theme object-cover shadow-2xl"
        />
        <p className="mt-5 text-[11px] font-black uppercase tracking-[0.3em] text-soft">
          The Street Food
        </p>
      </motion.div>
    </motion.div>
  );
}

function OpeningStatus() {
  return (
    <div className="glass mx-auto inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted lg:mx-0">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      Open Now • Delivery Available
    </div>
  );
}

function FoodCard({ item, index, onAddToCart, onQuickOrder, onSavedChange }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.025, 0.18) }}
      className="card group will-change-transform overflow-hidden rounded-[1.45rem] transition hover:-translate-y-1"
    >
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-black">
          ${item.price}
        </span>

        {item.badge && (
          <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/65 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-xl">
            {item.badge}
          </div>
        )}

        <p className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/75 backdrop-blur">
          {item.category}
        </p>
      </div>

      <div className="p-4">
        <h3 className="text-base font-black leading-tight tracking-tight">
          {item.name}
        </h3>

        <p className="mt-2 text-[13px] leading-6 text-muted">{item.desc}</p>

        <ItemActions
          item={item}
          onAddToCart={onAddToCart}
          onQuickOrder={onQuickOrder}
          onSavedChange={onSavedChange}
        />
      </div>
    </motion.article>
  );
}

function SimpleCard({ item, index, onAddToCart, onQuickOrder, onSavedChange }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.025, 0.18) }}
      className="card rounded-[1.35rem] p-4 transition hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-soft">
              {item.category}
            </p>

            {item.badge && (
              <span className="rounded-full bg-[var(--primary)] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[var(--primary-text)]">
                {item.badge}
              </span>
            )}
          </div>

          <h3 className="mt-1.5 text-base font-black leading-tight tracking-tight">
            {item.name}
          </h3>
          <p className="mt-2 text-[13px] leading-6 text-muted">{item.desc}</p>
        </div>

        <span className="shrink-0 rounded-full bg-[var(--text)] px-3 py-1 text-xs font-black text-[var(--bg)]">
          ${item.price}
        </span>
      </div>

      <ItemActions
        item={item}
        onAddToCart={onAddToCart}
        onQuickOrder={onQuickOrder}
        onSavedChange={onSavedChange}
      />
    </motion.article>
  );
}

function MobileDock({ cart, openOrder, shareMenu }) {
  return (
    <div className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-1.2rem)] max-w-sm -translate-x-1/2 md:hidden">
      <div className="liquid-dock flex items-center justify-between rounded-full px-2 py-2">
        <a
          href="#menu"
          className="flex-1 rounded-full px-3 py-3 text-center text-[11px] font-black text-muted transition active:scale-95"
        >
          Menu
        </a>

        <button
          onClick={openOrder}
          className="btn-primary flex-1 rounded-full px-3 py-3 text-[11px] font-black shadow-xl transition active:scale-95"
        >
          Order {cart.length > 0 ? `(${cart.length})` : ""}
        </button>

        <button
          onClick={shareMenu}
          className="flex-1 rounded-full px-3 py-3 text-[11px] font-black text-muted transition active:scale-95"
        >
          Share
        </button>
      </div>
    </div>
  );
}

function ActionButton({ href, icon, title }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      className="btn-secondary flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold"
    >
      <span className="flex items-center gap-3">
        <span className="text-base">{icon}</span>
        {title}
      </span>
      <span>↗</span>
    </a>
  );
}

const stats = [
  { value: "12+", label: "Categories" },
  { value: "40+", label: "Items" },
  { value: "QR", label: "Ready" },
];