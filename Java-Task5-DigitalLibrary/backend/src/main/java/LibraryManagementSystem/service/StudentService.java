package LibraryManagementSystem.service;

import LibraryManagementSystem.entity.Student;
import LibraryManagementSystem.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // =========================
    // ADD STUDENT
    // =========================

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    // =========================
    // GET ALL STUDENTS
    // =========================

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // =========================
    // GET STUDENT BY ID
    // =========================

    public Student getStudentById(Long id) {

        return studentRepository
                .findById(id)
                .orElse(null);
    }

    // =========================
    // UPDATE STUDENT
    // =========================

    public Student updateStudent(Long id, Student student) {

        Student existing =
                studentRepository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setName(student.getName());
        existing.setEmail(student.getEmail());
        existing.setBranch(student.getBranch());
        existing.setYear(student.getYear());
        existing.setGender(student.getGender());
        existing.setPassword(student.getPassword());

        return studentRepository.save(existing);
    }

    // =========================
    // DELETE STUDENT
    // =========================

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    // =========================
    // LOGIN
    // =========================

    public Student login(String email, String password) {

        Student student =
                studentRepository
                        .findByEmail(email)
                        .orElse(null);

        if (student == null) {
            return null;
        }

        if (!student.getPassword().equals(password)) {
            return null;
        }

        return student;
    }
}