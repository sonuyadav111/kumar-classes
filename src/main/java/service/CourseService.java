
package com.kumarclasses.kumarclasses.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kumarclasses.kumarclasses.entity.Course;
import com.kumarclasses.kumarclasses.repository.CourseRepository;

@Service
public class CourseService {

    private final CourseRepository repository;

    public CourseService(CourseRepository repository) {
        this.repository = repository;
    }

    // ADD COURSE
    public Course addCourse(Course course) {

        validateCourse(course);

        return repository.save(course);
    }

    // GET ALL COURSES (ADMIN)
    public List<Course> getAllCourses() {
        return repository.findAll();
    }

    // GET ACTIVE COURSES (PUBLIC WEBSITE)
    public List<Course> getActiveCourses() {
        return repository.findByActiveTrue();
    }

    // GET COURSE BY ID
    public Course getCourseById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // UPDATE COURSE
    public Course updateCourse(Long id, Course updatedCourse) {

        Course existingCourse = repository.findById(id)
                .orElseThrow(() ->
                    new IllegalArgumentException("Course not found")
                );

        validateCourse(updatedCourse);

        existingCourse.setCourseName(updatedCourse.getCourseName());
        existingCourse.setStartClass(updatedCourse.getStartClass());
        existingCourse.setEndClass(updatedCourse.getEndClass());
        existingCourse.setSubject(updatedCourse.getSubject());
        existingCourse.setDescription(updatedCourse.getDescription());
        existingCourse.setActive(updatedCourse.isActive());

        return repository.save(existingCourse);
    }

    // DELETE COURSE
    public void deleteCourse(Long id) {

        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Course not found");
        }

        repository.deleteById(id);
    }

    // COURSE VALIDATION
    private void validateCourse(Course course) {

        Integer startClass = course.getStartClass();
        Integer endClass = course.getEndClass();
        String subject = course.getSubject();

        if (course.getCourseName() == null ||
                course.getCourseName().isBlank()) {
            throw new IllegalArgumentException("Course name is required");
        }

        if (startClass == null || endClass == null || subject == null ||
                subject.isBlank()) {
            throw new IllegalArgumentException(
                "All course details are required"
            );
        }

        if (startClass < 1 || endClass > 12 || startClass > endClass) {
            throw new IllegalArgumentException(
                "Please select a valid class range"
            );
        }

        if (startClass >= 1 && endClass <= 8) {

            if (!subject.equalsIgnoreCase("All Subjects")) {
                throw new IllegalArgumentException(
                    "Classes 1 to 8 offer All Subjects only"
                );
            }

        } else if (startClass >= 9 && endClass <= 12) {

            if (!subject.equalsIgnoreCase("Chemistry")) {
                throw new IllegalArgumentException(
                    "Classes 9 to 12 offer Chemistry only"
                );
            }

        } else {

            throw new IllegalArgumentException(
                "Course cannot combine Classes 1-8 and 9-12"
            );
        }
    }
}
