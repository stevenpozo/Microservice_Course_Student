package com.example.student.Controller;

import com.example.student.Entity.Student;
import com.example.student.Service.StudentService;
import com.example.student.Utils.Validation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/student")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Create a new student
    @PostMapping
    public ResponseEntity<?> createStudent(@Valid @RequestBody Student student, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = Validation.getValidationErrors(result);
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        Student newStudent = studentService.saveStudent(student);
        return new ResponseEntity<>(newStudent, HttpStatus.CREATED);
    }

    // Get a student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(student -> new ResponseEntity<>(student, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get all students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    // Update a student by ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody Student updatedStudent, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = Validation.getValidationErrors(result);
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        try {
            Student student = studentService.updateStudent(id, updatedStudent);
            return new ResponseEntity<>(student, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a student by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
