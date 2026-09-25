import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/reports.css";

function Reports() {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [reportFilter, setReportFilter] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksRes, studentsRes, issuesRes] = await Promise.all([
          fetch("http://localhost:8080/api/books"),
          fetch("http://localhost:8080/api/students"),
          fetch("http://localhost:8080/api/issues")
        ]);

        if (!booksRes.ok || !studentsRes.ok || !issuesRes.ok)
          throw new Error("Failed to load data");

        const booksData = await booksRes.json();
        const studentsData = await studentsRes.json();
        const issuesData = await issuesRes.json();

        setBooks(booksData.sort((a, b) => Number(a.id) - Number(b.id)));
        setStudents(studentsData.sort((a, b) => Number(a.id) - Number(b.id)));
        setIssuedBooks(issuesData);
      } catch (error) {
        console.error("Error loading reports:", error);
      }
    };

    loadData();
  }, []);

  const getStudentName = id => {
    const student = students.find(s => String(s.id) === String(id));
    return student ? student.name : "Unknown Student";
  };

  const getBookName = id => {
    const book = books.find(b => String(b.id) === String(id));
    return book ? book.bookName : "Unknown Book";
  };

  const searchText = search.toLowerCase().trim();

  const matchesSearch = issue => {
    if (!searchText) return true;

    return (
      String(issue.studentId).includes(searchText) ||
      getStudentName(issue.studentId).toLowerCase().includes(searchText) ||
      String(issue.bookId).includes(searchText) ||
      getBookName(issue.bookId).toLowerCase().includes(searchText)
    );
  };

  const currentlyIssued = issuedBooks.filter(
    issue => String(issue.status).toLowerCase() === "issued"
  );

  const returnedBooks = issuedBooks.filter(
    issue => String(issue.status).toLowerCase() === "returned"
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueBooks = currentlyIssued.filter(issue => {
    if (!issue.returnDate) return false;

    const due = new Date(issue.returnDate);
    due.setHours(0, 0, 0, 0);

    return due < today;
  });

  const filteredIssuedBooks = currentlyIssued.filter(matchesSearch);
  const filteredOverdueBooks = overdueBooks.filter(matchesSearch);
  const filteredReturnedBooks = returnedBooks.filter(matchesSearch);

  const getDaysLate = date => {
    const due = new Date(date);
    due.setHours(0, 0, 0, 0);

    return Math.max(
      0,
      Math.floor((today - due) / (1000 * 60 * 60 * 24))
    );
  };

  const renderEmpty = (message, colSpan) => (
    <tr>
      <td colSpan={colSpan}>{message}</td>
    </tr>
  );

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Topbar title="Reports" />

        <div className="reports-container">

          <div className="reports-header">
            <h2>Library Reports</h2>
            <p>View and analyze your library activity</p>

            <input
              type="text"
              className="report-search"
              placeholder="Search by student name, student ID, book name or book ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div className="report-filters">
              {["all", "issued", "overdue", "returned"].map(filter => (
                <button
                  key={filter}
                  className={reportFilter === filter ? "active" : ""}
                  onClick={() => setReportFilter(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ISSUED BOOKS */}

          {(reportFilter === "all" || reportFilter === "issued") && (
            <div className="report-section">
              <h2>Issued Books Report</h2>

              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Book ID</th>
                      <th>Book Name</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredIssuedBooks.length === 0
                      ? renderEmpty(
                          search
                            ? "No matching issued books found"
                            : "No issued books found",
                          7
                        )
                      : filteredIssuedBooks.map(issue => (
                          <tr key={issue.id}>
                            <td>{issue.studentId}</td>
                            <td>{getStudentName(issue.studentId)}</td>
                            <td>{issue.bookId}</td>
                            <td>{getBookName(issue.bookId)}</td>
                            <td>{issue.issueDate}</td>
                            <td>{issue.returnDate}</td>
                            <td>
                              <span className="status-issued">
                                Issued
                              </span>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* OVERDUE */}

          {(reportFilter === "all" || reportFilter === "overdue") && (
            <div className="report-section">
              <h2>Overdue Books</h2>

              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Book ID</th>
                      <th>Book Name</th>
                      <th>Due Date</th>
                      <th>Days Late</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOverdueBooks.length === 0
                      ? renderEmpty(
                          search
                            ? "No matching overdue books found"
                            : "No overdue books",
                          6
                        )
                      : filteredOverdueBooks.map(issue => (
                          <tr key={issue.id}>
                            <td>{issue.studentId}</td>
                            <td>{getStudentName(issue.studentId)}</td>
                            <td>{issue.bookId}</td>
                            <td>{getBookName(issue.bookId)}</td>
                            <td>{issue.returnDate}</td>
                            <td>
                              <span className="status-overdue">
                                {getDaysLate(issue.returnDate)}
                              </span>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RETURN HISTORY */}

          {(reportFilter === "all" || reportFilter === "returned") && (
            <div className="report-section">
              <h2>Return History</h2>

              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Book ID</th>
                      <th>Book Name</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Actual Return</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredReturnedBooks.length === 0
                      ? renderEmpty(
                          search
                            ? "No matching return records found"
                            : "No returned books found",
                          8
                        )
                      : filteredReturnedBooks.map(issue => (
                          <tr key={issue.id}>
                            <td>{issue.studentId}</td>
                            <td>{getStudentName(issue.studentId)}</td>
                            <td>{issue.bookId}</td>
                            <td>{getBookName(issue.bookId)}</td>
                            <td>{issue.issueDate}</td>
                            <td>{issue.returnDate}</td>

                            <td>
                              {issue.actualReturnDate
                                ? issue.actualReturnDate
                                : "Return date unavailable"}
                            </td>

                            <td>
                              <span className="status-returned">
                                Returned
                              </span>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Reports;