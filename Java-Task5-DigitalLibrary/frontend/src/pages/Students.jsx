import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AddStudentModal from "../components/AddStudentModal";
import DeleteModal from "../components/DeleteModal";
import Toast from "../components/Toast";
import "../styles/students.css";

/* =========================================
   PREMIUM FILTER DROPDOWN
========================================= */

function FilterDropdown({
  value,
  options,
  onChange,
  placeholder,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const selectedOption =
    options.find(
      (option) => option.value === value
    ) || options[0];

  return (
    <div
      className={`premium-dropdown ${
        isOpen ? "open" : ""
      }`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className="premium-dropdown-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={16}
          className="premium-dropdown-arrow"
        />
      </button>

      {isOpen && (
        <div className="premium-dropdown-menu">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`premium-dropdown-option ${
                value === option.value
                  ? "selected"
                  : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>

              {value === option.value && (
                <span className="dropdown-check">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================
   STUDENTS PAGE
========================================= */

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [branchFilter, setBranchFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [selectedStudentId, setSelectedStudentId] =
    useState(null);

  const [toast, setToast] = useState(null);

  const [studentData, setStudentData] = useState({
    id: "",
    name: "",
    email: "",
    branch: "",
    year: "",
  });

  /* =========================================
     TOAST
  ========================================= */

  const showToast = useCallback(
    (message, type = "success") => {
      setToast({
        message,
        type,
      });
    },
    []
  );

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  /* =========================================
     SORT STUDENTS
  ========================================= */

  const sortStudents = (data) => {
    return [...data].sort(
      (a, b) => Number(a.id) - Number(b.id)
    );
  };

  /* =========================================
     LOAD STUDENTS
  ========================================= */

  const loadStudents = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/students"
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      setStudents(sortStudents(data));
    } catch (error) {
      console.error(
        "Failed to load students:",
        error
      );

      showToast(
        "Failed to load students from server",
        "error"
      );
    }
  }, [showToast]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  /* =========================================
     RESET FORM
  ========================================= */

  const resetForm = () => {
    setStudentData({
      id: "",
      name: "",
      email: "",
      branch: "",
      year: "",
    });
  };

  /* =========================================
     ADD STUDENT
  ========================================= */

  const saveStudent = async () => {
    if (
      !studentData.id ||
      !studentData.name.trim() ||
      !studentData.email.trim() ||
      !studentData.branch.trim() ||
      !studentData.year.trim()
    ) {
      showToast(
        "Please fill all fields",
        "error"
      );

      return;
    }

    const idExists = students.some(
      (student) =>
        String(student.id) ===
        String(studentData.id)
    );

    if (idExists) {
      showToast(
        `Student ID ${studentData.id} already exists!`,
        "error"
      );

      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/students",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: Number(studentData.id),
            name: studentData.name.trim(),
            email: studentData.email.trim(),
            branch: studentData.branch.trim(),
            year: studentData.year.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "Add student error:",
          errorText
        );

        throw new Error(errorText);
      }

      const newStudent =
        await response.json();

      setStudents((prev) =>
        sortStudents([
          ...prev,
          newStudent,
        ])
      );

      resetForm();

      setShowModal(false);

      showToast(
        "Student added successfully!"
      );

      window.dispatchEvent(
        new Event("adminDashboardUpdated")
      );
    } catch (error) {
      console.error(
        "Failed to add student:",
        error
      );

      showToast(
        "Failed to add student to database",
        "error"
      );
    }
  };

  /* =========================================
     EDIT STUDENT
  ========================================= */

  const editStudent = (student) => {
    setStudentData({
      id: student.id,
      name: student.name || "",
      email: student.email || "",
      branch: student.branch || "",
      year: student.year || "",
    });

    setIsEditing(true);

    setShowModal(true);
  };

  /* =========================================
     UPDATE STUDENT
  ========================================= */

  const updateStudent = async () => {
    if (
      !studentData.name.trim() ||
      !studentData.email.trim() ||
      !studentData.branch.trim() ||
      !studentData.year.trim()
    ) {
      showToast(
        "Please fill all fields",
        "error"
      );

      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/students/${studentData.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: studentData.name.trim(),
            email: studentData.email.trim(),
            branch: studentData.branch.trim(),
            year: studentData.year.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "Update student error:",
          errorText
        );

        throw new Error(errorText);
      }

      const updatedStudent =
        await response.json();

      setStudents((prev) =>
        sortStudents(
          prev.map((student) =>
            student.id ===
            updatedStudent.id
              ? updatedStudent
              : student
          )
        )
      );

      resetForm();

      setShowModal(false);

      setIsEditing(false);

      showToast(
        "Student updated successfully!"
      );

      window.dispatchEvent(
        new Event("adminDashboardUpdated")
      );
    } catch (error) {
      console.error(
        "Failed to update student:",
        error
      );

      showToast(
        "Failed to update student in database",
        "error"
      );
    }
  };

  /* =========================================
     DELETE STUDENT
  ========================================= */

  const deleteStudent = (id) => {
    setSelectedStudentId(id);

    setShowDeleteModal(true);
  };

  /* =========================================
     CONFIRM DELETE
  ========================================= */

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/students/${selectedStudentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "Delete student error:",
          errorText
        );

        throw new Error(errorText);
      }

      setStudents((prev) =>
        prev.filter(
          (student) =>
            student.id !==
            selectedStudentId
        )
      );

      setShowDeleteModal(false);

      setSelectedStudentId(null);

      showToast(
        "Student deleted successfully!"
      );

      window.dispatchEvent(
        new Event("adminDashboardUpdated")
      );
    } catch (error) {
      console.error(
        "Failed to delete student:",
        error
      );

      showToast(
        "Failed to delete student from database",
        "error"
      );
    }
  };

  /* =========================================
     SEARCH + FILTER
  ========================================= */

  const filteredStudents =
    students.filter((student) => {
      const text =
        search.trim().toLowerCase();

      if (
        branchFilter !== "All" &&
        student.branch !== branchFilter
      ) {
        return false;
      }

      if (
        yearFilter !== "All" &&
        student.year !== yearFilter
      ) {
        return false;
      }

      if (!text) {
        return true;
      }

      if (/^\d+$/.test(text)) {
        return (
          String(student.id) === text
        );
      }

      return (
        String(student.name || "")
          .toLowerCase()
          .includes(text) ||

        String(student.email || "")
          .toLowerCase()
          .includes(text) ||

        String(student.branch || "")
          .toLowerCase()
          .includes(text) ||

        String(student.year || "")
          .toLowerCase()
          .includes(text)
      );
    });

  /* =========================================
     DROPDOWN OPTIONS
  ========================================= */

  const branchOptions = [
    {
      value: "All",
      label: "All Branches",
    },
    {
      value: "IT",
      label: "IT",
    },
    {
      value: "CSIOT",
      label: "CSIOT",
    },
    {
      value: "CE",
      label: "CE",
    },
    {
      value: "MECH",
      label: "MECH",
    },
    {
      value: "AIML",
      label: "AIML",
    },
    {
      value: "EXTC",
      label: "EXTC",
    },
  ];

  const yearOptions = [
    {
      value: "All",
      label: "All Years",
    },
    {
      value: "FE",
      label: "FE",
    },
    {
      value: "SE",
      label: "SE",
    },
    {
      value: "TE",
      label: "TE",
    },
    {
      value: "BE",
      label: "BE",
    },
  ];

  /* =========================================
     RETURN
  ========================================= */

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <div className="main-content">

        {/* TOPBAR */}

        <Topbar title="Students" />

        <div className="students-container">

          {/* HEADER */}

          <div className="students-header">

            <div>
              <h2>
                Manage Students
              </h2>

              <p>
                Add, edit and manage library students
              </p>
            </div>

            <button
              className="add-student-btn"
              onClick={() => {
                resetForm();
                setIsEditing(false);
                setShowModal(true);
              }}
            >
              + Add Student
            </button>

          </div>

          {/* SEARCH + FILTERS */}

          <div className="student-controls">

            {/* SEARCH */}

            <input
              className="search-box"
              type="text"
              placeholder="Search by Student ID, Name, Email, Branch or Year..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {/* FILTERS */}

            <div className="student-filter-row">

              <FilterDropdown
                value={branchFilter}
                options={branchOptions}
                onChange={setBranchFilter}
                placeholder="All Branches"
              />

              <FilterDropdown
                value={yearFilter}
                options={yearOptions}
                onChange={setYearFilter}
                placeholder="All Years"
              />

            </div>

          </div>

          {/* STUDENT TABLE */}

          <table className="student-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.length > 0 ? (

                filteredStudents.map(
                  (student) => (

                    <tr
                      key={student.id}
                    >

                      <td>
                        {student.id}
                      </td>

                      <td>
                        {student.name}
                      </td>

                      <td>
                        {student.email}
                      </td>

                      <td>
                        {student.branch || "-"}
                      </td>

                      <td>
                        {student.year || "-"}
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editStudent(
                                student
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteStudent(
                                student.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No students found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ADD / EDIT MODAL */}

        <AddStudentModal
          isOpen={showModal}

          onClose={() => {
            setShowModal(false);
            setIsEditing(false);
            resetForm();
          }}

          studentData={studentData}

          setStudentData={setStudentData}

          saveStudent={
            isEditing
              ? updateStudent
              : saveStudent
          }

          isEditing={isEditing}
        />

        {/* DELETE MODAL */}

        <DeleteModal
          isOpen={showDeleteModal}

          onClose={() => {
            setShowDeleteModal(false);
            setSelectedStudentId(null);
          }}

          onDelete={confirmDelete}

          itemType="Student"
        />

        {/* TOAST */}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}

      </div>

    </div>
  );
}

export default Students;