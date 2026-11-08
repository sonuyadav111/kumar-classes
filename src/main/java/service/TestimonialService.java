
package com.kumarclasses.kumarclasses.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kumarclasses.kumarclasses.entity.Testimonial;
import com.kumarclasses.kumarclasses.repository.TestimonialRepository;

@Service
public class TestimonialService {

    private final TestimonialRepository repository;

    public TestimonialService(TestimonialRepository repository) {
        this.repository = repository;
    }

    // Add testimonial
    public Testimonial addTestimonial(Testimonial testimonial) {
        validateTestimonial(testimonial);
        testimonial.setId(null);
        testimonial.setApproved(false);
        return repository.save(testimonial);
    }

    // Get all testimonials for admin
    public List<Testimonial> getAllTestimonials() {
        return repository.findAll();
    }

    // Get approved testimonials for public website
    public List<Testimonial> getApprovedTestimonials() {
        return repository.findByApprovedTrueOrderByCreatedAtDesc();
    }

    // Get testimonial by ID
    public Testimonial getTestimonialById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Update testimonial
    public Testimonial updateTestimonial(Long id, Testimonial updated) {
        validateTestimonial(updated);

        Testimonial existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Testimonial not found"));

        existing.setStudentName(updated.getStudentName());
        existing.setStudentClass(updated.getStudentClass());
        existing.setFeedback(updated.getFeedback());

        return repository.save(existing);
    }

    // Approve or reject testimonial
    public Testimonial updateApproval(Long id, boolean approved) {
        Testimonial testimonial = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Testimonial not found"));

        testimonial.setApproved(approved);
        return repository.save(testimonial);
    }

    // Delete testimonial
    public void deleteTestimonial(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Testimonial not found");
        }
        repository.deleteById(id);
    }

    private void validateTestimonial(Testimonial testimonial) {
        if (testimonial.getStudentName() == null
                || testimonial.getStudentName().isBlank()) {
            throw new IllegalArgumentException("Student name is required.");
        }

        if (testimonial.getStudentClass() == null
                || testimonial.getStudentClass() < 1
                || testimonial.getStudentClass() > 12) {
            throw new IllegalArgumentException("Class must be between 1 and 12.");
        }

        if (testimonial.getFeedback() == null
                || testimonial.getFeedback().isBlank()
                || testimonial.getFeedback().length() > 1000) {
            throw new IllegalArgumentException("Feedback is required (maximum 1000 characters).");
        }
    }
}
