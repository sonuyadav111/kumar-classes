
package com.kumarclasses.kumarclasses.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kumarclasses.kumarclasses.entity.StudentResult;
import com.kumarclasses.kumarclasses.repository.StudentResultRepository;

@Service
public class StudentResultService {

    private final StudentResultRepository repository;

    public StudentResultService(StudentResultRepository repository) {
        this.repository = repository;
    }

    // Add result
    public StudentResult addResult(StudentResult result) {
        validateResult(result);

        result.setId(null);
        result.setApproved(false);
        result.setGrade(calculateGrade(result.getObtainedMarks(),
                result.getTotalMarks()));

        return repository.save(result);
    }

    // Get all results for admin
    public List<StudentResult> getAllResults() {
        return repository.findAll();
    }

    // Get approved results for public website
    public List<StudentResult> getApprovedResults() {
        return repository.findByApprovedTrueOrderByCreatedAtDesc();
    }

    // Get result by ID
    public StudentResult getResultById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update result
    public StudentResult updateResult(Long id, StudentResult updated) {
        validateResult(updated);

        StudentResult existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Result not found"));

        existing.setStudentName(updated.getStudentName());
        existing.setStudentClass(updated.getStudentClass());
        existing.setExamName(updated.getExamName());
        existing.setTotalMarks(updated.getTotalMarks());
        existing.setObtainedMarks(updated.getObtainedMarks());
        existing.setAcademicYear(updated.getAcademicYear());

        existing.setGrade(calculateGrade(
                updated.getObtainedMarks(), updated.getTotalMarks()));

        return repository.save(existing);
    }

    // Approve or reject result
    public StudentResult updateApproval(Long id, boolean approved) {
        StudentResult result = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Result not found"));

        result.setApproved(approved);
        return repository.save(result);
    }

    // Delete result
    public void deleteResult(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Result not found");
        }
        repository.deleteById(id);
    }

    private void validateResult(StudentResult result) {
        if (result.getStudentName() == null
                || result.getStudentName().isBlank()) {
            throw new IllegalArgumentException("Student name is required.");
        }

        if (result.getStudentClass() == null
                || result.getStudentClass() < 1
                || result.getStudentClass() > 12) {
            throw new IllegalArgumentException("Class must be between 1 and 12.");
        }

        if (result.getExamName() == null
                || result.getExamName().isBlank()) {
            throw new IllegalArgumentException("Exam name is required.");
        }

        if (result.getTotalMarks() == null || result.getTotalMarks() <= 0) {
            throw new IllegalArgumentException("Total marks must be greater than zero.");
        }

        if (result.getObtainedMarks() == null
                || result.getObtainedMarks() < 0
                || result.getObtainedMarks() > result.getTotalMarks()) {
            throw new IllegalArgumentException("Obtained marks must be between 0 and total marks.");
        }
    }

    private String calculateGrade(int obtainedMarks, int totalMarks) {
        double percentage = (obtainedMarks * 100.0) / totalMarks;

        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        return "F";
    }
}
