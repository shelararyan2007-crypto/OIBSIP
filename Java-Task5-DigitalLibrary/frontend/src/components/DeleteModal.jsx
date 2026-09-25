import { createPortal } from "react-dom";
import "../styles/deleteModal.css";

function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  itemType = "Book"
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="delete-modal-overlay">

      <div className="delete-modal">

        {/* DELETE ICON */}
        <div className="delete-icon">
          🗑️
        </div>

        {/* TITLE */}
        <h2>
          Delete {itemType}
        </h2>

        {/* MESSAGE */}
        <p>
          Are you sure you want to delete this{" "}
          {itemType.toLowerCase()}?
        </p>

        {/* BUTTONS */}
        <div className="delete-buttons">

          <button
            type="button"
            className="delete-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-confirm-btn"
            onClick={onDelete}
          >
            Delete
          </button>

        </div>

      </div>

    </div>,
    document.body
  );
}

export default DeleteModal;