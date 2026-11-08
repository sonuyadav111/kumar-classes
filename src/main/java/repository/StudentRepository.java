
package com.kumarclasses.kumarclasses.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kumarclasses.kumarclasses.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
}
