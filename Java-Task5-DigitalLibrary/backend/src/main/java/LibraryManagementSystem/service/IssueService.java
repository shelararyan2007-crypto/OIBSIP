package LibraryManagementSystem.service;

import LibraryManagementSystem.entity.Book;
import LibraryManagementSystem.entity.Issue;
import LibraryManagementSystem.entity.Student;

import LibraryManagementSystem.repository.BookRepository;
import LibraryManagementSystem.repository.IssueRepository;
import LibraryManagementSystem.repository.StudentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final BookRepository bookRepository;
    private final StudentRepository studentRepository;

    // =========================
    // CONSTRUCTOR
    // =========================

    public IssueService(
            IssueRepository issueRepository,
            BookRepository bookRepository,
            StudentRepository studentRepository
    ) {
        this.issueRepository = issueRepository;
        this.bookRepository = bookRepository;
        this.studentRepository = studentRepository;
    }

    // =====================================================
    // ISSUE BOOK
    // =====================================================

    @Transactional
    public Issue issueBook(Issue issue) {

        // -----------------------------------------------
        // CHECK BOOK ID
        // -----------------------------------------------

        if (issue.getBookId() == null) {
            throw new RuntimeException(
                    "Book ID is required"
            );
        }

        // -----------------------------------------------
        // CHECK STUDENT ID
        // -----------------------------------------------

        if (issue.getStudentId() == null) {
            throw new RuntimeException(
                    "Student ID is required"
            );
        }

        // -----------------------------------------------
        // FIND BOOK
        // -----------------------------------------------

        Book book = bookRepository
                .findById(issue.getBookId())
                .orElse(null);

        if (book == null) {
            throw new RuntimeException(
                    "Book not found"
            );
        }

        // -----------------------------------------------
        // FIND STUDENT
        // -----------------------------------------------

        Student student = studentRepository
                .findById(issue.getStudentId())
                .orElse(null);

        if (student == null) {
            throw new RuntimeException(
                    "Student not found"
            );
        }

        // -----------------------------------------------
        // CHECK BOOK QUANTITY
        // -----------------------------------------------

        if (book.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Book is currently unavailable"
            );
        }

        // -----------------------------------------------
        // CHECK DUPLICATE ISSUE
        // -----------------------------------------------

        List<Issue> studentIssues =
                issueRepository.findByStudentIdAndStatus(
                        issue.getStudentId(),
                        "Issued"
                );

        boolean alreadyIssued =
                studentIssues.stream()
                        .anyMatch(existingIssue ->
                                existingIssue
                                        .getBookId()
                                        .equals(
                                                issue.getBookId()
                                        )
                        );

        if (alreadyIssued) {
            throw new RuntimeException(
                    "This book is already issued to this student"
            );
        }

        // -----------------------------------------------
        // SET BOOK NAME
        // -----------------------------------------------

        issue.setBookName(
                book.getBookName()
        );

        // -----------------------------------------------
        // SET STUDENT NAME
        // -----------------------------------------------

        issue.setStudentName(
                student.getName()
        );

        // -----------------------------------------------
        // SET STATUS
        // -----------------------------------------------

        issue.setStatus("Issued");

        // -----------------------------------------------
        // SET ISSUE DATE
        // -----------------------------------------------

        if (issue.getIssueDate() == null) {

            issue.setIssueDate(
                    LocalDate.now()
            );
        }

        // -----------------------------------------------
        // CHECK RETURN DATE
        // -----------------------------------------------

        if (issue.getReturnDate() == null) {

            throw new RuntimeException(
                    "Return date is required"
            );
        }

        // -----------------------------------------------
        // CHECK DATE ORDER
        // -----------------------------------------------

        if (issue.getReturnDate()
                .isBefore(issue.getIssueDate())) {

            throw new RuntimeException(
                    "Return date cannot be before issue date"
            );
        }

        // -----------------------------------------------
        // NO ACTUAL RETURN YET
        // -----------------------------------------------

        issue.setActualReturnDate(null);

        // -----------------------------------------------
        // DECREASE BOOK QUANTITY
        // -----------------------------------------------

        book.setQuantity(
                book.getQuantity() - 1
        );

        bookRepository.save(book);

        // -----------------------------------------------
        // SAVE ISSUE
        // -----------------------------------------------

        return issueRepository.save(issue);
    }

    // =====================================================
    // GET ALL ISSUES
    // =====================================================

    public List<Issue> getAllIssues() {

        return issueRepository.findAll();
    }

    // =====================================================
    // GET ISSUE BY ID
    // =====================================================

    public Issue getIssueById(Long id) {

        return issueRepository
                .findById(id)
                .orElse(null);
    }

    // =====================================================
    // GET STUDENT ISSUES
    // =====================================================

    public List<Issue> getStudentIssues(
            Long studentId
    ) {

        return issueRepository
                .findByStudentId(studentId);
    }

    // =====================================================
    // GET CURRENTLY ISSUED BOOKS
    // =====================================================

    public List<Issue> getIssuedBooks(
            Long studentId
    ) {

        return issueRepository
                .findByStudentIdAndStatus(
                        studentId,
                        "Issued"
                );
    }

    // =====================================================
    // GET RETURNED BOOKS
    // =====================================================

    public List<Issue> getReturnedBooks(
            Long studentId
    ) {

        return issueRepository
                .findByStudentIdAndStatus(
                        studentId,
                        "Returned"
                );
    }

    // =====================================================
    // RETURN BOOK
    // =====================================================

    @Transactional
    public Issue returnBook(Long id) {

        // -----------------------------------------------
        // FIND ISSUE
        // -----------------------------------------------

        Issue issue = issueRepository
                .findById(id)
                .orElse(null);

        if (issue == null) {
            throw new RuntimeException(
                    "Issue record not found"
            );
        }

        // -----------------------------------------------
        // CHECK ALREADY RETURNED
        // -----------------------------------------------

        if ("Returned".equalsIgnoreCase(
                issue.getStatus()
        )) {

            throw new RuntimeException(
                    "Book has already been returned"
            );
        }

        // -----------------------------------------------
        // FIND BOOK
        // -----------------------------------------------

        Book book = bookRepository
                .findById(
                        issue.getBookId()
                )
                .orElse(null);

        if (book == null) {

            throw new RuntimeException(
                    "Book not found"
            );
        }

        // -----------------------------------------------
        // INCREASE BOOK QUANTITY
        // -----------------------------------------------

        book.setQuantity(
                book.getQuantity() + 1
        );

        bookRepository.save(book);

        // -----------------------------------------------
        // UPDATE STATUS
        // -----------------------------------------------

        issue.setStatus("Returned");

        // -----------------------------------------------
        // SET ACTUAL RETURN DATE
        // -----------------------------------------------

        issue.setActualReturnDate(
                LocalDate.now()
        );

        // -----------------------------------------------
        // SAVE ISSUE
        // -----------------------------------------------

        return issueRepository.save(issue);
    }

    // =====================================================
    // DELETE ISSUE
    // =====================================================

    public void deleteIssue(Long id) {

        if (!issueRepository.existsById(id)) {

            throw new RuntimeException(
                    "Issue record not found"
            );
        }

        issueRepository.deleteById(id);
    }
}