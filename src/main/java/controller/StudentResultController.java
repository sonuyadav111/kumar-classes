
package com.kumarclasses.kumarclasses.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kumarclasses.kumarclasses.entity.StudentResult;
import com.kumarclasses.kumarclasses.service.StudentResultService;

@RestController
@RequestMapping("/api/results")
public class StudentResultController {

    private final StudentResultService service;

    public StudentResultController(StudentResultService service) {
        this.service = service;
    }

    // Add result - Admin
    @PostMapping
    public ResponseEntity<StudentResult> addResult(
            @RequestBody StudentResult result) {

        return ResponseEntity.ok(service.addResult(result));
    }

    // Get all results - Admin
    @GetMapping
    public ResponseEntity<List<StudentResult>> getAllResults() {
        return ResponseEntity.ok(service.getAllResults());
    }

    // Get approved results - Public
    @GetMapping("/public")
    public ResponseEntity<List<StudentResult>> getPublicResults() {
        return ResponseEntity.ok(service.getApprovedResults());
    }

    // Get result by ID - Admin
    @GetMapping("/{id}")
    public ResponseEntity<StudentResult> getResultById(
            @PathVariable Long id) {

        StudentResult result = service.getResultById(id);

        if (result == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(result);
    }

    // Update result - Admin
    @PutMapping("/{id}")
    public ResponseEntity<StudentResult> updateResult(
            @PathVariable Long id,
            @RequestBody StudentResult result) {

        return ResponseEntity.ok(service.updateResult(id, result));
    }

    // Approve or reject result - Admin
    @PutMapping("/{id}/approval")
    public ResponseEntity<StudentResult> updateApproval(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request) {

        Boolean approved = request.get("approved");

        if (approved == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                service.updateApproval(id, approved));
    }

    // Delete result - Admin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(
            @PathVariable Long id) {

        service.deleteResult(id);
        return ResponseEntity.noContent().build();
    }
}
