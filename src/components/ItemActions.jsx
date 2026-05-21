import { useEffect, useState } from "react";
import {
  FaBolt,
  FaHeart,
  FaPlus,
  FaRegHeart,
} from "react-icons/fa";
import toast from "react-hot-toast";

const FAVORITES_KEY = "streetfood_saved_items";

export default function ItemActions({
  item,
  onAddToCart,
  onQuickOrder,
  onSavedChange,
}) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem(FAVORITES_KEY) || "[]"
    );

    setIsSaved(saved.includes(item.name));
  }, [item.name]);

  function toggleSaved() {
    if (navigator.vibrate) {
      navigator.vibrate([10, 20, 10]);
    }

    const saved = JSON.parse(
      localStorage.getItem(FAVORITES_KEY) || "[]"
    );

    const nextSaved = saved.includes(item.name)
      ? saved.filter((name) => name !== item.name)
      : [...saved, item.name];

    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(nextSaved)
    );

    const savedNow = nextSaved.includes(item.name);

    setIsSaved(savedNow);

    onSavedChange?.();

    if (savedNow) {
      toast.success("Added to favorites");
    } else {
      toast("Removed from favorites");
    }
  }

  function handleAddToCart() {
    onAddToCart(item);

    if (navigator.vibrate) {
      navigator.vibrate([10, 20, 10]);
    }

    toast.success(`${item.name} added`);
  }

  function handleQuickOrder() {
    onQuickOrder(item);

    if (navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }

    toast.success("Opening order");
  }

  return (
    <div className="mt-4 grid grid-cols-[2.7rem_1fr_1fr] gap-2">
      <button
        onClick={toggleSaved}
        className="btn-secondary flex h-11 items-center justify-center rounded-full text-sm transition duration-200 active:scale-95"
        aria-label="Save item"
      >
        {isSaved ? <FaHeart /> : <FaRegHeart />}
      </button>

      <button
        onClick={handleAddToCart}
        className="btn-secondary flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[11px] font-black transition duration-200 active:scale-95"
      >
        <FaPlus className="text-[10px]" />
        Add
      </button>

      <button
        onClick={handleQuickOrder}
        className="btn-primary flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[11px] font-black shadow-lg transition duration-200 active:scale-95"
      >
        <FaBolt className="text-[10px]" />
        Order Now
      </button>
    </div>
  );
}