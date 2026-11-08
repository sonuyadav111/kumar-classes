
package com.kumarclasses.kumarclasses.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kumarclasses.kumarclasses.entity.StudentEnquiry;
import com.kumarclasses.kumarclasses.repository.StudentEnquiryRepository;

@Service
public class StudentEnquiryService {

    private final StudentEnquiryRepository repository;

    public StudentEnquiryService(StudentEnquiryRepository repository) {
        this.repository = repository;
    }

    // Save new enquiry with business validation
    public StudentEnquiry saveEnquiry(StudentEnquiry enquiry) {

        Integer studentClass = enquiry.getStudentClass();
        String subject = enquiry.getSubject();

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

        return repository.save(enquiry);
    }

    // Get all enquiries
    public List<StudentEnquiry> getAllEnquiries() {
        return repository.findAll();
    }

    // Get enquiry by ID
    public StudentEnquiry getEnquiryById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Delete enquiry
    public void deleteEnquiry(Long id) {
        repository.deleteById(id);
    }
}
