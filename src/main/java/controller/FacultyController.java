
package com.kumarclasses.kumarclasses.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kumarclasses.kumarclasses.entity.Faculty;
import com.kumarclasses.kumarclasses.service.FacultyService;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    // ADD FACULTY (ADMIN)
    @PostMapping
    public ResponseEntity<Faculty> addFaculty(
            @RequestBody Faculty faculty) {

        Faculty savedFaculty = facultyService.addFaculty(faculty);

        return new ResponseEntity<>(savedFaculty, HttpStatus.CREATED);
    }

    // GET ALL FACULTY (ADMIN)
    @GetMapping
    public ResponseEntity<List<Faculty>> getAllFaculty() {

        return ResponseEntity.ok(
                facultyService.getAllFaculty()
        );
    }

    // GET ACTIVE FACULTY (PUBLIC WEBSITE)
    @GetMapping("/public")
    public ResponseEntity<List<Map<String, Object>>> getPublicFaculty() {

        List<Map<String, Object>> facultyList = new ArrayList<>();

        for (Faculty faculty : facultyService.getActiveFaculty()) {

            Map<String, Object> facultyData = new LinkedHashMap<>();

            facultyData.put("id", faculty.getId());
            facultyData.put("teacherName", faculty.getTeacherName());
            facultyData.put("qualification", faculty.getQualification());
            facultyData.put("subject", faculty.getSubject());
            facultyData.put("experience", faculty.getExperience());

            facultyList.add(facultyData);
        }

        return ResponseEntity.ok(facultyList);
    }

    // GET FACULTY BY ID (ADMIN)
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<Faculty> getFacultyById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                facultyService.getFacultyById(id)
        );
    }

    // UPDATE FACULTY (ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<Faculty> updateFaculty(
            @PathVariable Long id,
            @RequestBody Faculty faculty) {

        Faculty updatedFaculty =
                facultyService.updateFaculty(id, faculty);

        return ResponseEntity.ok(updatedFaculty);
    }

    // DELETE FACULTY (ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaculty(
            @PathVariable Long id) {

        facultyService.deleteFaculty(id);

        return ResponseEntity.noContent().build();
    }
}
