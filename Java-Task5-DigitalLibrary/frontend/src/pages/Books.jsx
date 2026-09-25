import { useState, useEffect, useCallback } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AddBookModal from "../components/AddBookModal";
import DeleteModal from "../components/DeleteModal";
import Toast from "../components/Toast";

import "../styles/books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const [toast, setToast] = useState(null);

  const [bookData, setBookData] = useState({
    id: "",
    bookName: "",
    author: "",
    category: "",
    quantity: "",
  });

  /* ================================
     TOAST
  ================================= */

  const showToast = useCallback((message, type = "success") => {
    setToast({
      message,
      type,
    });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  /* ================================
     SORT BOOKS
  ================================= */

  const sortBooks = (data) => {
    return [...data].sort(
      (a, b) => Number(a.id) - Number(b.id)
    );
  };

  /* ================================
     LOAD BOOKS
  ================================= */

  const loadBooks = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/books"
      );

      if (!response.ok) {
        throw new Error("Failed to load books");
      }

      const data = await response.json();

      setBooks(sortBooks(data));
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to load books from server",
        "error"
      );
    }
  }, [showToast]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  /* ================================
     RESET FORM
  ================================= */

  const resetForm = () => {
    setBookData({
      id: "",
      bookName: "",
      author: "",
      category: "",
      quantity: "",
    });
  };

  /* ================================
     ADD BOOK
  ================================= */

  const saveBook = async () => {
    if (
      !bookData.id ||
      !bookData.bookName.trim() ||
      !bookData.author.trim() ||
      !bookData.category.trim() ||
      !bookData.quantity
    ) {
      showToast(
        "Please fill all fields",
        "error"
      );

      return;
    }

    const idExists = books.some(
      (book) =>
        String(book.id) === String(bookData.id)
    );

    if (idExists) {
      showToast(
        `Book ID ${bookData.id} already exists!`,
        "error"
      );

      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/books",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: Number(bookData.id),
            bookName: bookData.bookName.trim(),
            author: bookData.author.trim(),
            category: bookData.category.trim(),
            quantity: Number(bookData.quantity),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      const newBook = await response.json();

      setBooks((prev) =>
        sortBooks([
          ...prev,
          newBook,
        ])
      );

      resetForm();

      setShowModal(false);

      showToast(
        "Book added successfully!"
      );

      /* Notify dashboard */
      window.dispatchEvent(
        new Event("adminDashboardUpdated")
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to add book to database",
        "error"
      );
    }
  };

  /* ================================
     EDIT BOOK
  ================================= */

  const editBook = (book) => {
    setBookData({
      id: book.id,
      bookName: book.bookName,
      author: book.author,
      category: book.category,
      quantity: book.quantity,
    });

    setIsEditing(true);

    setShowModal(true);
  };

  /* ================================
     UPDATE BOOK
  ================================= */

  const updateBook = async () => {
    if (
      !bookData.bookName.trim() ||
      !bookData.author.trim() ||
      !bookData.category.trim() ||
      !bookData.quantity
    ) {
      showToast(
        "Please fill all fields",
        "error"
      );

      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/books/${bookData.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            bookName: bookData.bookName.trim(),
            author: bookData.author.trim(),
            category: bookData.category.trim(),
            quantity: Number(bookData.quantity),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      const updatedBook = await response.json();

      setBooks((prev) =>
        sortBooks(
          prev.map((book) =>
            book.id === updatedBook.id
              ? updatedBook
              : book
          )
        )
      );

      resetForm();

      setShowModal(false);

      setIsEditing(false);

      showToast(
        "Book updated successfully!"
      );

      /* Notify dashboard */
      window.dispatchEvent(
        new Event("adminDashboardUpdated")
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to update book in database",
        "error"
      );
    }
  };

  /* ================================
     DELETE BOOK
  ================================= */

  const deleteBook = (id) => {
    setSelectedBookId(id);

    setShowDeleteModal(true);
  };

  /* ================================
     CONFIRM DELETE
  ================================= */

  const confirmDelete = async () => {
    if (selectedBookId === null) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/books/${selectedBookId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      setBooks((prev) =>
        prev.filter(
          (book) =>
            Number(book.id) !== Number(selectedBookId)
        )
      );

      setShowDeleteModal(false);

      setSelectedBookId(null);

      showToast(
        "Book deleted successfully!"
      );

      /* Notify dashboard */
      window.dispatchEvent(
        new Event("adminDashboardUpdated")
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to delete book from database",
        "error"
      );
    }
  };

  /* ================================
     SEARCH
  ================================= */

  const filteredBooks = books.filter((book) => {
    const text = search
      .toLowerCase()
      .trim();

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

  /* ================================
     CLOSE BOOK MODAL
  ================================= */

  const closeBookModal = () => {
    setShowModal(false);

    setIsEditing(false);

    resetForm();
  };

  /* ================================
     CLOSE DELETE MODAL
  ================================= */

  const closeDeleteModal = () => {
    setShowDeleteModal(false);

    setSelectedBookId(null);
  };

  /* ================================
     UI
  ================================= */

  return (
    <div className="dashboard-container">

      <Sidebar />

      <div className="main-content">

        <Topbar title="Books" />

        <div className="books-container">

          {/* HEADER */}

          <div className="books-header">

            <div>
              <h2>Manage Books</h2>

              <p className="books-subtitle">
                Add, edit and manage your library books
              </p>
            </div>

            <button
              type="button"
              className="add-book-btn"
              onClick={() => {
                resetForm();

                setIsEditing(false);

                setShowModal(true);
              }}
            >
              <span>+</span>
              Add Book
            </button>

          </div>

          {/* SEARCH */}

          <div className="books-search-wrapper">

            <span className="search-icon">
              🔍
            </span>

            <input
              className="search-box"
              type="text"
              placeholder="Search by Book Name, Author, Category or ID..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* BOOK TABLE */}

          <div className="book-table-wrapper">

            <table className="book-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Book Name</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredBooks.length > 0 ? (

                  filteredBooks.map((book) => (

                    <tr key={book.id}>

                      <td>
                        <span className="book-id">
                          {book.id}
                        </span>
                      </td>

                      <td className="book-name-cell">
                        {book.bookName}
                      </td>

                      <td>
                        {book.author}
                      </td>

                      <td>
                        <span className="category-badge">
                          {book.category}
                        </span>
                      </td>

                      <td>

                        <span
                          className={
                            Number(book.quantity) > 0
                              ? "quantity-badge available"
                              : "quantity-badge unavailable"
                          }
                        >
                          {book.quantity}
                        </span>

                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() =>
                              editBook(book)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              deleteBook(book.id)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="no-books"
                    >

                      <div className="no-books-icon">
                        📚
                      </div>

                      <strong>
                        No books found
                      </strong>

                      <span>
                        Try a different search
                      </span>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ADD / EDIT BOOK MODAL */}

        <AddBookModal
          isOpen={showModal}
          onClose={closeBookModal}
          bookData={bookData}
          setBookData={setBookData}
          saveBook={
            isEditing
              ? updateBook
              : saveBook
          }
          isEditing={isEditing}
        />

        {/* DELETE MODAL */}

        <DeleteModal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onDelete={confirmDelete}
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

export default Books;