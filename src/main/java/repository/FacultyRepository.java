package com.kumarclasses.kumarclasses.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kumarclasses.kumarclasses.entity.Faculty;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    // Get only active faculty members
    List<Faculty> findByActiveTrue();

}