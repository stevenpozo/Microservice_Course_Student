package com.example.course.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @NotBlank(message = "Name cannot be blank")
    @Size(max = 63, min = 2, message = "Name must be between 2 and 63 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "Description cannot be blank")
    @Size(max = 255, message = "Description cannot exceed 255 characters")
    @Column(name = "description", nullable = false)
    private String description;

    @PositiveOrZero(message = "Credits must be zero or a positive number")
    @Column(name = "credits", nullable = false)
    private int credits;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime created_at;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Indicates the owner side of the relationship
    private List<CourseStudent> courseStudents = new ArrayList<>();

    // Automatically set created_at before persisting
    @PrePersist
    protected void onCreate() {
        this.created_at = LocalDateTime.now();
    }

    // Getters and Setters

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public List<CourseStudent> getCourseStudents() {
        return courseStudents;
    }

    public void setCourseStudents(List<CourseStudent> courseStudents) {
        this.courseStudents = courseStudents;
    }
}
