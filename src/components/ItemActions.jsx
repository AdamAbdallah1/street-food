import { useEffect, useState } from "react";
import { FaBolt, FaHeart, FaPlus, FaRegHeart } from "react-icons/fa";

const FAVORITES_KEY = "streetfood_saved_items";

export default function ItemActions({
  item,
  onAddToCart,
  onQuickOrder,
  onSavedChange,
}) {
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
    <div className="mt-4 grid grid-cols-[2.4rem_1fr_1fr] gap-2">
      <button
        onClick={toggleSaved}
        className="btn-secondary flex h-10 items-center justify-center rounded-full text-xs transition active:scale-95"
        aria-label="Save item"
      >
        {isSaved ? <FaHeart /> : <FaRegHeart />}
      </button>

      <button
        onClick={() => onAddToCart(item)}
        className="btn-secondary flex h-10 items-center justify-center gap-2 rounded-full px-3 text-[11px] font-black transition active:scale-95"
      >
        <FaPlus className="text-[10px]" />
        Add
      </button>

      <button
        onClick={() => onQuickOrder(item)}
        className="btn-primary flex h-10 items-center justify-center gap-2 rounded-full px-3 text-[11px] font-black transition active:scale-95"
      >
        <FaBolt className="text-[10px]" />
        Order
      </button>
    </div>
  );
}