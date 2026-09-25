import { useEffect, useState } from "react";

import {
  BookOpen,
  Search,
  CalendarDays,
  RotateCcw,
} from "lucide-react";

import StudentSidebar from "../components/StudentSidebar";

import "../styles/studentHistory.css";


function StudentHistory() {

  // =========================
  // STATES
  // =========================

  const [history, setHistory] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================
  // GET LOGGED-IN STUDENT
  // =========================

  const student = JSON.parse(
    localStorage.getItem("student")
  );


  // =========================
  // FETCH HISTORY
  // =========================

  useEffect(() => {

    const fetchHistory = async () => {

      if (!student?.id) {

        setError("Student information not found.");

        setLoading(false);

        return;
      }


      try {

        setLoading(true);

        setError("");


        const response = await fetch(
          `http://localhost:8080/api/issues/student/${student.id}`
        );


        if (!response.ok) {

          throw new Error(
            "Failed to fetch student history"
          );
        }


        const data = await response.json();


        setHistory(
          Array.isArray(data) ? data : []
        );

      } catch (err) {

        console.error(
          "History error:",
          err
        );

        setError(
          "Unable to load your borrowing history."
        );

      } finally {

        setLoading(false);
      }
    };


    fetchHistory();

  }, [student?.id]);


  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }


    const dateObject = new Date(date);


    if (isNaN(dateObject.getTime())) {
      return date;
    }


    return dateObject.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // =========================
  // SEARCH
  // =========================

  const filteredHistory = history.filter(
    (item) => {

      const bookName =
        item.bookName || "";

      const status =
        item.status || "";

      const bookId =
        item.bookId
          ? String(item.bookId)
          : "";


      const searchText =
        `${bookName} ${status} ${bookId}`
          .toLowerCase();


      return searchText.includes(
        search.toLowerCase()
      );
    }
  );


  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {

    if (
      status?.toLowerCase() ===
      "returned"
    ) {

      return "history-status returned";
    }


    return "history-status issued";
  };


  // =========================
  // JSX
  // =========================

  return (

    <div className="student-dashboard">

      {/* =========================
          SIDEBAR
      ========================= */}

      <StudentSidebar
        activePage="History"
      />


      {/* =========================
          MAIN
      ========================= */}

      <main className="student-main">


        {/* =========================
            TOPBAR
        ========================= */}

        <div className="student-history-topbar">

          <div>

            <p>
              Student Portal
            </p>

            <h1>
              History
            </h1>

          </div>


          <div className="student-history-profile">

            <div className="student-history-avatar">

              {student?.name
                ?.charAt(0)
                .toUpperCase() || "S"}

            </div>


            <div>

              <h4>
                {student?.name || "Student"}
              </h4>

              <span>
                Student
              </span>

            </div>

          </div>

        </div>


        {/* =========================
            HEADER
        ========================= */}

        <div className="history-header">

          <div>

            <h2>
              Borrowing History
            </h2>

            <p>
              View your issued and returned books.
            </p>

          </div>


          {/* SEARCH */}

          <div className="history-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>


        {/* =========================
            HISTORY CARD
        ========================= */}

        <div className="history-card">


          {/* LOADING */}

          {loading && (

            <div className="history-empty">

              <BookOpen
                size={38}
                className="history-loading-icon"
              />

              <h3>
                Loading history...
              </h3>

              <p>
                Please wait while we fetch your records.
              </p>

            </div>

          )}


          {/* ERROR */}

          {!loading && error && (

            <div className="history-empty history-error">

              <BookOpen size={38} />

              <h3>
                Unable to load history
              </h3>

              <p>
                {error}
              </p>

            </div>

          )}


          {/* DATA */}

          {!loading &&
            !error && (

              <div className="history-table">


                {/* =========================
                    TABLE HEADER
                ========================= */}

                <div className="history-row history-heading">

                  <span>
                    Book
                  </span>

                  <span>
                    Issue Date
                  </span>

                  <span>
                    Return Date
                  </span>

                  <span>
                    Status
                  </span>

                </div>


                {/* =========================
                    HISTORY ROWS
                ========================= */}

                {filteredHistory.length > 0 ? (

                  filteredHistory.map(
                    (item) => (

                      <div
                        className="history-row"
                        key={item.id}
                      >


                        {/* BOOK */}

                        <div className="history-book">

                          <div className="history-book-icon">

                            <BookOpen
                              size={18}
                            />

                          </div>


                          <div>

                            <h4>
                              {item.bookName ||
                                "Unknown Book"}
                            </h4>

                            <p>
                              Book ID:{" "}
                              {item.bookId || "—"}
                            </p>

                          </div>

                        </div>


                        {/* ISSUE DATE */}

                        <div className="history-date">

                          <CalendarDays
                            size={14}
                          />

                          <span>
                            {formatDate(
                              item.issueDate
                            )}
                          </span>

                        </div>


                        {/* RETURN DATE */}

                        <div className="history-date">

                          <RotateCcw
                            size={14}
                          />

                          <span>
                            {formatDate(
                              item.actualReturnDate ||
                              item.returnDate
                            )}
                          </span>

                        </div>


                        {/* STATUS */}

                        <span
                          className={getStatusClass(
                            item.status
                          )}
                        >

                          {item.status ||
                            "Issued"}

                        </span>

                      </div>

                    )
                  )

                ) : (

                  /* =========================
                     NO DATA
                  ========================= */

                  <div className="history-empty">

                    <BookOpen size={38} />

                    <h3>
                      {search
                        ? "No history found"
                        : "No borrowing history"}
                    </h3>

                    <p>

                      {search
                        ? "Try another search."
                        : "Your issued and returned books will appear here."}

                    </p>

                  </div>

                )}

              </div>

            )}

        </div>

      </main>

    </div>
  );
}


export default StudentHistory;