
package com.kumarclasses.kumarclasses.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Student name is required")
    private String studentName;

    @NotBlank(message = "Parent name is required")
    private String parentName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Enter a valid 10-digit mobile number"
    )
    private String mobileNumber;

    @NotNull(message = "Please select a class")
    private Integer studentClass;

    @NotBlank(message = "Subject is required")
    private String subject;

    private LocalDate admissionDate;

    @PrePersist
    protected void onCreate() {
        admissionDate = LocalDate.now();
    }

    public Long getId() {
        return id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public Integer getStudentClass() {
        return studentClass;
    }

    public void setStudentClass(Integer studentClass) {
        this.studentClass = studentClass;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }
}
