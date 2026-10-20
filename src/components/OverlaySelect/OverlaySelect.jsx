import React, { useEffect, useRef, useState } from "react";
import "./OverlaySelect.css";

/**
 * Custom listbox dropdown that overlays instead of pushing layout.
 * onChange receives a synthetic { target: { name, value } } for form fields.
 */
const OverlaySelect = ({
  id,
  name,
  label,
  ariaLabel,
  hint,
  value,
  options,
  onChange,
  error,
  placeholder = "Select one",
  className = "",
  labelClassName = "overlay-select__label",
  size = "default",
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const menuRef = useRef(null);
  const optionRefs = useRef([]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const option = optionRefs.current[activeIndex];
    const menu = menuRef.current;
    if (!option || !menu) return;

    const optionRect = option.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    if (optionRect.top < menuRect.top) {
      menu.scrollTop -= menuRect.top - optionRect.top;
    } else if (optionRect.bottom > menuRect.bottom) {
      menu.scrollTop += optionRect.bottom - menuRect.bottom;
    }
  }, [open, activeIndex]);

  const selected = options.find((option) => option.value === value);

  const firstEnabledIndex = (start, delta) => {
    if (!options.length) return 0;
    let next = start;
    for (let step = 0; step < options.length; step += 1) {
      if (!options[next]?.disabled) return next;
      next = (next + delta + options.length) % options.length;
    }
    return start;
  };

  const openMenu = () => {
    const selectedIndex = options.findIndex((option) => option.value === value);
    const start = selectedIndex >= 0 ? selectedIndex : 0;
    setActiveIndex(firstEnabledIndex(start, 1));
    setOpen(true);
  };

  const choose = (nextValue) => {
    onChange({ target: { name, value: nextValue } });
    setOpen(false);
  };

  const moveActive = (delta) => {
    setActiveIndex((index) => {
      if (!options.length) return 0;
      let next = index;
      for (let step = 0; step < options.length; step += 1) {
        next = (next + delta + options.length) % options.length;
        if (!options[next].disabled) return next;
      }
      return index;
    });
  };

  const onTriggerKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        openMenu();
      } else if (options[activeIndex] && !options[activeIndex].disabled) {
        choose(options[activeIndex].value);
      }
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const labelId = label ? `${id}-label` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const listboxId = `${id}-listbox`;
  const rootClass = [
    "overlay-select",
    size === "compact" ? "overlay-select--compact" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} ref={rootRef}>
      {label && (
        <label id={labelId} className={labelClassName} htmlFor={`${id}-trigger`}>
          {label}
        </label>
      )}
      {hint && (
        <p className="overlay-select__hint" id={hintId}>
          {hint}
        </p>
      )}
      <div className={`overlay-select__control${open ? " is-open" : ""}`}>
        <button
          type="button"
          id={`${id}-trigger`}
          className={`overlay-select__trigger${value ? "" : " is-placeholder"}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-labelledby={labelId}
          aria-label={!label ? ariaLabel || placeholder : undefined}
          aria-describedby={hintId}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onTriggerKeyDown}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <span className="overlay-select__chevron" aria-hidden="true" />
        </button>
        {open && (
          <ul
            ref={menuRef}
            id={listboxId}
            className="overlay-select__menu"
            role="listbox"
            aria-labelledby={labelId}
          >
            {options.map((option, index) => (
              <li key={`${option.value}-${index}`} role="presentation">
                <button
                  type="button"
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={value === option.value}
                  aria-disabled={option.disabled || undefined}
                  disabled={option.disabled}
                  className={`overlay-select__option${value === option.value ? " is-selected" : ""}${
                    index === activeIndex && !option.disabled ? " is-active" : ""
                  }`}
                  onMouseEnter={() => {
                    if (!option.disabled) setActiveIndex(index);
                  }}
                  onClick={() => {
                    if (!option.disabled) choose(option.value);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default OverlaySelect;
