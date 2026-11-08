
package com.kumarclasses.kumarclasses.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kumarclasses.kumarclasses.entity.StudentEnquiry;
import com.kumarclasses.kumarclasses.service.StudentEnquiryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = "*")
public class StudentEnquiryController {

    private final StudentEnquiryService service;

    private static final Set<String> VALID_STATUSES =
            Set.of("New", "Contacted", "Admitted", "Rejected");

    public StudentEnquiryController(StudentEnquiryService service) {
        this.service = service;
    }

    // Submit new enquiry
    @PostMapping
    public ResponseEntity<StudentEnquiry> createEnquiry(
            @Valid @RequestBody StudentEnquiry enquiry) {

        StudentEnquiry savedEnquiry =
                service.saveEnquiry(enquiry);

        return ResponseEntity.ok(savedEnquiry);
    }

    // Get all enquiries
    @GetMapping
    public ResponseEntity<List<StudentEnquiry>> getAllEnquiries() {
        return ResponseEntity.ok(service.getAllEnquiries());
    }

    // Get enquiry by ID
    @GetMapping("/{id}")
    public ResponseEntity<StudentEnquiry> getEnquiryById(
            @PathVariable Long id) {

        StudentEnquiry enquiry = service.getEnquiryById(id);

        if (enquiry == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(enquiry);
    }

    // Update enquiry status only
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEnquiryStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        StudentEnquiry existingEnquiry =
                service.getEnquiryById(id);

        if (existingEnquiry == null) {
            return ResponseEntity.notFound().build();
        }

        String status = request.get("status");

        if (status == null || !VALID_STATUSES.contains(status)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid enquiry status"));
        }

        existingEnquiry.setStatus(status);

        StudentEnquiry savedEnquiry =
                service.saveEnquiry(existingEnquiry);

        return ResponseEntity.ok(savedEnquiry);
    }

    // Delete enquiry
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnquiry(
            @PathVariable Long id) {

        service.deleteEnquiry(id);

        return ResponseEntity.noContent().build();
    }
}
