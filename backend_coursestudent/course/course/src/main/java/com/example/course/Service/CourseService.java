package com.example.course.Service;

import com.example.course.Client.StudentFeignClient;
import com.example.course.Entity.Course;
import com.example.course.Entity.CourseStudent;
import com.example.course.Entity.Student;
import com.example.course.Repository.CourseRepository;
import com.example.course.Repository.CourseStudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseStudentRepository courseStudentRepository;

    @Autowired
    private StudentFeignClient studentFeignClient;

    // Create or Update a course
    public Course saveCourse(Course course) {
        Optional<Course> existingCourse =  courseRepository.findByName(course.getName());
        if(existingCourse.isPresent()){
            throw new RuntimeException("A course with name " + course.getName() + " already exists.");
        }
        course.setCreated_at(LocalDateTime.now());
        return courseRepository.save(course);
    }

    // Get a course by its ID
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    // Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Update a course
    public Course updateCourse(Long id, Course updatedCourse) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setName(updatedCourse.getName());
        course.setDescription(updatedCourse.getDescription());
        course.setCredits(updatedCourse.getCredits());
        return courseRepository.save(course);
    }

    // Delete a course by ID
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found");
        }
        courseRepository.deleteById(id);
    }

    // Enroll a student in a course
    public CourseStudent enrollStudentInCourse(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Verify the student exists in the Students microservice
        studentFeignClient.getStudent(studentId);

        // Check if the student is already enrolled
        Optional<CourseStudent> existingEnrollment = courseStudentRepository.findByCourseIdAndStudentId(courseId, studentId);
        if (existingEnrollment.isPresent()) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        // Create the CourseStudent relationship
        CourseStudent courseStudent = new CourseStudent();
        courseStudent.setCourse(course);
        courseStudent.setStudentId(studentId);

        return courseStudentRepository.save(courseStudent);
    }

    // Get all students enrolled in a specific course
    public List<Student> getStudentsInCourse(Long courseId) {
        // Obtenemos todas las relaciones CourseStudent para el curso
        List<CourseStudent> courseStudents = courseStudentRepository.findByCourseId(courseId);

        // Usamos Feign Client para obtener los detalles completos de cada estudiante
        List<Student> students = new ArrayList<>();
        for (CourseStudent courseStudent : courseStudents) {
            Long studentId = courseStudent.getStudentId();
            // Obtener el estudiante desde el Feign Client y extraer solo el body
            Student student = studentFeignClient.getStudent(studentId).getBody(); // .getBody() obtiene el estudiante

            if (student != null) {
                students.add(student);
            }
        }
        return students;
    }

    public List<Student> getStudentsNotInCourse(Long courseId) {
        // Obtener todos los estudiantes
        List<Student> allStudents = studentFeignClient.getAllStudents();

        // Obtener los estudiantes ya inscritos en el curso
        List<Student> enrolledStudents = getStudentsInCourse(courseId);

        // Obtener los IDs de los estudiantes inscritos
        List<Long> enrolledStudentIds = enrolledStudents.stream()
                .map(Student::getId) // Extraer los IDs
                .toList();

        // Filtrar estudiantes no inscritos
        List<Student> notEnrolledStudents = allStudents.stream()
                .filter(student -> !enrolledStudentIds.contains(student.getId()))
                .toList();

        return notEnrolledStudents;
    }





    // Remove a student from a course
    public void removeStudentFromCourse(Long courseId, Long studentId) {
        CourseStudent courseStudent = courseStudentRepository.findByCourseIdAndStudentId(courseId, studentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        courseStudentRepository.delete(courseStudent);
    }
}
