import { useEffect, useRef, useState } from "react";
import { LuEllipsisVertical } from "react-icons/lu";

// Menu dos "três pontinhos". items = [{ label, icon, onClick, danger }]
const MoreMenu = ({ items = [], label = "Mais ações" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="more-menu" ref={ref}>
      <button
        type="button"
        className="btn-icon"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <LuEllipsisVertical />
      </button>

      {open && (
        <div className="more-menu-list" role="menu">
          {items.map(({ label: itemLabel, icon: Icon, onClick, danger }) => (
            <button
              key={itemLabel}
              type="button"
              role="menuitem"
              className={danger ? "danger" : undefined}
              onClick={() => {
                setOpen(false);
                onClick();
              }}
            >
              {Icon && <Icon />}
              {itemLabel}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoreMenu;
