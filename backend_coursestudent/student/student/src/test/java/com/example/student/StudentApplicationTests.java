package com.example.student;

import com.example.student.Controller.StudentController;
import com.example.student.Entity.Student;
import com.example.student.Repository.StudentRepository;
import com.example.student.Service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentApplicationTests {

	@InjectMocks
	private StudentController studentController;

	@Mock
	private StudentService studentService;

	@Mock
	private BindingResult bindingResult;

	@Mock
	private StudentRepository studentRepository;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void createStudent_ShouldReturnCreatedStudent() {
		Student student = new Student();
		student.setFirst_name("John");
		student.setLast_name("Doe");
		student.setEmail("john.doe@example.com");

		when(bindingResult.hasErrors()).thenReturn(false);
		when(studentService.saveStudent(any(Student.class))).thenReturn(student);

		ResponseEntity<?> response = studentController.createStudent(student, bindingResult);

		assertEquals(201, response.getStatusCodeValue());
		assertEquals(student, response.getBody());
		verify(studentService, times(1)).saveStudent(student);
	}

	@Test
	void getStudent_ShouldReturnStudent_WhenStudentExists() {
		Long studentId = 1L;
		Student student = new Student();
		student.setFirst_name("John");
		student.setLast_name("Doe");
		student.setEmail("john.doe@example.com");

		when(studentService.getStudentById(studentId)).thenReturn(Optional.of(student));

		ResponseEntity<Student> response = studentController.getStudent(studentId);

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(student, response.getBody());
		verify(studentService, times(1)).getStudentById(studentId);
	}

	@Test
	void getStudent_ShouldReturnNotFound_WhenStudentDoesNotExist() {
		Long studentId = 1L;

		when(studentService.getStudentById(studentId)).thenReturn(Optional.empty());

		ResponseEntity<Student> response = studentController.getStudent(studentId);

		assertEquals(404, response.getStatusCodeValue());
		verify(studentService, times(1)).getStudentById(studentId);
	}

	@Test
	void getAllStudents_ShouldReturnAllStudents() {
		Student student1 = new Student();
		student1.setFirst_name("John");
		student1.setLast_name("Doe");
		student1.setEmail("john.doe@example.com");

		Student student2 = new Student();
		student2.setFirst_name("Jane");
		student2.setLast_name("Doe");
		student2.setEmail("jane.doe@example.com");

		when(studentService.getAllStudents()).thenReturn(List.of(student1, student2));

		ResponseEntity<List<Student>> response = studentController.getAllStudents();

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(2, response.getBody().size());
		verify(studentService, times(1)).getAllStudents();
	}

	@Test
	void updateStudent_ShouldReturnUpdatedStudent_WhenStudentExists() {
		Long studentId = 1L;
		Student updatedStudent = new Student();
		updatedStudent.setFirst_name("John");
		updatedStudent.setLast_name("Doe Updated");
		updatedStudent.setEmail("john.doe.updated@example.com");

		Student existingStudent = new Student();
		existingStudent.setFirst_name("John");
		existingStudent.setLast_name("Doe");
		existingStudent.setEmail("john.doe@example.com");

		when(bindingResult.hasErrors()).thenReturn(false);
		when(studentService.updateStudent(studentId, updatedStudent)).thenReturn(updatedStudent);

		ResponseEntity<?> response = studentController.updateStudent(studentId, updatedStudent, bindingResult);

		assertEquals(200, response.getStatusCodeValue());
		assertEquals(updatedStudent, response.getBody());
		verify(studentService, times(1)).updateStudent(studentId, updatedStudent);
	}

	@Test
	void updateStudent_ShouldReturnNotFound_WhenStudentDoesNotExist() {
		Long studentId = 1L;
		Student updatedStudent = new Student();
		updatedStudent.setFirst_name("John");
		updatedStudent.setLast_name("Doe Updated");
		updatedStudent.setEmail("john.doe.updated@example.com");

		when(bindingResult.hasErrors()).thenReturn(false);
		when(studentService.updateStudent(studentId, updatedStudent)).thenThrow(new RuntimeException("Student with ID " + studentId + " not found"));

		ResponseEntity<?> response = studentController.updateStudent(studentId, updatedStudent, bindingResult);

		assertEquals(404, response.getStatusCodeValue());
		verify(studentService, times(1)).updateStudent(studentId, updatedStudent);
	}

	@Test
	void deleteStudent_ShouldReturnNoContent_WhenStudentExists() {
		Long studentId = 1L;

		doNothing().when(studentService).deleteStudent(studentId);

		ResponseEntity<Void> response = studentController.deleteStudent(studentId);

		assertEquals(204, response.getStatusCodeValue());
		verify(studentService, times(1)).deleteStudent(studentId);
	}

	@Test
	void deleteStudent_ShouldReturnNotFound_WhenStudentDoesNotExist() {
		Long studentId = 1L;

		doThrow(new RuntimeException("Student with ID " + studentId + " not found")).when(studentService).deleteStudent(studentId);

		ResponseEntity<Void> response = studentController.deleteStudent(studentId);

		assertEquals(404, response.getStatusCodeValue());
		verify(studentService, times(1)).deleteStudent(studentId);
	}






}
