package com.kumarclasses.kumarclasses.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kumarclasses.kumarclasses.entity.Gallery;
import com.kumarclasses.kumarclasses.repository.GalleryRepository;

@Service
public class GalleryService {

    private final GalleryRepository galleryRepository;

    public GalleryService(GalleryRepository galleryRepository) {
        this.galleryRepository = galleryRepository;
    }

    // Add Gallery Photo
    public Gallery addGallery(Gallery gallery) {
        validateGallery(gallery);
        return galleryRepository.save(gallery);
    }

    // Get All Gallery Photos
    public List<Gallery> getAllGallery() {
        return galleryRepository.findAll();
    }

    // Get Gallery By ID
    public Gallery getGalleryById(Long id) {
        return galleryRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Gallery not found with ID: " + id));
    }

    // Update Gallery
    public Gallery updateGallery(Long id, Gallery updatedGallery) {
        Gallery existingGallery = getGalleryById(id);

        validateGallery(updatedGallery);

        existingGallery.setTitle(updatedGallery.getTitle());
        existingGallery.setCategory(updatedGallery.getCategory());
        existingGallery.setActive(updatedGallery.isActive());

        return galleryRepository.save(existingGallery);
    }

    // Delete Gallery
    public void deleteGallery(Long id) {
        Gallery gallery = getGalleryById(id);
        galleryRepository.delete(gallery);
    }

    // Validation
    private void validateGallery(Gallery gallery) {

        if (gallery.getTitle() == null ||
                gallery.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Photo title is required.");
        }

        if (gallery.getCategory() == null ||
                gallery.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Photo category is required.");
        }

        if (gallery.getImagePath() == null ||
                gallery.getImagePath().trim().isEmpty()) {
            throw new IllegalArgumentException("Image path is required.");
        }
    }
}