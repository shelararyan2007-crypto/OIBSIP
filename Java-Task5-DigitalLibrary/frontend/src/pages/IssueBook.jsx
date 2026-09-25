import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Toast from "../components/Toast";
import "../styles/issueBook.css";

function IssueBook() {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");

  const [studentSearch, setStudentSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  const [issueDate, setIssueDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [toast, setToast] = useState(null);

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

      setStudents(
        [...data].sort(
          (a, b) => Number(a.id) - Number(b.id)
        )
      );
    } catch (error) {
      console.error(
        "Failed to load students:",
        error
      );

      showToast(
        "Failed to load students",
        "error"
      );
    }
  }, [showToast]);

  /* =========================================
     LOAD BOOKS
  ========================================= */

  const loadBooks = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/books"
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      setBooks(
        [...data].sort(
          (a, b) => Number(a.id) - Number(b.id)
        )
      );
    } catch (error) {
      console.error(
        "Failed to load books:",
        error
      );

      showToast(
        "Failed to load books",
        "error"
      );
    }
  }, [showToast]);

  /* =========================================
     LOAD ISSUES
  ========================================= */

  const loadIssues = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/issues"
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      setIssuedBooks(data);
    } catch (error) {
      console.error(
        "Failed to load issued books:",
        error
      );

      showToast(
        "Failed to load issued books",
        "error"
      );
    }
  }, [showToast]);

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    loadStudents();
    loadBooks();
    loadIssues();
  }, [
    loadStudents,
    loadBooks,
    loadIssues,
  ]);

  /* =========================================
     CREATE STUDENT NOTIFICATION
  ========================================= */

  const createIssueNotification = (
    studentId,
    bookName,
    returnDate
  ) => {
    const existingNotifications =
      JSON.parse(
        localStorage.getItem(
          "studentNotifications"
        ) || "[]"
      );

    const newNotification = {
      id: Date.now(),

      studentId: Number(studentId),

      type: "issued",

      title: "Book issued",

      message: `${bookName} has been issued to you. Due date: ${returnDate}.`,

      date: new Date().toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),

      read: false,
    };

    const updatedNotifications = [
      newNotification,
      ...existingNotifications,
    ];

    localStorage.setItem(
      "studentNotifications",
      JSON.stringify(
        updatedNotifications
      )
    );

    window.dispatchEvent(
      new Event(
        "studentNotificationsUpdated"
      )
    );
  };

  /* =========================================
     STUDENT SEARCH
  ========================================= */

  const filteredStudents =
    students.filter((student) => {
      const text =
        studentSearch
          .trim()
          .toLowerCase();

      if (!text) {
        return false;
      }

      /* NUMBER = EXACT ID */

      if (/^\d+$/.test(text)) {
        return (
          String(student.id) === text
        );
      }

      /* TEXT = NAME OR EMAIL */

      return (
        String(student.name || "")
          .toLowerCase()
          .includes(text) ||
        String(student.email || "")
          .toLowerCase()
          .includes(text)
      );
    });

  /* =========================================
     BOOK SEARCH
  ========================================= */

  const filteredBooks =
    books.filter((book) => {
      const text =
        bookSearch
          .trim()
          .toLowerCase();

      if (!text) {
        return false;
      }

      /* ONLY AVAILABLE BOOKS */

      if (Number(book.quantity) <= 0) {
        return false;
      }

      /* ID SEARCH */

      if (/^\d+$/.test(text)) {
        return (
          String(book.id) === text
        );
      }

      /* NAME / AUTHOR / CATEGORY SEARCH */

      return (
        String(book.bookName || "")
          .toLowerCase()
          .includes(text) ||
        String(book.author || "")
          .toLowerCase()
          .includes(text) ||
        String(book.category || "")
          .toLowerCase()
          .includes(text)
      );
    });

  /* =========================================
     ISSUE BOOK
  ========================================= */

  const handleIssueBook = async () => {
    /* REQUIRED FIELDS */

    if (
      !studentId ||
      !bookId ||
      !issueDate ||
      !returnDate
    ) {
      showToast(
        "Please fill all fields",
        "error"
      );

      return;
    }

    /* DATE VALIDATION */

    if (returnDate < issueDate) {
      showToast(
        "Return date cannot be before issue date!",
        "error"
      );

      return;
    }

    /* FIND STUDENT */

    const student =
      students.find(
        (s) =>
          String(s.id) ===
          String(studentId)
      );

    /* FIND BOOK */

    const book =
      books.find(
        (b) =>
          String(b.id) ===
          String(bookId)
      );

    if (!student) {
      showToast(
        "Student not found!",
        "error"
      );

      return;
    }

    if (!book) {
      showToast(
        "Book not found!",
        "error"
      );

      return;
    }

    /* CHECK QUANTITY */

    if (Number(book.quantity) <= 0) {
      showToast(
        "This book is not available!",
        "error"
      );

      return;
    }

    /* CHECK DUPLICATE ISSUE */

    const alreadyIssued =
      issuedBooks.some(
        (issue) =>
          String(issue.studentId) ===
            String(studentId) &&
          String(issue.bookId) ===
            String(bookId) &&
          String(
            issue.status || ""
          ).toLowerCase() ===
            "issued"
      );

    if (alreadyIssued) {
      showToast(
        "This book is already issued to this student!",
        "error"
      );

      return;
    }

    try {
      /* =====================================
         CREATE ISSUE RECORD
      ===================================== */

      const issueResponse =
        await fetch(
          "http://localhost:8080/api/issues",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              bookId: Number(bookId),

              studentId: Number(studentId),

              issueDate,

              returnDate,
            }),
          }
        );

      if (!issueResponse.ok) {
        const errorText =
          await issueResponse.text();

        console.error(
          "Issue book error:",
          errorText
        );

        throw new Error(
          errorText ||
            "Failed to create issue"
        );
      }

      /* =====================================
         UPDATE BOOK QUANTITY
      ===================================== */

      const updatedQuantity =
        Number(book.quantity) - 1;

      const bookResponse =
        await fetch(
          `http://localhost:8080/api/books/${book.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              bookName:
                book.bookName,

              author:
                book.author,

              category:
                book.category,

              quantity:
                updatedQuantity,
            }),
          }
        );

      if (!bookResponse.ok) {
        const errorText =
          await bookResponse.text();

        console.error(
          "Book quantity update error:",
          errorText
        );

        throw new Error(
          errorText ||
            "Failed to update book quantity"
        );
      }

      /* =====================================
         UPDATE BOOKS IN FRONTEND
      ===================================== */

      setBooks((prev) =>
        prev.map((currentBook) =>
          String(currentBook.id) ===
          String(book.id)
            ? {
                ...currentBook,

                quantity:
                  updatedQuantity,
              }
            : currentBook
        )
      );

      /* =====================================
         RELOAD ISSUES
      ===================================== */

      await loadIssues();

      /* =====================================
         CREATE NOTIFICATION
      ===================================== */

      createIssueNotification(
        student.id,
        book.bookName,
        returnDate
      );

      /* =====================================
         SUCCESS
      ===================================== */

      showToast(
        "Book issued successfully!"
      );

      /* =====================================
         CLEAR FORM
      ===================================== */

      setStudentId("");
      setBookId("");

      setStudentSearch("");
      setBookSearch("");

      setIssueDate("");
      setReturnDate("");
    } catch (error) {
      console.error(
        "Failed to issue book:",
        error
      );

      showToast(
        "Failed to issue book",
        "error"
      );
    }
  };

  /* =========================================
     CURRENTLY ISSUED BOOKS
  ========================================= */

  const currentlyIssued =
    issuedBooks.filter(
      (issue) =>
        String(
          issue.status || ""
        ).toLowerCase() ===
        "issued"
    );

  /* =========================================
     RECENT HISTORY
  ========================================= */

  const recentHistory =
    issuedBooks.filter((issue) => {
      const status =
        String(
          issue.status || ""
        ).toLowerCase();

      /* CURRENTLY ISSUED */

      if (status === "issued") {
        return true;
      }

      /* RECENTLY RETURNED */

      if (
        status === "returned" &&
        issue.actualReturnDate
      ) {
        const returned =
          new Date(
            issue.actualReturnDate
          );

        const today =
          new Date();

        returned.setHours(
          0,
          0,
          0,
          0
        );

        today.setHours(
          0,
          0,
          0,
          0
        );

        const days = Math.floor(
          (today - returned) /
            (1000 *
              60 *
              60 *
              24)
        );

        return days <= 2;
      }

      return false;
    });

  /* =========================================
     GET STUDENT NAME
  ========================================= */

  const getStudentName = (id) => {
    const student =
      students.find(
        (s) =>
          String(s.id) ===
          String(id)
      );

    return (
      student?.name ||
      "Unknown Student"
    );
  };

  /* =========================================
     GET BOOK NAME
  ========================================= */

  const getBookName = (id) => {
    const book =
      books.find(
        (b) =>
          String(b.id) ===
          String(id)
      );

    return (
      book?.bookName ||
      "Unknown Book"
    );
  };

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <div className="main-content">

        {/* TOPBAR */}

        <Topbar title="Issue Book" />

        <div className="issue-book-container">

          {/* HEADER */}

          <div className="issue-book-header">

            <div>
              <h2>Issue Book</h2>

              <p>
                Issue books to registered students
              </p>
            </div>

          </div>

          {/* ISSUE BOOK CARD */}

          <div className="issue-book-card">

            <h3>
              Issue a Book
            </h3>

            <div className="issue-book-form">

              {/* STUDENT */}

              <div className="form-group">

                <label>
                  Student
                </label>

                <input
                  type="text"
                  placeholder="Search student by ID or name..."
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(
                      e.target.value
                    );

                    setStudentId("");
                  }}
                />

                {studentSearch &&
                  !studentId && (
                    <div className="search-results">

                      {filteredStudents.length >
                      0 ? (
                        filteredStudents.map(
                          (student) => (
                            <div
                              key={
                                student.id
                              }
                              className="search-result-item"
                              onClick={() => {
                                setStudentId(
                                  student.id
                                );

                                setStudentSearch(
                                  `${student.name} (ID: ${student.id})`
                                );
                              }}
                            >

                              <strong>
                                {
                                  student.name
                                }
                              </strong>

                              <span>
                                ID:{" "}
                                {
                                  student.id
                                }
                              </span>

                            </div>
                          )
                        )
                      ) : (
                        <div className="no-results">
                          No student found
                        </div>
                      )}

                    </div>
                  )}

              </div>

              {/* BOOK */}

              <div className="form-group">

                <label>
                  Book
                </label>

                <input
                  type="text"
                  placeholder="Search book by ID, name or author..."
                  value={bookSearch}
                  onChange={(e) => {
                    setBookSearch(
                      e.target.value
                    );

                    setBookId("");
                  }}
                />

                {bookSearch &&
                  !bookId && (
                    <div className="search-results">

                      {filteredBooks.length >
                      0 ? (
                        filteredBooks.map(
                          (book) => (
                            <div
                              key={
                                book.id
                              }
                              className="search-result-item"
                              onClick={() => {
                                setBookId(
                                  book.id
                                );

                                setBookSearch(
                                  `${book.bookName} (ID: ${book.id})`
                                );
                              }}
                            >

                              <strong>
                                {
                                  book.bookName
                                }
                              </strong>

                              <span>
                                ID:{" "}
                                {
                                  book.id
                                }
                              </span>

                            </div>
                          )
                        )
                      ) : (
                        <div className="no-results">
                          No available book found
                        </div>
                      )}

                    </div>
                  )}

              </div>

              {/* ISSUE DATE */}

              <div className="form-group">

                <label>
                  Issue Date
                </label>

                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) =>
                    setIssueDate(
                      e.target.value
                    )
                  }
                />

              </div>

              {/* RETURN DATE */}

              <div className="form-group">

                <label>
                  Return Date
                </label>

                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) =>
                    setReturnDate(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* ISSUE BUTTON */}

            <div className="issue-book-button-container">

              <button
                className="issue-book-btn"
                onClick={
                  handleIssueBook
                }
              >
                Issue Book
              </button>

            </div>

          </div>

          {/* CURRENTLY ISSUED BOOKS */}

          <div className="issued-books-section">

            <h2>
              Currently Issued Books
            </h2>

            <table className="book-table">

              <thead>

                <tr>

                  <th>
                    Student ID
                  </th>

                  <th>
                    Student Name
                  </th>

                  <th>
                    Book ID
                  </th>

                  <th>
                    Book Name
                  </th>

                  <th>
                    Issue Date
                  </th>

                  <th>
                    Return Date
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentlyIssued.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="no-data"
                    >
                      No books currently issued
                    </td>

                  </tr>

                ) : (

                  currentlyIssued.map(
                    (issue) => (

                      <tr
                        key={issue.id}
                      >

                        <td>
                          {
                            issue.studentId
                          }
                        </td>

                        <td>
                          {getStudentName(
                            issue.studentId
                          )}
                        </td>

                        <td>
                          {
                            issue.bookId
                          }
                        </td>

                        <td>
                          {getBookName(
                            issue.bookId
                          )}
                        </td>

                        <td>
                          {
                            issue.issueDate
                          }
                        </td>

                        <td>
                          {
                            issue.returnDate
                          }
                        </td>

                        <td>

                          <span className="issued-status">
                            Issued
                          </span>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

          {/* ISSUE & RETURN HISTORY */}

          <div className="issued-books-section">

            <h2>
              Issue & Return History
            </h2>

            <table className="book-table">

              <thead>

                <tr>

                  <th>
                    Student ID
                  </th>

                  <th>
                    Student Name
                  </th>

                  <th>
                    Book ID
                  </th>

                  <th>
                    Book Name
                  </th>

                  <th>
                    Issue Date
                  </th>

                  <th>
                    Due Date
                  </th>

                  <th>
                    Actual Return
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentHistory.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="no-data"
                    >
                      No issue or return history
                    </td>

                  </tr>

                ) : (

                  recentHistory.map(
                    (issue) => {

                      const status =
                        String(
                          issue.status ||
                            ""
                        ).toLowerCase();

                      return (

                        <tr
                          key={
                            issue.id
                          }
                        >

                          <td>
                            {
                              issue.studentId
                            }
                          </td>

                          <td>
                            {getStudentName(
                              issue.studentId
                            )}
                          </td>

                          <td>
                            {
                              issue.bookId
                            }
                          </td>

                          <td>
                            {getBookName(
                              issue.bookId
                            )}
                          </td>

                          <td>
                            {
                              issue.issueDate
                            }
                          </td>

                          <td>
                            {
                              issue.returnDate
                            }
                          </td>

                          <td>
                            {
                              issue.actualReturnDate ||
                              "-"
                            }
                          </td>

                          <td>

                            <span
                              className={
                                status ===
                                "returned"
                                  ? "returned-status"
                                  : "issued-status"
                              }
                            >
                              {status ===
                              "returned"
                                ? "Returned"
                                : "Issued"}
                            </span>

                          </td>

                        </tr>

                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

          {/* TOAST */}

          {toast && (
            <Toast
              message={
                toast.message
              }
              type={
                toast.type
              }
              onClose={
                closeToast
              }
            />
          )}

        </div>

      </div>

    </div>
  );
}

export default IssueBook;