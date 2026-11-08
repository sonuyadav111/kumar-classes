
package com.kumarclasses.kumarclasses.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kumarclasses.kumarclasses.entity.Announcement;
import com.kumarclasses.kumarclasses.repository.AnnouncementRepository;

@Service
public class AnnouncementService {

    private final AnnouncementRepository repository;

    public AnnouncementService(AnnouncementRepository repository) {
        this.repository = repository;
    }

    // ADD ANNOUNCEMENT
    public Announcement addAnnouncement(Announcement announcement) {
        validateAnnouncement(announcement);
        return repository.save(announcement);
    }

    // GET ALL ANNOUNCEMENTS
    public List<Announcement> getAllAnnouncements() {
        return repository.findAll();
    }

    // GET ANNOUNCEMENT BY ID
    public Announcement getAnnouncementById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // UPDATE ANNOUNCEMENT
    public Announcement updateAnnouncement(
            Long id, Announcement updatedAnnouncement) {

        Announcement existing = repository.findById(id)
                .orElseThrow(() ->
                    new IllegalArgumentException("Announcement not found"));

        validateAnnouncement(updatedAnnouncement);

        existing.setTitle(updatedAnnouncement.getTitle());
        existing.setMessage(updatedAnnouncement.getMessage());
        existing.setType(updatedAnnouncement.getType());
        existing.setActive(updatedAnnouncement.isActive());

        return repository.save(existing);
    }

    // DELETE ANNOUNCEMENT
    public void deleteAnnouncement(Long id) {

        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Announcement not found");
        }

        repository.deleteById(id);
    }

    // VALIDATION
    private void validateAnnouncement(Announcement announcement) {

        if (announcement.getTitle() == null ||
                announcement.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }

        if (announcement.getMessage() == null ||
                announcement.getMessage().isBlank()) {
            throw new IllegalArgumentException("Message is required");
        }

        if (announcement.getType() == null ||
                announcement.getType().isBlank()) {
            throw new IllegalArgumentException("Announcement type is required");
        }

        List<String> validTypes = List.of(
                "Notice",
                "New Batch",
                "Exam Update",
                "Offer",
                "Motivational Quote"
        );

        if (!validTypes.contains(announcement.getType())) {
            throw new IllegalArgumentException("Invalid announcement type");
        }
    }
}
