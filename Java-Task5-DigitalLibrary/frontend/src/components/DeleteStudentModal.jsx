import "../styles/deleteStudentModal.css";

function DeleteStudentModal({
  isOpen,
  onClose,
  onDelete
}) {

  if (!isOpen) return null;

  return (
    <div className="student-delete-overlay">

      <div className="student-delete-modal">

        <h2>Delete Student</h2>

        <p>
          Are you sure you want to delete this student?
        </p>

        <div className="student-delete-buttons">

          <button
            className="student-delete-confirm"
            onClick={onDelete}
          >
            Delete
          </button>

          <button
            className="student-delete-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteStudentModal;