import { useEffect, useState } from "react";
import { BookOpen, Search, User } from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";
import "../styles/studentBooks.css";

function StudentBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/books")
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error(err));
  }, []);

  const filteredBooks = books.filter(book =>
    `${book.bookName} ${book.author} ${book.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const student = JSON.parse(
    localStorage.getItem("student")
  );

  return (
    <div className="student-dashboard">

      <StudentSidebar activePage="Available Books" />

      <main className="student-main">

        <div className="student-books-topbar">

          <div>
            <p>Student Portal</p>
            <h1>Available Books</h1>
          </div>

          <div className="student-books-profile">
            <div className="student-books-avatar">
              {student?.name?.charAt(0).toUpperCase() || "S"}
            </div>

            <div>
              <h4>{student?.name || "Student"}</h4>
              <span>Student</span>
            </div>
          </div>

        </div>

        <div className="student-books-header">

          <div>
            <h2>Library Collection</h2>
            <p>
              Browse books currently available in the library.
            </p>
          </div>

          <div className="student-books-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

        </div>

        <div className="student-books-grid">

          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <div
                className="student-book-card"
                key={book.id}
              >

                <div className="student-book-icon">
                  <BookOpen size={30} />
                </div>

                <div className="student-book-info">

                  <h3>{book.bookName}</h3>

                  <p>
                    By {book.author}
                  </p>

                  <span>
                    {book.category}
                  </span>

                </div>

                <div className="student-book-bottom">

                  <div>
                    <small>Available</small>
                    <strong>{book.quantity}</strong>
                  </div>

                  <button>
                    View Details
                  </button>

                </div>

              </div>
            ))
          ) : (
            <div className="student-no-books">
              <BookOpen size={40} />
              <h3>No books found</h3>
              <p>
                Try searching with another book name,
                author or category.
              </p>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default StudentBooks;