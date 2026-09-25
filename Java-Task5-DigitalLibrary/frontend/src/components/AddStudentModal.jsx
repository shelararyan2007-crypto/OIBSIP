import "../styles/addBookModal.css";

function AddStudentModal({
  isOpen,
  onClose,
  studentData,
  setStudentData,
  saveStudent,
  isEditing
}) {
  if (!isOpen) return null;

  const updateField = (field, value) => {
    setStudentData({
      ...studentData,
      [field]: value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>
          {isEditing ? "Edit Student" : "Add New Student"}
        </h2>

        {/* STUDENT ID */}
        <input
          type="text"
          inputMode="numeric"
          placeholder="Student ID"
          value={studentData.id}
          disabled={isEditing}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            updateField("id", value);
          }}
        />

        {/* STUDENT NAME */}
        <input
          type="text"
          placeholder="Student Name"
          value={studentData.name}
          onChange={(e) =>
            updateField("name", e.target.value)
          }
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={studentData.email}
          onChange={(e) =>
            updateField("email", e.target.value)
          }
        />

        {/* BRANCH */}
        <select
          value={studentData.branch}
          onChange={(e) =>
            updateField("branch", e.target.value)
          }
        >
          <option value="">Select Branch</option>
          <option value="IT">IT</option>
          <option value="CSIOT">CSIOT</option>
          <option value="CE">CE</option>
          <option value="MECH">MECH</option>
          <option value="AIML">AIML</option>
          <option value="EXTC">EXTC</option>
        </select>

        {/* YEAR */}
        <select
          value={studentData.year}
          onChange={(e) =>
            updateField("year", e.target.value)
          }
        >
          <option value="">Select Year</option>
          <option value="FE">FE</option>
          <option value="SE">SE</option>
          <option value="TE">TE</option>
          <option value="BE">BE</option>
        </select>

        {/* BUTTONS */}
        <div className="modal-buttons">

          <button
            className="save-btn"
            onClick={saveStudent}
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

export default AddStudentModal;