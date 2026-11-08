
package com.kumarclasses.kumarclasses.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kumarclasses.kumarclasses.entity.StudentEnquiry;

@Repository
public interface StudentEnquiryRepository
        extends JpaRepository<StudentEnquiry, Long> {

}
