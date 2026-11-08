
package com.kumarclasses.kumarclasses.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kumarclasses.kumarclasses.entity.Announcement;

@Repository
public interface AnnouncementRepository
        extends JpaRepository<Announcement, Long> {

    // Fetch only active announcements, latest first
    List<Announcement> findByActiveTrueOrderByCreatedAtDesc();

}
