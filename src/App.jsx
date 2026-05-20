import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import logo from "./assets/streetfood-logo.jpg";
import { categories, items } from "./data/menu";

const phone = "96176884818";
const mapLink = "https://maps.app.goo.gl/xbshzPMtQXAxVaGw5";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");

  const featuredItem = items.find((item) => item.image) || items[0];

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#060606] text-white">
      <section className="relative overflow-hidden px-4 pb-14 pt-4 sm:px-6 lg:min-h-screen lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-15%,rgba(255,255,255,0.14),transparent_34%),linear-gradient(180deg,#111_0%,#060606_58%,#030303_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:38px_38px]" />

        <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/45 px-3 py-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <a href="#" className="flex min-w-0 items-center gap-3">
            <img
              src={logo}
              alt="The Street Food LB"
              className="h-9 w-9 shrink-0 rounded-full border border-white/15 object-cover sm:h-10 sm:w-10"
            />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-black uppercase tracking-[-0.02em] sm:text-[13px]">
                The Street Food
              </p>
              <p className="text-[10px] font-semibold text-white/40">
                #foodhub
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-6 text-xs font-bold text-white/55 md:flex">
            <a href="#menu" className="transition hover:text-white">
              Menu
            </a>
            <a href="#location" className="transition hover:text-white">
              Location
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </div>

          <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            className="shrink-0 rounded-full bg-white px-4 py-2 text-[11px] font-black text-black transition hover:scale-[1.03] active:scale-95 sm:text-xs"
          >
            Order
          </a>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-6xl gap-8 pt-9 sm:pt-12 lg:min-h-[calc(100vh-88px)] lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="text-center lg:text-left"
          >

            <h1 className="mx-auto max-w-[440px] text-[2.75rem] font-black uppercase leading-[0.86] tracking-[-0.075em] min-[380px]:text-[3.05rem] sm:text-6xl md:text-7xl lg:mx-0 lg:max-w-[560px] lg:text-[5.8rem]">
              Street
              <span className="block text-white/28">Food</span>
              <span className="mt-2 block text-[0.25em] leading-none tracking-[0.3em] text-white/58">
                Loaded Daily
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-md text-[13px] font-medium leading-6 text-white/56 sm:text-sm sm:leading-7 lg:mx-0">
              Loaded baked potatoes, burgers, wings, wraps, hotdogs and fries —
              built into a clean mobile-first menu.
            </p>

            <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3 sm:flex sm:max-w-none sm:justify-center lg:justify-start">
              <a
                href="#menu"
                className="rounded-full bg-white px-5 py-3 text-center text-xs font-black text-black transition hover:scale-[1.03] active:scale-95 sm:text-sm"
              >
                Explore Menu
              </a>

              <a
                href={mapLink}
                target="_blank"
                className="rounded-full border border-white/15 bg-white/[0.035] px-5 py-3 text-center text-xs font-black text-white transition hover:bg-white hover:text-black active:scale-95 sm:text-sm"
              >
                Location
              </a>
            </div>

            <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-2 lg:mx-0">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 backdrop-blur sm:p-3"
                >
                  <p className="text-sm font-black tracking-tight sm:text-base">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[9px] font-semibold text-white/38 sm:text-[10px]">
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
            <div className="absolute -inset-6 rounded-full bg-white/8 blur-3xl" />

            <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.055] p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[1.25rem] bg-[#0b0b0b]">
                <img
                  src={featuredItem.image}
                  alt={featuredItem.name}
                  className="h-[310px] w-full object-cover min-[380px]:h-[340px] sm:h-[420px] lg:h-[500px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

                <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/70 backdrop-blur">
                  Signature
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/45 sm:text-[10px]">
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

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <MiniTag text="Cheddar" />
                    <MiniTag text="Corn" />
                    <MiniTag text="BBQ" />
                  </div>
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
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/35">
                Digital Menu
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
                Full Menu
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-white/48">
              Food items use photos. Add-ons and sauces stay clean as compact
              menu rows.
            </p>
          </div>

          <div className="sticky top-3 z-30 -mx-4 mb-7 overflow-x-auto border-y border-white/10 bg-[#060606]/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-full sm:border">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                    activeCategory === category
                      ? "bg-white text-black"
                      : "border border-white/10 bg-white/[0.04] text-white/55"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) =>
              item.image ? (
                <FoodCard key={item.name} item={item} index={index} />
              ) : (
                <SimpleCard key={item.name} item={item} index={index} />
              )
            )}
          </div>
        </div>
      </section>

      <section
        id="location"
        className="relative px-4 pb-24 pt-6 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0e0e0e] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/35">
              Visit Us
            </p>

            <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
              Location & Contact
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/50">
              Open the map, call directly, or send a WhatsApp message from the
              same page.
            </p>

            <div id="contact" className="mt-7 grid gap-3">
              <ActionButton
                href={mapLink}
                icon={<FaMapMarkerAlt />}
                title="Open Google Maps"
              />
              <ActionButton
                href={`https://wa.me/${phone}`}
                icon={<FaWhatsapp />}
                title="Order on WhatsApp"
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

          <iframe
            title="The Street Food LB Location"
            src="https://www.google.com/maps?q=The%20Street%20Food%20LB&output=embed"
            className="h-[360px] w-full grayscale invert lg:h-full"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
}

function FoodCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.025, 0.18) }}
      className="group overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#0e0e0e] transition hover:-translate-y-1 hover:border-white/25 hover:bg-[#131313]"
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

        <p className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/65 backdrop-blur">
          {item.category}
        </p>
      </div>

      <div className="p-4">
        <h3 className="text-base font-black leading-tight tracking-tight">
          {item.name}
        </h3>

        <p className="mt-2 text-[13px] leading-6 text-white/47">
          {item.desc}
        </p>
      </div>
    </motion.article>
  );
}

function SimpleCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.025, 0.18) }}
      className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 transition hover:border-white/25 hover:bg-white/[0.06]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            {item.category}
          </p>
          <h3 className="mt-1.5 text-base font-black leading-tight tracking-tight">
            {item.name}
          </h3>
          <p className="mt-2 text-[13px] leading-6 text-white/45">
            {item.desc}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-black">
          ${item.price}
        </span>
      </div>
    </motion.article>
  );
}

function MiniTag({ text }) {
  return (
    <span className="rounded-full border border-white/10 bg-black/35 px-2 py-1 text-center text-[10px] font-bold text-white/60 backdrop-blur">
      {text}
    </span>
  );
}

function ActionButton({ href, icon, title }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-bold text-white/70 transition hover:border-white/25 hover:bg-white hover:text-black"
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