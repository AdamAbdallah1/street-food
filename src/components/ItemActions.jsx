import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaPlus } from "react-icons/fa";

const FAVORITES_KEY = "streetfood_saved_items";

export default function ItemActions({ item, onAddToCart, onSavedChange }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    setIsSaved(saved.includes(item.name));
  }, [item.name]);

  function toggleSaved() {
    if (navigator.vibrate) navigator.vibrate(20);

    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");

    const nextSaved = saved.includes(item.name)
      ? saved.filter((name) => name !== item.name)
      : [...saved, item.name];

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextSaved));
    setIsSaved(nextSaved.includes(item.name));
    onSavedChange?.();
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      <button
        onClick={toggleSaved}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs text-white/70 transition hover:bg-white hover:text-black"
        aria-label="Save item"
      >
        {isSaved ? <FaHeart /> : <FaRegHeart />}
      </button>

      <button
        onClick={() => onAddToCart(item)}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-black text-black transition hover:scale-[1.02] active:scale-95"
      >
        <FaPlus className="text-[10px]" />
        Add / Order
      </button>
    </div>
  );
}