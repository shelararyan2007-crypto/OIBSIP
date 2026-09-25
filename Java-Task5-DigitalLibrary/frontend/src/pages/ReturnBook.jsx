import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Toast from "../components/Toast";
import "../styles/returnBook.css";

function ReturnBook() {
  const [issues, setIssues] = useState([]);
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [issuesRes, studentsRes, booksRes] =
        await Promise.all([
          fetch("http://localhost:8080/api/issues"),
          fetch("http://localhost:8080/api/students"),
          fetch("http://localhost:8080/api/books"),
        ]);

      if (
        !issuesRes.ok ||
        !studentsRes.ok ||
        !booksRes.ok
      ) {
        throw new Error();
      }

      setIssues(await issuesRes.json());
      setStudents(await studentsRes.json());
      setBooks(await booksRes.json());
    } catch (error) {
      console.error(error);
      showToast("Failed to load data", "error");
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const issuedBooks = issues.filter(
    issue =>
      String(issue.status || "").toLowerCase() === "issued"
  );

  const filteredBooks = issuedBooks.filter(issue => {
    const text = search.toLowerCase().trim();

    const student = students.find(
      s => String(s.id) === String(issue.studentId)
    );

    const book = books.find(
      b => String(b.id) === String(issue.bookId)
    );

    return (
      String(issue.studentId).includes(text) ||
      String(student?.name || "")
        .toLowerCase()
        .includes(text) ||
      String(issue.bookId).includes(text) ||
      String(book?.bookName || "")
        .toLowerCase()
        .includes(text)
    );
  });

  const getDueStatus = dueDate => {
    if (!dueDate) return "No Due Date";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    if (due < today) return "Overdue";

    if (due.getTime() === today.getTime()) {
      return "Due Today";
    }

    return "On Time";
  };

  const confirmReturnBook = async () => {
    if (!selectedIssue) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/issues/${selectedIssue.id}/return`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setSelectedIssue(null);

      await loadData();

      showToast("Book returned successfully!");
    } catch (error) {
      console.error(error);
      showToast("Failed to return book", "error");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Topbar title="Return Book" />

        <div className="return-book-container">

          <div className="return-book-header">
            <h2>Return Book</h2>
          </div>

          <div className="return-search-container">
            <input
              type="text"
              placeholder="Search by Student ID, Student Name, Book ID or Book Name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="return-books-section">
            <h2>Currently Issued Books</h2>

            <table className="book-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Book ID</th>
                  <th>Book Name</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No issued books found
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map(issue => {
                    const student = students.find(
                      s =>
                        String(s.id) ===
                        String(issue.studentId)
                    );

                    const book = books.find(
                      b =>
                        String(b.id) ===
                        String(issue.bookId)
                    );

                    const dueStatus = getDueStatus(
                      issue.returnDate
                    );

                    return (
                      <tr key={issue.id}>
                        <td>{issue.studentId}</td>

                        <td>
                          {student?.name ||
                            issue.studentName ||
                            "Unknown Student"}
                        </td>

                        <td>{issue.bookId}</td>

                        <td>
                          {book?.bookName ||
                            issue.bookName ||
                            "Unknown Book"}
                        </td>

                        <td>{issue.issueDate}</td>

                        <td>{issue.returnDate}</td>

                        <td>
                          <span
                            className={
                              dueStatus === "Overdue"
                                ? "overdue-status"
                                : dueStatus === "Due Today"
                                ? "due-today-status"
                                : "on-time-status"
                            }
                          >
                            {dueStatus}
                          </span>
                        </td>

                        <td>
                          <button
                            className="return-btn"
                            onClick={() =>
                              setSelectedIssue(issue)
                            }
                          >
                            Return Book
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedIssue && (
          <div className="modal-overlay">
            <div className="delete-modal">
              <h2>Are you sure?</h2>

              <p>
                Are you sure you want to return this book?
              </p>

              <div className="delete-buttons">
                <button
                  className="student-delete-cancel"
                  onClick={() =>
                    setSelectedIssue(null)
                  }
                >
                  Cancel
                </button>

                <button
                  className="student-delete-confirm"
                  onClick={confirmReturnBook}
                >
                  Return Book
                </button>
              </div>
            </div>
          </div>
        )}

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

export default ReturnBook;