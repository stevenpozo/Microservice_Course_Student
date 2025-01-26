package com.example.course.Client;

import com.example.course.Entity.Student;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "students", url = "http://localhost:8002/student")
public interface StudentFeignClient {
    @GetMapping("/{id}")
    ResponseEntity<Student> getStudent(@PathVariable Long id);

    @GetMapping
    List<Student> getAllStudents();
}
