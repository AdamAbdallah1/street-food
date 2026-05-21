import { useEffect, useState } from "react";
import {
  FaArrowDown,
  FaMobileAlt,
  FaTimes,
} from "react-icons/fa";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(
      "streetfood_install_closed"
    );

    if (dismissed) return;

    function handler(e) {
      e.preventDefault();

      setDeferredPrompt(e);

      setTimeout(() => {
        setVisible(true);
      }, 2500);
    }

    window.addEventListener(
      "beforeinstallprompt",
      handler
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
    };
  }, []);

  async function installApp() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    setVisible(false);
  }

  function closePrompt() {
    localStorage.setItem(
      "streetfood_install_closed",
      "true"
    );

    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-[70] w-[92%] max-w-sm -translate-x-1/2">
      <div className="glass rounded-[2rem] p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="btn-primary flex h-12 w-12 items-center justify-center rounded-2xl">
              <FaMobileAlt />
            </div>

            <div>
              <h3 className="text-sm font-black">
                Install App
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted">
                Install The Street Food LB for a
                faster mobile ordering experience.
              </p>
            </div>
          </div>

          <button
            onClick={closePrompt}
            className="text-soft"
          >
            <FaTimes />
          </button>
        </div>

        <button
          onClick={installApp}
          className="btn-primary mt-4 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black"
        >
          <FaArrowDown />
          Install Now
        </button>
      </div>
    </div>
  );
}