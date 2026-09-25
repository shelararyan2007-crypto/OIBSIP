import { useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  X,
} from "lucide-react";

import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";

import "../styles/availableBooks.css";

function AvailableBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  // Selected book for View Details
  const [selectedBook, setSelectedBook] = useState(null);

  /* =====================================================
     LOAD BOOKS
  ===================================================== */

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/books"
        );

        if (!res.ok) {
          throw new Error("Failed to load books");
        }

        const data = await res.json();

        setBooks(data);
      } catch (error) {
        console.error("Failed to load books:", error);
      }
    };

    loadBooks();
  }, []);

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredBooks = books.filter((book) => {
    const text = search.trim().toLowerCase();

    if (!text) {
      return true;
    }

    return (
      String(book.id)
        .toLowerCase()
        .includes(text) ||

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

  /* =====================================================
     VIEW DETAILS
  ===================================================== */

  const handleViewDetails = (book) => {
    setSelectedBook(book);
  };

  /* =====================================================
     CLOSE DETAILS
  ===================================================== */

  const closeDetails = () => {
    setSelectedBook(null);
  };

  return (
    <div className="student-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <StudentSidebar
        activePage="Available Books"
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="student-main">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <StudentTopbar
          title="Available Books"
        />

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="available-header">

          <div>
            <h2>
              Library Books
            </h2>

            <p>
              Browse books currently available
              in the library.
            </p>
          </div>

          <div className="available-count">
            {filteredBooks.length} Books
          </div>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="available-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by book name, author, category or ID..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* =================================================
            BOOK GRID
        ================================================= */}

        <div className="available-books-grid">

          {filteredBooks.length > 0 ? (

            filteredBooks.map((book) => {

              const isAvailable =
                Number(book.quantity) > 0;

              return (
                <div
                  className="available-book-card"
                  key={book.id}
                >

                  {/* BOOK ICON */}

                  <div
                    className={`available-book-icon ${
                      isAvailable
                        ? "available-icon"
                        : "unavailable-icon"
                    }`}
                  >
                    <BookOpen size={28} />
                  </div>

                  {/* BOOK INFORMATION */}

                  <div className="available-book-info">

                    <span className="book-id">
                      ID: {book.id}
                    </span>

                    <h3>
                      {book.bookName}
                    </h3>

                    <p>
                      {book.author}
                    </p>

                    {/* META */}

                    <div className="book-meta">

                      <span>
                        {book.category}
                      </span>

                      <strong
                        className={
                          isAvailable
                            ? "book-available"
                            : "book-unavailable"
                        }
                      >
                        {isAvailable
                          ? `${book.quantity} Available`
                          : "Not Available"}
                      </strong>

                    </div>

                    {/* VIEW DETAILS */}

                    <button
                      type="button"
                      className="view-details-button"
                      onClick={() =>
                        handleViewDetails(book)
                      }
                    >
                      View Details
                    </button>

                  </div>

                </div>
              );
            })

          ) : (

            /* =================================================
               NO BOOKS
            ================================================= */

            <div className="no-books">

              <BookOpen size={40} />

              <h3>
                No books found
              </h3>

              <p>
                Try searching for another book.
              </p>

            </div>

          )}

        </div>

        {/* =================================================
            BOOK DETAILS MODAL
            IMPORTANT:
            This is INSIDE student-main so the sidebar
            remains sharp while the main content blurs.
        ================================================= */}

        {selectedBook && (

          <div
            className="book-details-overlay"
            onClick={closeDetails}
          >

            <div
              className="book-details-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* =================================================
                  MODAL HEADER
              ================================================= */}

              <div className="book-details-header">

                <div>

                  <span>
                    BOOK DETAILS
                  </span>

                  <h2>
                    {selectedBook.bookName}
                  </h2>

                </div>

                <button
                  type="button"
                  className="book-details-close"
                  onClick={closeDetails}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

              </div>

              {/* =================================================
                  BOOK ICON
              ================================================= */}

              <div
                className={`book-details-icon ${
                  Number(selectedBook.quantity) > 0
                    ? "details-icon-available"
                    : "details-icon-unavailable"
                }`}
              >
                <BookOpen size={38} />
              </div>

              {/* =================================================
                  BOOK DETAILS
              ================================================= */}

              <div className="book-details-content">

                {/* BOOK ID */}

                <div className="detail-item">

                  <span>
                    Book ID
                  </span>

                  <strong>
                    {selectedBook.id}
                  </strong>

                </div>

                {/* BOOK NAME */}

                <div className="detail-item">

                  <span>
                    Book Name
                  </span>

                  <strong>
                    {selectedBook.bookName}
                  </strong>

                </div>

                {/* AUTHOR */}

                <div className="detail-item">

                  <span>
                    Author
                  </span>

                  <strong>
                    {selectedBook.author}
                  </strong>

                </div>

                {/* CATEGORY */}

                <div className="detail-item">

                  <span>
                    Category
                  </span>

                  <strong>
                    {selectedBook.category}
                  </strong>

                </div>

                {/* QUANTITY */}

                <div className="detail-item">

                  <span>
                    Quantity
                  </span>

                  <strong>
                    {selectedBook.quantity}
                  </strong>

                </div>

                {/* STATUS */}

                <div className="detail-item">

                  <span>
                    Status
                  </span>

                  <strong
                    className={
                      Number(selectedBook.quantity) > 0
                        ? "details-available"
                        : "details-unavailable"
                    }
                  >
                    {Number(selectedBook.quantity) > 0
                      ? "Available"
                      : "Not Available"}
                  </strong>

                </div>

              </div>

              {/* =================================================
                  CLOSE BUTTON
              ================================================= */}

              <button
                type="button"
                className="details-close-btn"
                onClick={closeDetails}
              >
                Close
              </button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default AvailableBooks;