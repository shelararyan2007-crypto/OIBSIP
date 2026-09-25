package LibraryManagementSystem.controller;

import LibraryManagementSystem.entity.Book;
import LibraryManagementSystem.entity.Issue;
import LibraryManagementSystem.entity.Student;

import LibraryManagementSystem.repository.BookRepository;
import LibraryManagementSystem.repository.IssueRepository;
import LibraryManagementSystem.repository.StudentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "http://localhost:5173")
public class IssueController {

    private final IssueRepository issueRepository;
    private final BookRepository bookRepository;
    private final StudentRepository studentRepository;

    // =========================
    // CONSTRUCTOR
    // =========================

    public IssueController(
            IssueRepository issueRepository,
            BookRepository bookRepository,
            StudentRepository studentRepository
    ) {
        this.issueRepository = issueRepository;
        this.bookRepository = bookRepository;
        this.studentRepository = studentRepository;
    }

    // =====================================================
    // GET ALL ISSUES
    // =====================================================

    @GetMapping
    public List<Issue> getAllIssues() {

        return issueRepository.findAll();
    }

    // =====================================================
    // GET ISSUE BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Issue> getIssueById(
            @PathVariable Long id
    ) {

        return issueRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =====================================================
    // GET STUDENT HISTORY
    // =====================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Issue>> getStudentHistory(
            @PathVariable Long studentId
    ) {

        List<Issue> history =
                issueRepository.findByStudentId(studentId);

        return ResponseEntity.ok(history);
    }

    // =====================================================
    // GET CURRENTLY ISSUED BOOKS
    // =====================================================

    @GetMapping("/student/{studentId}/issued")
    public ResponseEntity<List<Issue>> getIssuedBooks(
            @PathVariable Long studentId
    ) {

        List<Issue> issues =
                issueRepository.findByStudentIdAndStatus(
                        studentId,
                        "Issued"
                );

        return ResponseEntity.ok(issues);
    }

    // =====================================================
    // GET RETURNED BOOKS
    // =====================================================

    @GetMapping("/student/{studentId}/returned")
    public ResponseEntity<List<Issue>> getReturnedBooks(
            @PathVariable Long studentId
    ) {

        List<Issue> issues =
                issueRepository.findByStudentIdAndStatus(
                        studentId,
                        "Returned"
                );

        return ResponseEntity.ok(issues);
    }

    // =====================================================
    // GET STUDENT NOTIFICATIONS
    // =====================================================

    @GetMapping("/student/{studentId}/notifications")
    public ResponseEntity<List<Issue>> getStudentNotifications(
            @PathVariable Long studentId
    ) {

        List<Issue> notifications =
                issueRepository.findByStudentId(studentId);

        return ResponseEntity.ok(notifications);
    }

    // =====================================================
    // ISSUE BOOK
    // =====================================================

    @PostMapping
    @Transactional
    public ResponseEntity<?> issueBook(
            @RequestBody Issue issue
    ) {

        // -----------------------------------------------
        // CHECK BOOK ID
        // -----------------------------------------------

        if (issue.getBookId() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Book ID is required");
        }

        // -----------------------------------------------
        // CHECK STUDENT ID
        // -----------------------------------------------

        if (issue.getStudentId() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Student ID is required");
        }

        // -----------------------------------------------
        // CHECK ISSUE DATE
        // -----------------------------------------------

        if (issue.getIssueDate() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Issue date is required");
        }

        // -----------------------------------------------
        // CHECK RETURN DATE
        // -----------------------------------------------

        if (issue.getReturnDate() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Return date is required");
        }

        // -----------------------------------------------
        // CHECK DATE ORDER
        // -----------------------------------------------

        if (issue.getReturnDate()
                .isBefore(issue.getIssueDate())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Return date cannot be before issue date"
                    );
        }

        // -----------------------------------------------
        // FIND BOOK
        // -----------------------------------------------

        Book book = bookRepository
                .findById(issue.getBookId())
                .orElse(null);

        if (book == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Book not found");
        }

        // -----------------------------------------------
        // FIND STUDENT
        // -----------------------------------------------

        Student student = studentRepository
                .findById(issue.getStudentId())
                .orElse(null);

        if (student == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Student not found");
        }

        // -----------------------------------------------
        // CHECK AVAILABLE QUANTITY
        // -----------------------------------------------

        if (book.getQuantity() <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body(
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
                                existingIssue.getBookId() != null
                                        && existingIssue
                                                .getBookId()
                                                .equals(
                                                        issue.getBookId()
                                                )
                        );

        if (alreadyIssued) {

            return ResponseEntity
                    .badRequest()
                    .body(
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

        Issue savedIssue =
                issueRepository.save(issue);

        return ResponseEntity.ok(savedIssue);
    }

    // =====================================================
    // UPDATE ISSUE
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateIssue(
            @PathVariable Long id,
            @RequestBody Issue request
    ) {

        Issue issue = issueRepository
                .findById(id)
                .orElse(null);

        if (issue == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        // -----------------------------------------------
        // BOOK ID
        // -----------------------------------------------

        if (request.getBookId() != null) {

            issue.setBookId(
                    request.getBookId()
            );

            Book book = bookRepository
                    .findById(
                            request.getBookId()
                    )
                    .orElse(null);

            if (book != null) {

                issue.setBookName(
                        book.getBookName()
                );
            }
        }

        // -----------------------------------------------
        // BOOK NAME
        // -----------------------------------------------

        if (request.getBookName() != null &&
                !request.getBookName()
                        .trim()
                        .isEmpty()) {

            issue.setBookName(
                    request.getBookName()
                            .trim()
            );
        }

        // -----------------------------------------------
        // STUDENT ID
        // -----------------------------------------------

        if (request.getStudentId() != null) {

            issue.setStudentId(
                    request.getStudentId()
            );

            Student student =
                    studentRepository
                            .findById(
                                    request.getStudentId()
                            )
                            .orElse(null);

            if (student != null) {

                issue.setStudentName(
                        student.getName()
                );
            }
        }

        // -----------------------------------------------
        // STUDENT NAME
        // -----------------------------------------------

        if (request.getStudentName() != null &&
                !request.getStudentName()
                        .trim()
                        .isEmpty()) {

            issue.setStudentName(
                    request.getStudentName()
                            .trim()
            );
        }

        // -----------------------------------------------
        // ISSUE DATE
        // -----------------------------------------------

        if (request.getIssueDate() != null) {

            issue.setIssueDate(
                    request.getIssueDate()
            );
        }

        // -----------------------------------------------
        // RETURN DATE
        // -----------------------------------------------

        if (request.getReturnDate() != null) {

            issue.setReturnDate(
                    request.getReturnDate()
            );
        }

        // -----------------------------------------------
        // CHECK DATE ORDER
        // -----------------------------------------------

        if (issue.getIssueDate() != null &&
                issue.getReturnDate() != null &&
                issue.getReturnDate()
                        .isBefore(
                                issue.getIssueDate()
                        )) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Return date cannot be before issue date"
                    );
        }

        // -----------------------------------------------
        // ACTUAL RETURN DATE
        // -----------------------------------------------

        if (request.getActualReturnDate() != null) {

            issue.setActualReturnDate(
                    request.getActualReturnDate()
            );
        }

        // -----------------------------------------------
        // STATUS
        // -----------------------------------------------

        if (request.getStatus() != null &&
                !request.getStatus()
                        .trim()
                        .isEmpty()) {

            issue.setStatus(
                    request.getStatus()
            );
        }

        // -----------------------------------------------
        // SAVE
        // -----------------------------------------------

        Issue updatedIssue =
                issueRepository.save(issue);

        return ResponseEntity.ok(
                updatedIssue
        );
    }

    // =====================================================
    // RETURN BOOK
    // =====================================================

    @PutMapping("/{id}/return")
    @Transactional
    public ResponseEntity<?> returnBook(
            @PathVariable Long id
    ) {

        // -----------------------------------------------
        // FIND ISSUE
        // -----------------------------------------------

        Issue issue = issueRepository
                .findById(id)
                .orElse(null);

        if (issue == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        // -----------------------------------------------
        // CHECK ALREADY RETURNED
        // -----------------------------------------------

        if ("Returned".equalsIgnoreCase(
                issue.getStatus()
        )) {

            return ResponseEntity
                    .badRequest()
                    .body(
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

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Book not found"
                    );
        }

        // -----------------------------------------------
        // FIND STUDENT
        // -----------------------------------------------

        Student student = studentRepository
                .findById(
                        issue.getStudentId()
                )
                .orElse(null);

        if (student == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Student not found"
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
        // UPDATE ISSUE STATUS
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

        Issue updatedIssue =
                issueRepository.save(issue);

        return ResponseEntity.ok(
                updatedIssue
        );
    }

    // =====================================================
    // DELETE ISSUE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(
            @PathVariable Long id
    ) {

        if (!issueRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        issueRepository.deleteById(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}