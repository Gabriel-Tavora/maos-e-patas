import { useEffect, useRef } from "react";
import { LuX } from "react-icons/lu";
import Button from "../Button/Button.jsx";
import "./Modal.css";

// Janela sobre a página, usando o <dialog> nativo (mesma ideia do diálogo de sair)
const Modal = ({ open, title, onClose, small = false, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={small ? "modal modal--small" : "modal"}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
    >
      {open && (
        <>
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button type="button" className="btn-icon" onClick={onClose} aria-label="Fechar">
              <LuX />
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </>
      )}
    </dialog>
  );
};

// Pergunta de confirmação (excluir, sair...)
export const ConfirmDialog = ({
  open,
  title,
  text,
  confirmText = "Confirmar",
  danger = false,
  loading = false,
  errorMessage,
  onConfirm,
  onClose,
}) => (
  <Modal open={open} title={title} onClose={onClose} small>
    {text && <p>{text}</p>}
    {errorMessage && (
      <p role="alert" className="form-error">
        {errorMessage}
      </p>
    )}
    <div className="modal-actions">
      <Button className="btn btn-outline" buttonText="Cancelar" onClick={onClose} />
      <Button
        className={danger ? "btn btn-danger" : "btn"}
        buttonText={loading ? "Aguarde..." : confirmText}
        onClick={onConfirm}
        disabled={loading}
      />
    </div>
  </Modal>
);

export default Modal;
