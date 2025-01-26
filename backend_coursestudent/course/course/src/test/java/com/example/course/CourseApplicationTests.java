package com.example.course;

import com.example.course.Controller.CourseController;
import com.example.course.Entity.Course;
import com.example.course.Entity.CourseStudent;
import com.example.course.Entity.Student;
import com.example.course.Service.CourseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class CourseApplicationTests {

	@InjectMocks
	private CourseController courseController;

	@Mock
	private CourseService courseService;

	@Mock
	private BindingResult bindingResult;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void createCourse_ShouldReturnCreatedCourse() {
		Course course = new Course();
		course.setName("Mathematics");
		course.setDescription("Math 101");
		course.setCredits(3);

		when(bindingResult.hasErrors()).thenReturn(false);
		when(courseService.saveCourse(any(Course.class))).thenReturn(course);

		ResponseEntity<?> response = courseController.createCourse(course, bindingResult);

		assertEquals(201, response.getStatusCodeValue());
		assertEquals(course, response.getBody());
		verify(courseService, times(1)).saveCourse(course);
	}

	@Test
	void getCourseById_ShouldReturnCourse_WhenCourseExists() {
		Course course = new Course();
		course.setId(1L);
		course.setName("Mathematics");

		when(courseService.getCourseById(1L)).thenReturn(Optional.of(course));

		ResponseEntity<Course> response = courseController.getCourseById(1L);

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(course, response.getBody());
	}

	@Test
	void getCourseById_ShouldReturnNotFound_WhenCourseDoesNotExist() {
		when(courseService.getCourseById(1L)).thenReturn(Optional.empty());

		ResponseEntity<Course> response = courseController.getCourseById(1L);

		assertEquals(404, response.getStatusCodeValue());
	}

	@Test
	void updateCourse_ShouldReturnUpdatedCourse() {
		Course course = new Course();
		course.setId(1L);
		course.setName("Mathematics");
		course.setDescription("Math 101");
		course.setCredits(3);

		Course updatedCourse = new Course();
		updatedCourse.setId(1L);
		updatedCourse.setName("Advanced Mathematics");
		updatedCourse.setDescription("Math 201");
		updatedCourse.setCredits(4);

		when(bindingResult.hasErrors()).thenReturn(false);
		when(courseService.updateCourse(1L, updatedCourse)).thenReturn(updatedCourse);

		ResponseEntity<?> response = courseController.updateCourse(1L, updatedCourse, bindingResult);

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(updatedCourse, response.getBody());
		verify(courseService, times(1)).updateCourse(1L, updatedCourse);
	}

	@Test
	void deleteCourse_ShouldReturnNoContent_WhenCourseIsDeleted() {
		doNothing().when(courseService).deleteCourse(1L);

		ResponseEntity<?> response = courseController.deleteCourse(1L);

		assertEquals(204, response.getStatusCodeValue());
		verify(courseService, times(1)).deleteCourse(1L);
	}

	@Test
	void deleteCourse_ShouldReturnNotFound_WhenCourseDoesNotExist() {
		doThrow(new RuntimeException("Course not found")).when(courseService).deleteCourse(1L);

		ResponseEntity<?> response = courseController.deleteCourse(1L);

		assertEquals(404, response.getStatusCodeValue());
	}

	@Test
	void enrollStudentInCourse_ShouldReturnCreated_WhenStudentIsEnrolled() {
		Long courseId = 1L;
		Long studentId = 1L;

		CourseStudent courseStudent = new CourseStudent();
		courseStudent.setCourse(new Course());
		courseStudent.setStudentId(studentId);

		when(courseService.enrollStudentInCourse(courseId, studentId)).thenReturn(courseStudent);

		ResponseEntity<?> response = courseController.enrollStudentInCourse(courseId, studentId);

		assertEquals(201, response.getStatusCodeValue());
		assertEquals(courseStudent, response.getBody());
		verify(courseService, times(1)).enrollStudentInCourse(courseId, studentId);
	}

	@Test
	void getStudentsInCourse_ShouldReturnListOfStudents() {
		Long courseId = 1L;
		List<Student> students = List.of(new Student(), new Student());

		when(courseService.getStudentsInCourse(courseId)).thenReturn(students);

		ResponseEntity<List<Student>> response = courseController.getStudentsInCourse(courseId);

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(students, response.getBody());
	}

	@Test
	void getStudentsNotInCourse_ShouldReturnListOfStudentsNotEnrolled() {
		Long courseId = 1L;
		List<Student> students = List.of(new Student(), new Student());

		when(courseService.getStudentsNotInCourse(courseId)).thenReturn(students);

		ResponseEntity<List<Student>> response = courseController.getStudentsNotInCourse(courseId);

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(students, response.getBody());
	}

	@Test
	void removeStudentFromCourse_ShouldReturnNoContent() {
		Long courseId = 1L;
		Long studentId = 1L;

		doNothing().when(courseService).removeStudentFromCourse(courseId, studentId);

		ResponseEntity<?> response = courseController.removeStudentFromCourse(courseId, studentId);

		assertEquals(204, response.getStatusCodeValue());
		verify(courseService, times(1)).removeStudentFromCourse(courseId, studentId);
	}

	@Test
	void removeStudentFromCourse_ShouldReturnNotFound_WhenEnrollmentDoesNotExist() {
		Long courseId = 1L;
		Long studentId = 1L;

		doThrow(new RuntimeException("Enrollment not found")).when(courseService).removeStudentFromCourse(courseId, studentId);

		ResponseEntity<?> response = courseController.removeStudentFromCourse(courseId, studentId);

		assertEquals(404, response.getStatusCodeValue());
	}
}
