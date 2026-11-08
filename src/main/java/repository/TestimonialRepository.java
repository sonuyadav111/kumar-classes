
package com.kumarclasses.kumarclasses.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kumarclasses.kumarclasses.entity.Testimonial;

@Repository
public interface TestimonialRepository
        extends JpaRepository<Testimonial, Long> {

    List<Testimonial> findByApprovedTrueOrderByCreatedAtDesc();
}
