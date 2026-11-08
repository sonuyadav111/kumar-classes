
package com.kumarclasses.kumarclasses.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kumarclasses.kumarclasses.entity.Course;
import com.kumarclasses.kumarclasses.service.CourseService;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    // ADD COURSE
    @PostMapping
    public ResponseEntity<Course> addCourse(@RequestBody Course course) {
        Course savedCourse = service.addCourse(course);
        return ResponseEntity.ok(savedCourse);
    }

    // GET ALL COURSES (ADMIN)
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(service.getAllCourses());
    }

    // PUBLIC WEBSITE - GET ACTIVE COURSES
    @GetMapping("/public")
    public ResponseEntity<List<Course>> getActiveCourses() {
        return ResponseEntity.ok(service.getActiveCourses());
    }

    // GET COURSE BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {

        Course course = service.getCourseById(id);

        if (course == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(course);
    }

    // UPDATE COURSE
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @RequestBody Course course) {

        return ResponseEntity.ok(service.updateCourse(id, course));
    }

    // DELETE COURSE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {

        service.deleteCourse(id);

        return ResponseEntity.noContent().build();
    }
}
