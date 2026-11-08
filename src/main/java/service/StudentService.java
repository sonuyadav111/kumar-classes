
package com.kumarclasses.kumarclasses.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kumarclasses.kumarclasses.entity.Student;
import com.kumarclasses.kumarclasses.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    // Add new student
    public Student saveStudent(Student student) {
        Integer studentClass = student.getStudentClass();
        String subject = student.getSubject();

        if (studentClass == null || subject == null) {
            throw new IllegalArgumentException(
                "Class and subject are required"
            );
        }

        if (studentClass >= 1 && studentClass <= 8) {
            if (!subject.equalsIgnoreCase("All Subjects")) {
                throw new IllegalArgumentException(
                    "Classes 1 to 8 offer All Subjects only"
                );
            }
        } else if (studentClass >= 9 && studentClass <= 12) {
            if (!subject.equalsIgnoreCase("Chemistry")) {
                throw new IllegalArgumentException(
                    "Classes 9 to 12 offer Chemistry only"
                );
            }
        } else {
            throw new IllegalArgumentException(
                "Please select a valid class between 1 and 12"
            );
        }

        return repository.save(student);
    }

    // Get all students
    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    // Get student by ID
    public Student getStudentById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Delete student
    public void deleteStudent(Long id) {
        repository.deleteById(id);
    }

    // Count total students
    public long getTotalStudents() {
        return repository.count();
    }
}
