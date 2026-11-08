
package com.kumarclasses.kumarclasses.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kumarclasses.kumarclasses.entity.Gallery;
import com.kumarclasses.kumarclasses.repository.GalleryRepository;

@RestController
@RequestMapping("/api/public/gallery")
public class PublicGalleryController {

    private final GalleryRepository galleryRepository;

    public PublicGalleryController(GalleryRepository galleryRepository) {
        this.galleryRepository = galleryRepository;
    }

    @GetMapping
    public List<Gallery> getActiveGallery() {
        return galleryRepository.findByActiveTrueOrderByUploadedAtDesc();
    }
}
