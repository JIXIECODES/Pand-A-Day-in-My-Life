import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const VIEWPORT_MARGIN = 16;
const POPUP_GAP = 12;
const DESKTOP_BREAKPOINT = 640;
const popupContent = {
  resilience: {
    description: "Resilience Returns increase when you complete meaningful progress after missing at least one full day.",
    label: "Resilience",
  },
  streak: {
    description: "A streak celebrates consecutive productive days when you complete meaningful progress.",
    label: "Streak",
  },
};

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function popupPosition(button, popup) {
  const buttonRect = button.getBoundingClientRect();
  const popupWidth = Math.min(320, window.innerWidth - VIEWPORT_MARGIN * 2);
  const popupHeight = popup?.offsetHeight || 190;
  const spaceRight = window.innerWidth - buttonRect.right - POPUP_GAP - VIEWPORT_MARGIN;
  const spaceLeft = buttonRect.left - POPUP_GAP - VIEWPORT_MARGIN;
  let placement = "below";
  let left = buttonRect.left + buttonRect.width / 2 - popupWidth / 2;
  let top = buttonRect.bottom + POPUP_GAP;

  if (window.innerWidth >= DESKTOP_BREAKPOINT && spaceRight >= popupWidth) {
    placement = "right";
    left = buttonRect.right + POPUP_GAP;
    top = buttonRect.top + buttonRect.height / 2 - popupHeight / 2;
  } else if (window.innerWidth >= DESKTOP_BREAKPOINT && spaceLeft >= popupWidth) {
    placement = "left";
    left = buttonRect.left - POPUP_GAP - popupWidth;
    top = buttonRect.top + buttonRect.height / 2 - popupHeight / 2;
  } else if (buttonRect.bottom + POPUP_GAP + popupHeight > window.innerHeight - VIEWPORT_MARGIN) {
    placement = "above";
    top = buttonRect.top - POPUP_GAP - popupHeight;
  }

  left = clamp(left, VIEWPORT_MARGIN, Math.max(VIEWPORT_MARGIN, window.innerWidth - popupWidth - VIEWPORT_MARGIN));
  top = clamp(top, VIEWPORT_MARGIN, Math.max(VIEWPORT_MARGIN, window.innerHeight - popupHeight - VIEWPORT_MARGIN));

  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonCenterY = buttonRect.top + buttonRect.height / 2;
  const arrowStyle = placement === "right" || placement === "left"
    ? { top: clamp(buttonCenterY - top - 6, 18, popupHeight - 30) }
    : { left: clamp(buttonCenterX - left - 6, 18, popupWidth - 30) };

  return { arrowStyle, left, placement, top, width: popupWidth };
}

