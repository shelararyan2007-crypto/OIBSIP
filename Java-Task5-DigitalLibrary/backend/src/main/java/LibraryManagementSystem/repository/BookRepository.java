package LibraryManagementSystem.repository;

import LibraryManagementSystem.entity.Book;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {

}