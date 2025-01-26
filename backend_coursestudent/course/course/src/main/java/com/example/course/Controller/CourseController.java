package com.example.course.Controller;

import com.example.course.Entity.Course;
import com.example.course.Entity.CourseStudent;
import com.example.course.Entity.Student;
import com.example.course.Service.CourseService;
import com.example.course.Utils.Validation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/course")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // Create a new course
    @PostMapping
    public ResponseEntity<?> createCourse(@Valid  @RequestBody Course course, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = Validation.getValidationErrors(result);
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        Course newCourse = courseService.saveCourse(course);
        return new ResponseEntity<>(newCourse, HttpStatus.CREATED);
    }

    // Get a course by ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get all courses
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    // Update a course
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @Valid @RequestBody Course course, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = Validation.getValidationErrors(result);
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        try {
            Course updatedCourse = courseService.updateCourse(id, course);
            return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete a course
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Enroll a student in a course
    @PostMapping("/{courseId}/students/{studentId}")
    public ResponseEntity<?> enrollStudentInCourse(
            @PathVariable Long courseId, @PathVariable Long studentId) {
        try {
            CourseStudent courseStudent = courseService.enrollStudentInCourse(courseId, studentId);
            return new ResponseEntity<>(courseStudent, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Get all students enrolled in a specific course
    @GetMapping("/{courseId}/students")
    public ResponseEntity<List<Student>> getStudentsInCourse(@PathVariable Long courseId) {
        List<Student> students = courseService.getStudentsInCourse(courseId);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    // Get students not enrolled in a specific course
    @GetMapping("/{courseId}/students/not-enrolled")
    public ResponseEntity<List<Student>> getStudentsNotInCourse(@PathVariable Long courseId) {
        List<Student> students = courseService.getStudentsNotInCourse(courseId);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }



    // Remove a student from a course
    @DeleteMapping("/{courseId}/students/{studentId}")
    public ResponseEntity<?> removeStudentFromCourse(
            @PathVariable Long courseId, @PathVariable Long studentId) {
        try {
            courseService.removeStudentFromCourse(courseId, studentId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
