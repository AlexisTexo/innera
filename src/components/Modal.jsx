import { useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({ title, body, cta, onClose, isSuccess }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div 
      className="modal-backdrop" 
      role="dialog" 
      aria-modal="true" 
      onMouseDown={onClose}
      style={
        isSuccess
          ? {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999999, // Superponer sobre todo (Nav, hero, etc.)
            }
          : {}
      }
    >
      <div 
        className="modal" 
        onMouseDown={(e) => e.stopPropagation()}
        style={isSuccess ? { maxWidth: "600px", padding: "4rem", width: "100%", margin: "0 1rem", zIndex: 1000000 } : {}}
      >
        {isSuccess ? (
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
             <style>{`
               .apply-cycle-auto {
                  position: relative;
                  background: var(--foreground);
                  border: none;
                  z-index: 1;
                  outline: none;
                  box-sizing: border-box;
                  animation: text-color-spin 3s linear infinite;
               }
               @keyframes text-color-spin {
                  0% { color: var(--coral); }
                  25% { color: var(--lavender); }
                  50% { color: var(--emerald); }
                  75% { color: var(--teal); }
                  100% { color: var(--coral); }
               }
               .apply-cycle-auto::before {
                  content: "";
                  position: absolute;
                  inset: -2px;
                  z-index: -1;
                  border-radius: inherit;
                  background: conic-gradient(from var(--angle), var(--coral), var(--lavender), var(--emerald), var(--teal), var(--coral));
                  animation: spin-bg 3s linear infinite;
               }
             `}</style>
             <div 
              className="apply-cycle-auto" 
              style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                justifyContent: "center", 
                width: "80px", 
                height: "80px", 
                borderRadius: "50%", 
                fontSize: "2.5rem",
                cursor: "default"
              }}
            >
              ✓
            </div>
          </div>
        ) : null}
        <h3 className="modal-title" style={{ textAlign: "center", ...(isSuccess ? { fontSize: "2.2rem", marginBottom: "1.5rem" } : {}) }}>{title}</h3>
        <p className="modal-body" style={{ textAlign: "center", ...(isSuccess ? { fontSize: "1.2rem", marginBottom: "2.5rem", lineHeight: "1.8" } : {}) }}>{body}</p>
        <div className="modal-actions" style={{ justifyContent: "center", ...(isSuccess ? { marginTop: "1rem" } : {}) }}>
          <button 
            type="button" 
            className="modal-btn" 
            onClick={onClose}
            style={
              isSuccess 
                ? { 
                    backgroundImage: "var(--rainbow-gradient)", 
                    backgroundSize: "400% 400%", 
                    animation: "var(--rainbow-animation)", 
                    border: "none", 
                    color: "#fff", 
                    textShadow: "0 1px 10px rgba(0, 0, 0, 0.35)",
                    opacity: 0.95,
                    padding: "1rem 3rem",
                    fontSize: "0.9rem"
                  } 
                : {}
            }
          >
            {cta}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
