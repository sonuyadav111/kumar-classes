
package com.kumarclasses.kumarclasses.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String courseName;

    @Column(nullable = false)
    private Integer startClass;

    @Column(nullable = false)
    private Integer endClass;

    @Column(nullable = false)
    private String subject;

    @Column(length = 1000)
    private String description;

    private boolean active = true;

    public Long getId() {
        return id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Integer getStartClass() {
        return startClass;
    }

    public void setStartClass(Integer startClass) {
        this.startClass = startClass;
    }

    public Integer getEndClass() {
        return endClass;
    }

    public void setEndClass(Integer endClass) {
        this.endClass = endClass;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
