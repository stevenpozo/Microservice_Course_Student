package com.example.student.Service;

import com.example.student.Entity.Student;
import com.example.student.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Create or Update a student
    public Student saveStudent(Student student) {
        Optional<Student> existingStudent = studentRepository.findByEmail(student.getEmail());
        if (existingStudent.isPresent()) {
            throw new RuntimeException("A student with the email " + student.getEmail() + " already exists.");
        }

        student.setCreated_at(LocalDateTime.now());
        return studentRepository.save(student);
    }

    // Get a student by ID
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Update a student by ID
    public Student updateStudent(Long id, Student updatedStudent) {
        return studentRepository.findById(id)
                .map(existingStudent -> {
                    existingStudent.setFirst_name(updatedStudent.getFirst_name());
                    existingStudent.setLast_name(updatedStudent.getLast_name());
                    existingStudent.setEmail(updatedStudent.getEmail());
                    existingStudent.setBirthday(updatedStudent.getBirthday());
                    existingStudent.setPhone_number(updatedStudent.getPhone_number());
                    return studentRepository.save(existingStudent);
                })
                .orElseThrow(() -> new RuntimeException("Student with ID " + id + " not found"));
    }

    // Delete a student by ID
    public void deleteStudent(Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
        } else {
            throw new RuntimeException("Student with ID " + id + " not found");
        }
    }
}
