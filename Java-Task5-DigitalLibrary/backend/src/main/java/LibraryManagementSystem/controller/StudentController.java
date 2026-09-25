package LibraryManagementSystem.controller;

import LibraryManagementSystem.entity.Student;
import LibraryManagementSystem.repository.StudentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentRepository studentRepository;

    // =========================
    // CONSTRUCTOR
    // =========================

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // =========================
    // GET ALL STUDENTS
    // =========================

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // =========================
    // GET STUDENT BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(
            @PathVariable Long id) {

        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // REGISTER NEW STUDENT
    // =========================

    @PostMapping
    public ResponseEntity<?> registerStudent(
            @RequestBody Student student) {

        try {

            // -------------------------
            // VALIDATION
            // -------------------------

            if (student.getId() == null) {
                return ResponseEntity
                        .badRequest()
                        .body("Student ID is required");
            }

            if (student.getName() == null ||
                    student.getName().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Name is required");
            }

            if (student.getEmail() == null ||
                    student.getEmail().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Email is required");
            }

            if (student.getBranch() == null ||
                    student.getBranch().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Branch is required");
            }

            if (student.getYear() == null ||
                    student.getYear().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Year is required");
            }

            if (student.getGender() == null ||
                    student.getGender().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Gender is required");
            }

            if (student.getPassword() == null ||
                    student.getPassword().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Password is required");
            }

            if (student.getPassword().length() < 6) {

                return ResponseEntity
                        .badRequest()
                        .body("Password must be at least 6 characters");
            }

            // -------------------------
            // CLEAN DATA
            // -------------------------

            student.setName(
                    student.getName().trim()
            );

            student.setEmail(
                    student.getEmail()
                            .trim()
                            .toLowerCase()
            );

            student.setBranch(
                    student.getBranch().trim()
            );

            student.setYear(
                    student.getYear().trim()
            );

            student.setGender(
                    student.getGender().trim()
            );

            // -------------------------
            // CHECK STUDENT ID
            // -------------------------

            if (studentRepository.existsById(student.getId())) {

                return ResponseEntity
                        .status(409)
                        .body("Student ID already exists");
            }

            // -------------------------
            // CHECK EMAIL
            // -------------------------

            if (studentRepository.existsByEmail(
                    student.getEmail())) {

                return ResponseEntity
                        .status(409)
                        .body("Email already exists");
            }

            // -------------------------
            // SAVE STUDENT
            // -------------------------

            Student savedStudent =
                    studentRepository.save(student);

            return ResponseEntity
                    .status(201)
                    .body(savedStudent);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Registration failed");
        }
    }

    // =========================
    // STUDENT LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Student request) {

        String email = request.getEmail();
        String password = request.getPassword();

        if (email == null || password == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Email and password are required");
        }

        Student student = studentRepository
                .findByEmail(
                        email.trim().toLowerCase()
                )
                .orElse(null);

        if (student == null) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        if (!student.getPassword().equals(password)) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        return ResponseEntity.ok(student);
    }

    // =========================
    // UPDATE STUDENT
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(
            @PathVariable Long id,
            @RequestBody Student request) {

        try {

            // -------------------------
            // FIND STUDENT
            // -------------------------

            Student student = studentRepository
                    .findById(id)
                    .orElse(null);

            if (student == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            // -------------------------
            // VALIDATE NAME
            // -------------------------

            if (request.getName() == null ||
                    request.getName().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Name is required");
            }

            // -------------------------
            // VALIDATE EMAIL
            // -------------------------

            if (request.getEmail() == null ||
                    request.getEmail().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Email is required");
            }

            // -------------------------
            // VALIDATE BRANCH
            // -------------------------

            if (request.getBranch() == null ||
                    request.getBranch().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Branch is required");
            }

            // -------------------------
            // VALIDATE YEAR
            // -------------------------

            if (request.getYear() == null ||
                    request.getYear().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Year is required");
            }

            // -------------------------
            // CLEAN DATA
            // -------------------------

            String name =
                    request.getName().trim();

            String email =
                    request.getEmail()
                            .trim()
                            .toLowerCase();

            String branch =
                    request.getBranch().trim();

            String year =
                    request.getYear().trim();

            // -------------------------
            // CHECK DUPLICATE EMAIL
            // -------------------------

            Student existingStudent =
                    studentRepository
                            .findByEmail(email)
                            .orElse(null);

            if (existingStudent != null &&
                    !existingStudent.getId().equals(id)) {

                return ResponseEntity
                        .status(409)
                        .body("Email already exists");
            }

            // -------------------------
            // UPDATE DETAILS
            // -------------------------

            student.setName(name);
            student.setEmail(email);
            student.setBranch(branch);
            student.setYear(year);

            // -------------------------
            // UPDATE GENDER IF PROVIDED
            // -------------------------

            if (request.getGender() != null &&
                    !request.getGender().trim().isEmpty()) {

                student.setGender(
                        request.getGender().trim()
                );
            }

            // -------------------------
            // DO NOT CHANGE PASSWORD
            // -------------------------
            // Password has its own endpoint:
            // PUT /api/students/{id}/password

            // -------------------------
            // SAVE
            // -------------------------

            Student updatedStudent =
                    studentRepository.save(student);

            return ResponseEntity.ok(updatedStudent);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to update student in database"
                    );
        }
    }

    // =========================
    // UPDATE EMAIL
    // =========================

    @PutMapping("/{id}/email")
    public ResponseEntity<?> updateEmail(
            @PathVariable Long id,
            @RequestBody Student request) {

        try {

            Student student = studentRepository
                    .findById(id)
                    .orElse(null);

            if (student == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            String email = request.getEmail();

            if (email == null ||
                    email.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Email cannot be empty");
            }

            email = email.trim().toLowerCase();

            // -------------------------
            // CHECK DUPLICATE EMAIL
            // -------------------------

            Student existingStudent =
                    studentRepository
                            .findByEmail(email)
                            .orElse(null);

            if (existingStudent != null &&
                    !existingStudent.getId().equals(id)) {

                return ResponseEntity
                        .status(409)
                        .body("Email already exists");
            }

            student.setEmail(email);

            Student updatedStudent =
                    studentRepository.save(student);

            return ResponseEntity.ok(updatedStudent);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to update email");
        }
    }

    // =========================
    // UPDATE PASSWORD
    // =========================

    @PutMapping("/{id}/password")
    public ResponseEntity<?> updatePassword(
            @PathVariable Long id,
            @RequestBody Student request) {

        try {

            Student student = studentRepository
                    .findById(id)
                    .orElse(null);

            if (student == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            String password = request.getPassword();

            if (password == null ||
                    password.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Password cannot be empty");
            }

            if (password.length() < 6) {

                return ResponseEntity
                        .badRequest()
                        .body("Password must be at least 6 characters");
            }

            student.setPassword(password);

            Student updatedStudent =
                    studentRepository.save(student);

            return ResponseEntity.ok(updatedStudent);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to update password");
        }
    }
}