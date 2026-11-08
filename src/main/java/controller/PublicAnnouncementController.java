
package com.kumarclasses.kumarclasses.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kumarclasses.kumarclasses.entity.Announcement;
import com.kumarclasses.kumarclasses.repository.AnnouncementRepository;

@RestController
@RequestMapping("/api/public/announcements")
public class PublicAnnouncementController {

    private final AnnouncementRepository repository;

    public PublicAnnouncementController(
            AnnouncementRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Announcement> getActiveAnnouncements() {
        return repository.findByActiveTrueOrderByCreatedAtDesc();
    }
}
