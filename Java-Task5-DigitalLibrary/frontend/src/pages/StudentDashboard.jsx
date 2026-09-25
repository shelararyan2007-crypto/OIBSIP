import {
  BookOpen,
  BookMarked,
  Clock3,
  CheckCircle2,
  Bell,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentSidebar from "../components/StudentSidebar";
import "../styles/studentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);

  /* =====================================================
     LOAD STUDENT
  ===================================================== */

  useEffect(() => {
    const savedStudent = localStorage.getItem("student");

    if (savedStudent) {
      setStudent(JSON.parse(savedStudent));
    }
  }, []);

  const studentName = student?.name || "Student";

  /* =====================================================
     LOAD BOOKS + ISSUES
  ===================================================== */

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const booksResponse = await fetch(
          "http://localhost:8080/api/books"
        );

        if (booksResponse.ok) {
          const booksData = await booksResponse.json();
          setBooks(booksData);
        }

        const issuesResponse = await fetch(
          "http://localhost:8080/api/issues"
        );

        if (issuesResponse.ok) {
          const issuesData = await issuesResponse.json();
          setIssues(issuesData);
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );
      }
    };

    loadDashboardData();
  }, []);

  /* =====================================================
     STUDENT ISSUES
  ===================================================== */

  const studentIssues = issues.filter(
    (issue) =>
      String(issue.studentId) === String(student?.id)
  );

  const issuedBooks = studentIssues.filter(
    (issue) =>
      String(issue.status || "").toLowerCase() === "issued"
  );

  const returnedBooks = studentIssues.filter(
    (issue) =>
      String(issue.status || "").toLowerCase() === "returned"
  );

  /* =====================================================
     DUE SOON
  ===================================================== */

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueSoonBooks = issuedBooks.filter((issue) => {
    if (!issue.returnDate) return false;

    const dueDate = new Date(issue.returnDate);
    dueDate.setHours(0, 0, 0, 0);

    const difference =
      (dueDate - today) / (1000 * 60 * 60 * 24);

    return difference >= 0 && difference <= 3;
  });

  /* =====================================================
     RECENT ACTIVITY
  ===================================================== */

  const recentActivity = [...studentIssues]
    .sort((a, b) => {
      const dateA = new Date(
        a.actualReturnDate || a.issueDate || 0
      );

      const dateB = new Date(
        b.actualReturnDate || b.issueDate || 0
      );

      return dateB - dateA;
    })
    .slice(0, 3);

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="student-dashboard">
<StudentSidebar
  activePage="Dashboard"
  notificationCount={
    Number(
      localStorage.getItem(
        "unreadNotificationCount"
      )
    ) || 0
  }
