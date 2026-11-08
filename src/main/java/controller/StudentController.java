
package com.kumarclasses.kumarclasses.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kumarclasses.kumarclasses.entity.Student;
import com.kumarclasses.kumarclasses.service.StudentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    // Add new student
    @PostMapping
    public ResponseEntity<Student> addStudent(
            @Valid @RequestBody Student student) {

        Student savedStudent = service.saveStudent(student);
        return ResponseEntity.ok(savedStudent);
    }

    // Get all students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(service.getAllStudents());
    }

    // Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(
            @PathVariable Long id) {

        Student student = service.getStudentById(id);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(student);
    }

    // Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Long id) {

        service.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // Get total students count
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalStudents() {
        return ResponseEntity.ok(service.getTotalStudents());
    }
}
