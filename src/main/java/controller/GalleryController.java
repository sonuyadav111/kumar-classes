package com.kumarclasses.kumarclasses.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kumarclasses.kumarclasses.entity.Gallery;
import com.kumarclasses.kumarclasses.service.GalleryService;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final GalleryService galleryService;

    private static final Path UPLOAD_DIR =
            Paths.get("uploads/gallery").toAbsolutePath().normalize();

    private static final Set<String> ALLOWED_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp");

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    public GalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    // Upload Gallery Photo
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> uploadGallery(
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("image") MultipartFile image) {

        try {
            if (image == null || image.isEmpty()) {
                throw new IllegalArgumentException("Please select an image.");
            }

            if (image.getSize() > MAX_FILE_SIZE) {
                throw new IllegalArgumentException("Image size must be under 5 MB.");
            }

            if (!ALLOWED_TYPES.contains(image.getContentType())) {
                throw new IllegalArgumentException("Only JPG, PNG and WEBP images are allowed.");
            }

            Files.createDirectories(UPLOAD_DIR);

            String originalName = image.getOriginalFilename();
            String extension = originalName == null ? "" :
                    originalName.substring(originalName.lastIndexOf('.') + 1)
                            .toLowerCase();

            String filename = java.util.UUID.randomUUID() + "." + extension;

            Path filePath = UPLOAD_DIR.resolve(filename).normalize();

            if (!filePath.startsWith(UPLOAD_DIR)) {
                throw new IllegalArgumentException("Invalid file name.");
            }

            Files.copy(image.getInputStream(), filePath,
                    StandardCopyOption.REPLACE_EXISTING);

            Gallery gallery = new Gallery();
            gallery.setTitle(title);
            gallery.setCategory(category);
            gallery.setImagePath("/uploads/gallery/" + filename);
            gallery.setActive(true);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(galleryService.addGallery(gallery));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Unable to upload image."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Get All Gallery Photos
    @GetMapping
    public ResponseEntity<List<Gallery>> getAllGallery() {
        return ResponseEntity.ok(galleryService.getAllGallery());
    }

    // Get Gallery By ID
    @GetMapping("/{id}")
    public ResponseEntity<Gallery> getGalleryById(@PathVariable Long id) {
        return ResponseEntity.ok(galleryService.getGalleryById(id));
    }

    // Update Gallery Details
    @PutMapping("/{id}")
    public ResponseEntity<Gallery> updateGallery(
            @PathVariable Long id,
            @RequestBody Gallery gallery) {

        return ResponseEntity.ok(
                galleryService.updateGallery(id, gallery));
    }

    // Delete Gallery
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGallery(@PathVariable Long id) {

        galleryService.deleteGallery(id);

        return ResponseEntity.noContent().build();
    }
}