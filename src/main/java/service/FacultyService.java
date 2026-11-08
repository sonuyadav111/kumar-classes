package com.kumarclasses.kumarclasses.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kumarclasses.kumarclasses.entity.Faculty;
import com.kumarclasses.kumarclasses.repository.FacultyRepository;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    public Faculty addFaculty(Faculty faculty) {
        validateFaculty(faculty);
        return facultyRepository.save(faculty);
    }

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    // Get only active faculty
    public List<Faculty> getActiveFaculty() {
        return facultyRepository.findByActiveTrue();
    }

    public Faculty getFacultyById(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() ->
                    new IllegalArgumentException(
                        "Faculty not found with ID: " + id
                    ));
    }

    public Faculty updateFaculty(Long id, Faculty updatedFaculty) {

        Faculty existingFaculty = getFacultyById(id);

        validateFaculty(updatedFaculty);

        existingFaculty.setTeacherName(updatedFaculty.getTeacherName());
        existingFaculty.setMobileNumber(updatedFaculty.getMobileNumber());
        existingFaculty.setQualification(updatedFaculty.getQualification());
        existingFaculty.setSubject(updatedFaculty.getSubject());
        existingFaculty.setExperience(updatedFaculty.getExperience());
        existingFaculty.setActive(updatedFaculty.isActive());

        return facultyRepository.save(existingFaculty);
    }

    public void deleteFaculty(Long id) {
        Faculty faculty = getFacultyById(id);
        facultyRepository.delete(faculty);
    }

    private void validateFaculty(Faculty faculty) {

        if (faculty.getTeacherName() == null ||
                faculty.getTeacherName().trim().isEmpty()) {
            throw new IllegalArgumentException("Teacher name is required.");
        }

        if (faculty.getMobileNumber() == null ||
                !faculty.getMobileNumber().matches("^[6-9][0-9]{9}$")) {
            throw new IllegalArgumentException("Enter a valid 10-digit mobile number.");
        }

        if (faculty.getQualification() == null ||
                faculty.getQualification().trim().isEmpty()) {
            throw new IllegalArgumentException("Qualification is required.");
        }

        if (faculty.getSubject() == null ||
                faculty.getSubject().trim().isEmpty()) {
            throw new IllegalArgumentException("Subject is required.");
        }

        if (faculty.getExperience() == null ||
                faculty.getExperience() < 0 ||
                faculty.getExperience() > 60) {
            throw new IllegalArgumentException("Experience must be between 0 and 60 years.");
        }
    }
}