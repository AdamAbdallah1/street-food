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
        className="btn-secondary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs"
        aria-label="Save item"
      >
        {isSaved ? <FaHeart /> : <FaRegHeart />}
      </button>

      <button
        onClick={() => onAddToCart(item)}
        className="btn-primary flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-black transition active:scale-95"
      >
        <FaPlus className="text-[10px]" />
        Add / Order
      </button>
    </div>
  );
}