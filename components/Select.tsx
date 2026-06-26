"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** Shown as the first muted item; signals nothing is chosen yet. */
  placeholder?: string;
  required?: boolean;
  id?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder,
  required,
  id: externalId,
}: SelectProps) {
  const autoId   = useId();
  const triggerId = externalId ?? `sel-trigger-${autoId}`;
  const listId    = `sel-list-${autoId}`;

  const [open, setOpen]               = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef   = useRef<HTMLButtonElement>(null);
  const listRef      = useRef<HTMLUListElement>(null);

  // Placeholder is always the first entry when provided.
  const listOptions: SelectOption[] = placeholder
    ? [{ value: "", label: placeholder }, ...options]
    : options;

  const selectedLabel = value
    ? options.find((o) => o.value === value)?.label ?? value
    : (placeholder ?? "");

  const isShowingPlaceholder = !value && Boolean(placeholder);

  // Close on outside click/touch.
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Scroll the focused option into view.
  useEffect(() => {
    if (!open || focusedIndex < 0 || !listRef.current) return;
    const el = listRef.current.children[focusedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex, open]);

  function openList() {
    const idx = value ? listOptions.findIndex((o) => o.value === value) : 0;
    setFocusedIndex(Math.max(0, idx));
    setOpen(true);
  }

  function closeList() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commitOption(opt: SelectOption) {
    if (opt.value === "" && placeholder) return; // placeholder is not selectable
    onChange(opt.value);
    closeList();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) { openList(); break; }
        setFocusedIndex((i) => Math.min(i + 1, listOptions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) { openList(); break; }
        setFocusedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!open) { openList(); break; }
        if (focusedIndex >= 0) commitOption(listOptions[focusedIndex]);
        break;
      case "Escape":
        if (open) { e.preventDefault(); closeList(); }
        break;
      case "Tab":
        if (open) closeList();
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Trigger ── */}
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
        aria-activedescendant={
          open && focusedIndex >= 0 ? `${listId}-opt-${focusedIndex}` : undefined
        }
        aria-required={required}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={handleKeyDown}
        className={[
          "w-full flex items-center justify-between gap-3",
          "bg-navy border px-4 py-3 text-left",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-1 focus:ring-gold/40",
          open
            ? "border-gold"
            : "border-gold/30 hover:border-gold/60",
          isShowingPlaceholder ? "text-taupe/60" : "text-pearl",
        ].join(" ")}
      >
        <span className="truncate">{selectedLabel}</span>
        {/* Chevron */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-4 h-4 flex-shrink-0 text-gold/50 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Dropdown list ── */}
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 left-0 right-0 mt-1 bg-navy border border-gold/30 max-h-60 overflow-y-auto"
          >
            {listOptions.map((opt, i) => {
              const isPlaceholderOpt = opt.value === "" && Boolean(placeholder);
              const isSelected       = opt.value === value;
              const isFocused        = i === focusedIndex;

              return (
                <li
                  key={opt.value === "" ? "__placeholder__" : opt.value}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isPlaceholderOpt || undefined}
                  onPointerDown={(e) => e.preventDefault()} // keep trigger focused
                  onClick={() => commitOption(opt)}
                  onMouseMove={() => !isPlaceholderOpt && setFocusedIndex(i)}
                  className={[
                    "px-4 py-3 select-none transition-colors duration-100",
                    isPlaceholderOpt
                      ? "text-taupe/50 cursor-default"
                      : "cursor-pointer",
                    !isPlaceholderOpt && isFocused
                      ? "bg-gold/10 text-pearl"
                      : !isPlaceholderOpt && isSelected
                      ? "text-gold bg-gold/5"
                      : !isPlaceholderOpt
                      ? "text-pearl hover:bg-gold/10"
                      : "",
                  ].join(" ")}
                >
                  {opt.label}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
