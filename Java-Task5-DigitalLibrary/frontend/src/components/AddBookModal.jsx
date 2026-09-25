import "../styles/addBookModal.css";

function AddBookModal({
  isOpen,
  onClose,
  bookData,
  setBookData,
  saveBook,
  isEditing
}) {
  if (!isOpen) return null;

  const updateField = (field, value) => {
    setBookData({
      ...bookData,
      [field]: value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>
          {isEditing ? "Edit Book" : "Add New Book"}
        </h2>

        {/* BOOK ID */}
        <input
          type="text"
          inputMode="numeric"
          placeholder="Book ID"
          value={bookData.id}
          disabled={isEditing}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            updateField("id", value);
          }}
        />

        {/* BOOK NAME */}
        <input
          type="text"
          placeholder="Book Name"
          value={bookData.bookName}
          onChange={(e) =>
            updateField("bookName", e.target.value)
          }
        />

        {/* AUTHOR */}
        <input
          type="text"
          placeholder="Author Name"
          value={bookData.author}
          onChange={(e) =>
            updateField("author", e.target.value)
          }
        />

        {/* CATEGORY */}
        <input
          type="text"
          placeholder="Category"
          value={bookData.category}
          onChange={(e) =>
            updateField("category", e.target.value)
          }
        />

        {/* QUANTITY */}
        <input
          type="number"
          min="1"
          placeholder="Quantity"
          value={bookData.quantity}
          onChange={(e) =>
            updateField("quantity", e.target.value)
          }
        />

        <div className="modal-buttons">

          <button
            className="save-btn"
            onClick={saveBook}
          >
            {isEditing ? "Update" : "Save"}
          </button>

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}

export default AddBookModal;