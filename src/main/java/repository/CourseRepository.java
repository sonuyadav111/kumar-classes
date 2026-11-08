
package com.kumarclasses.kumarclasses.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kumarclasses.kumarclasses.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // Fetch only active courses for public website
    List<Course> findByActiveTrue();

}
