
package com.kumarclasses.kumarclasses.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kumarclasses.kumarclasses.entity.Gallery;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {

    List<Gallery> findByActiveTrueOrderByUploadedAtDesc();
}