/>
      

      <main className="student-main">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <div className="student-topbar">

          <div>
            <p className="dashboard-small-title">
              Student Portal
            </p>

            <h1>Dashboard</h1>
          </div>

          <div className="student-topbar-right">

            {/* NOTIFICATION BUTTON */}

            <button
              className="notification-button"
              onClick={() =>
                navigate("/student-notifications")
              }
              title="Notifications"
            >
              <Bell
                size={21}
                strokeWidth={1.8}
              />

              <span className="notification-dot"></span>
            </button>

            {/* PROFILE */}

            <div
              className="student-profile-box"
              onClick={() =>
                navigate("/student-profile")
              }
              style={{ cursor: "pointer" }}
            >

              <div className="student-avatar">
                {studentName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="student-profile-info">

                <h4>{studentName}</h4>

                <p>Student</p>

              </div>

            </div>

          </div>
        </div>


        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="student-welcome">

          <div className="welcome-content">

            <p className="welcome-label">
              Welcome back 👋
            </p>

            <h2>
              Hello, {studentName}
            </h2>

            <p>
              Keep track of your books, borrowing
              history and library activity from here.
            </p>

          </div>

          <div className="welcome-icon">
            <BookOpen
              size={75}
              strokeWidth={1.2}
            />
          </div>

        </section>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="student-stat-grid">

          {/* AVAILABLE */}

          <div className="student-stat-card">

            <div className="stat-icon blue">
              <BookOpen size={24} />
            </div>

            <div className="stat-info">

              <p>Available Books</p>

              <h3>
                {books.reduce(
                  (total, book) =>
                    total + Number(book.quantity || 0),
                  0
                )}
              </h3>

              <button
                className="stat-positive"
                onClick={() =>
                  navigate("/available-books")
                }
                style={{
                  border: "none",
                  background: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <ArrowRight size={13} />
                Browse books
              </button>

            </div>
          </div>


          {/* ISSUED */}

          <div className="student-stat-card">

            <div className="stat-icon purple">
              <BookMarked size={24} />
            </div>

            <div className="stat-info">

              <p>Issued Books</p>

              <h3>
                {issuedBooks.length}
              </h3>

              <span>
                Currently borrowed
              </span>

            </div>
          </div>


          {/* DUE SOON */}

          <div className="student-stat-card">

            <div className="stat-icon orange">
              <Clock3 size={24} />
            </div>

            <div className="stat-info">

              <p>Due Soon</p>

              <h3>
                {dueSoonBooks.length}
              </h3>

              <span className="stat-warning">
                Return within 3 days
              </span>

            </div>
          </div>


          {/* RETURNED */}

          <div className="student-stat-card">

            <div className="stat-icon green">
              <CheckCircle2 size={24} />
            </div>

            <div className="stat-info">

              <p>Books Returned</p>

              <h3>
                {returnedBooks.length}
              </h3>

              <span className="stat-success">
                Successfully returned
              </span>

            </div>
          </div>

        </section>


        {/* =================================================
            ISSUED + NOTIFICATIONS
        ================================================= */}

        <section className="student-content-grid">

          {/* CURRENTLY ISSUED */}

          <div className="dashboard-card issued-books-card">

            <div className="card-header">

              <div>

                <h3>Currently Issued</h3>

                <p>
                  Books currently borrowed
                </p>

              </div>

              <button
                className="view-all-btn"
                onClick={() =>
                  navigate("/student-history")
                }
              >
                View All
                <ArrowRight size={16} />
              </button>

            </div>


            <div className="issued-book-list">

              {issuedBooks.length > 0 ? (

                issuedBooks
                  .slice(0, 3)
                  .map((issue) => (

                    <div
                      className="issued-book"
                      key={issue.id}
                    >

                      <div className="book-cover">
                        <BookOpen size={25} />
                      </div>

                      <div className="book-details">

                        <h4>
                          {issue.bookName}
                        </h4>

                        <p>
                          Student ID: {issue.studentId}
                        </p>

                      </div>

                      <div className="book-due">

                        <span>
                          Due Date
                        </span>

                        <strong>
                          {formatDate(
                            issue.returnDate
                          )}
                        </strong>

                      </div>

                    </div>

                  ))

              ) : (

                <div className="no-issued-books">

                  <BookOpen size={30} />

                  <p>
                    No books currently issued.
                  </p>

                </div>

              )}

            </div>

          </div>


          {/* NOTIFICATIONS */}

          <div className="dashboard-card notifications-card">

            <div className="card-header">

              <div>

                <h3>Notifications</h3>

                <p>
                  Latest library updates
                </p>

              </div>

              <button
                className="notification-header-button"
                onClick={() =>
                  navigate(
                    "/student-notifications"
                  )
                }
              >
                <Bell
                  size={20}
                  className="card-header-icon"
                />
              </button>

            </div>


            <div className="notification-list">

              {dueSoonBooks.length > 0 && (

                <div className="student-notification">

                  <div className="notification-icon blue">
                    <CalendarDays size={18} />
                  </div>

                  <div>

                    <h4>
                      Book due soon
                    </h4>

                    <p>
                      {dueSoonBooks[0].bookName}{" "}
                      is due on{" "}
                      {formatDate(
                        dueSoonBooks[0].returnDate
                      )}
                      .
                    </p>

                    <span>
                      Upcoming
                    </span>

                  </div>

                </div>

              )}


              {returnedBooks.length > 0 && (

                <div className="student-notification">

                  <div className="notification-icon green">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>

                    <h4>
                      Book returned
                    </h4>

                    <p>
                      Your previous book was
                      returned successfully.
                    </p>

                    <span>
                      Recently
                    </span>

                  </div>

                </div>

              )}


              {books.length > 0 && (

                <div className="student-notification">

                  <div className="notification-icon purple">
                    <BookOpen size={18} />
                  </div>

                  <div>

                    <h4>
                      Books available
                    </h4>

                    <p>
                      Browse the latest books
                      available in the library.
                    </p>

                    <span>
                      Available now
                    </span>

                  </div>

                </div>

              )}

            </div>

          </div>

        </section>


        {/* =================================================
            RECENT ACTIVITY
        ================================================= */}

        <section className="dashboard-card recent-activity">

          <div className="card-header">

            <div>

              <h3>
                Recent Activity
              </h3>

              <p>
                Your recent library activity
              </p>

            </div>

            <button
              className="view-all-btn"
              onClick={() =>
                navigate("/student-history")
              }
            >
              View History
              <ArrowRight size={16} />
            </button>

          </div>


          <div className="activity-table">

            <div className="activity-row activity-heading">

              <span>Book</span>
              <span>Activity</span>
              <span>Date</span>
              <span>Status</span>

            </div>


            {recentActivity.length > 0 ? (

              recentActivity.map((activity) => {

                const returned =
                  String(
                    activity.status || ""
                  ).toLowerCase() ===
                  "returned";

                return (

                  <div
                    className="activity-row"
                    key={activity.id}
                  >

                    <div className="activity-book">

                      <div className="small-book-icon">
                        <BookOpen size={17} />
                      </div>

                      <span>
                        {activity.bookName}
                      </span>

                    </div>

                    <span>
                      {returned
                        ? "Book Returned"
                        : "Book Issued"}
                    </span>

                    <span>
                      {formatDate(
                        returned
                          ? activity.actualReturnDate
                          : activity.issueDate
                      )}
                    </span>

                    <span
                      className={
                        returned
                          ? "status-returned"
                          : "status-issued"
                      }
                    >
                      {returned
                        ? "Returned"
                        : "Issued"}
                    </span>

                  </div>

                );
              })

            ) : (

              <div className="no-activity">
                No recent activity
              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;