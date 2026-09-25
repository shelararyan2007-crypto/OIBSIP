package LibraryManagementSystem.repository;

import LibraryManagementSystem.entity.Issue;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository
        extends JpaRepository<Issue, Long> {

    // =========================
    // STUDENT ISSUE HISTORY
    // =========================

    List<Issue> findByStudentId(
            Long studentId
    );

    // =========================
    // STUDENT + STATUS
    // =========================

    List<Issue> findByStudentIdAndStatus(
            Long studentId,
            String status
    );
}