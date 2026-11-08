
package com.kumarclasses.kumarclasses.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kumarclasses.kumarclasses.entity.Announcement;
import com.kumarclasses.kumarclasses.service.AnnouncementService;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService service;

    public AnnouncementController(AnnouncementService service) {
        this.service = service;
    }

    // ADD ANNOUNCEMENT
    @PostMapping
    public ResponseEntity<Announcement> addAnnouncement(
            @RequestBody Announcement announcement) {

        Announcement saved =
                service.addAnnouncement(announcement);

        return ResponseEntity.ok(saved);
    }

    // GET ALL ANNOUNCEMENTS
    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {

        return ResponseEntity.ok(
                service.getAllAnnouncements()
        );
    }

    // GET ANNOUNCEMENT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(
            @PathVariable Long id) {

        Announcement announcement =
                service.getAnnouncementById(id);

        if (announcement == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(announcement);
    }

    // UPDATE ANNOUNCEMENT
    @PutMapping("/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody Announcement announcement) {

        return ResponseEntity.ok(
                service.updateAnnouncement(id, announcement)
        );
    }

    // DELETE ANNOUNCEMENT
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(
            @PathVariable Long id) {

        service.deleteAnnouncement(id);

        return ResponseEntity.noContent().build();
    }
}
