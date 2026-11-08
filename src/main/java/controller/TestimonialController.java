
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

import com.kumarclasses.kumarclasses.entity.Testimonial;
import com.kumarclasses.kumarclasses.service.TestimonialService;

@RestController
@RequestMapping("/api/testimonials")
public class TestimonialController {

    private final TestimonialService service;

    public TestimonialController(TestimonialService service) {
        this.service = service;
    }

    // Add testimonial - Admin
    @PostMapping
    public ResponseEntity<Testimonial> addTestimonial(
            @RequestBody Testimonial testimonial) {

        return ResponseEntity.ok(service.addTestimonial(testimonial));
    }

    // Get all testimonials - Admin
    @GetMapping
    public ResponseEntity<List<Testimonial>> getAllTestimonials() {
        return ResponseEntity.ok(service.getAllTestimonials());
    }

    // Get approved testimonials - Public
    @GetMapping("/public")
    public ResponseEntity<List<Testimonial>> getPublicTestimonials() {
        return ResponseEntity.ok(service.getApprovedTestimonials());
    }

    // Get testimonial by ID - Admin
    @GetMapping("/{id}")
    public ResponseEntity<Testimonial> getTestimonialById(
            @PathVariable Long id) {

        Testimonial testimonial = service.getTestimonialById(id);

        if (testimonial == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(testimonial);
    }

    // Update testimonial - Admin
    @PutMapping("/{id}")
    public ResponseEntity<Testimonial> updateTestimonial(
            @PathVariable Long id,
            @RequestBody Testimonial testimonial) {

        return ResponseEntity.ok(
                service.updateTestimonial(id, testimonial));
    }

    // Approve or reject testimonial - Admin
    @PutMapping("/{id}/approval")
    public ResponseEntity<Testimonial> updateApproval(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request) {

        Boolean approved = request.get("approved");

        if (approved == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                service.updateApproval(id, approved));
    }

    // Delete testimonial - Admin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestimonial(
            @PathVariable Long id) {

        service.deleteTestimonial(id);
        return ResponseEntity.noContent().build();
    }
}