export default function ResilienceReturnsCard({ currentStreak = 0, resilienceState }) {
  const [openPopup, setOpenPopup] = useState("");
  const [position, setPosition] = useState(null);
  const resilienceButtonRef = useRef(null);
  const streakButtonRef = useRef(null);
  const popupRef = useRef(null);
  const count = Number.isInteger(resilienceState?.resilienceReturnCount)
    ? resilienceState.resilienceReturnCount
    : 0;
  const safeStreak = Number.isInteger(currentStreak) && currentStreak >= 0 ? currentStreak : 0;
  const activePopup = popupContent[openPopup];
  const popupId = openPopup ? `${openPopup}-info-popup` : undefined;

  const closeInfo = useCallback((restoreFocus = true) => {
    const button = openPopup === "streak" ? streakButtonRef.current : resilienceButtonRef.current;
    setOpenPopup("");
    setPosition(null);
    if (restoreFocus) {
      window.requestAnimationFrame(() => button?.focus());
    }
  }, [openPopup]);

  const updatePosition = useCallback(() => {
    const button = openPopup === "streak" ? streakButtonRef.current : resilienceButtonRef.current;
    if (!button) return;
    setPosition(popupPosition(button, popupRef.current));
  }, [openPopup]);

  useLayoutEffect(() => {
    if (!openPopup) return;
    updatePosition();
  }, [openPopup, updatePosition]);

  useEffect(() => {
    if (!openPopup) return undefined;

    function handlePointerDown(event) {
      if (
        streakButtonRef.current?.contains(event.target)
        || resilienceButtonRef.current?.contains(event.target)
        || popupRef.current?.contains(event.target)
      ) return;
      closeInfo(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") closeInfo(true);
    }

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeInfo, openPopup, updatePosition]);

  function toggleInfo(kind) {
    if (openPopup === kind) {
      closeInfo(false);
      return;
    }
    setPosition(null);
    setOpenPopup(kind);
  }

  const arrowClasses = {
    above: "-bottom-1.5 border-b border-r border-emerald-100",
    below: "-top-1.5 border-l border-t border-emerald-100",
    left: "-right-1.5 border-r border-t border-emerald-100",
    right: "-left-1.5 border-b border-l border-emerald-100",
  };

  return (
    <section className="rounded-[1.5rem] border border-emerald-100 bg-white/80 p-4 shadow-sm" aria-labelledby="resilience-returns-title">
      <div>
        <p className="text-xs font-black uppercase text-emerald-600">Progress rhythm</p>
        <h2 className="mt-1 text-lg font-black text-zinc-950" id="resilience-returns-title">Streak and Resilience</h2>
        <p className="mt-1 text-sm font-semibold text-zinc-500">Two ways your panda notices progress.</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-black uppercase text-amber-700">Current streak</p>
            <button
              aria-controls="streak-info-popup"
              aria-expanded={openPopup === "streak"}
              aria-haspopup="dialog"
              aria-label="Learn about streaks"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-sm font-black text-amber-800 shadow-sm transition hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-100"
              onClick={() => toggleInfo("streak")}
              ref={streakButtonRef}
              type="button"
            >
              i
            </button>
          </div>
          <p className="mt-1 text-3xl font-black text-amber-950">{safeStreak}</p>
          <p className="mt-1 text-xs font-bold text-amber-900">Consecutive productive days.</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-black uppercase text-emerald-700">Resilience Returns</p>
            <button
              aria-controls="resilience-info-popup"
              aria-expanded={openPopup === "resilience"}
              aria-haspopup="dialog"
              aria-label="Learn about resilience"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-sm font-black text-emerald-800 shadow-sm transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              onClick={() => toggleInfo("resilience")}
              ref={resilienceButtonRef}
              type="button"
            >
              i
            </button>
          </div>
          <p className="mt-1 text-3xl font-black text-emerald-900">{count}</p>
          <p className="mt-1 text-xs font-bold text-emerald-800">How many times you came back after missing a day.</p>
        </div>
      </div>

      {count === 0 && (
        <p className="mt-4 rounded-2xl bg-zinc-50 p-3 text-sm font-bold leading-6 text-zinc-500">
          Your returns will appear here when you resume after a missed day.
        </p>
      )}

      {openPopup && activePopup && createPortal(
        <aside
          aria-describedby={`${popupId}-description`}
          aria-labelledby={`${popupId}-title`}
          className="fixed z-[70] rounded-2xl border border-emerald-100 bg-white p-4 text-sm font-bold leading-6 text-zinc-700 shadow-2xl shadow-zinc-950/15"
          id={popupId}
          ref={popupRef}
          role="dialog"
          style={{
            left: position?.left ?? VIEWPORT_MARGIN,
            top: position?.top ?? VIEWPORT_MARGIN,
            visibility: position ? "visible" : "hidden",
            width: position?.width ?? Math.min(320, window.innerWidth - VIEWPORT_MARGIN * 2),
          }}
        >
          {position && (
            <span
              aria-hidden="true"
              className={`absolute size-3 rotate-45 bg-white ${arrowClasses[position.placement]}`}
              style={position.arrowStyle}
            />
          )}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-emerald-600">Panda progress</p>
              <h3 className="text-lg font-black text-zinc-950" id={`${popupId}-title`}>{activePopup.label}</h3>
            </div>
            <button
              aria-label={`Close ${activePopup.label} information`}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-base font-black text-emerald-800 transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              onClick={() => closeInfo(true)}
              type="button"
            >
              &times;
            </button>
          </div>
          <p className="mt-2" id={`${popupId}-description`}>{activePopup.description}</p>
        </aside>,
        document.body,
      )}
    </section>
  );
}
