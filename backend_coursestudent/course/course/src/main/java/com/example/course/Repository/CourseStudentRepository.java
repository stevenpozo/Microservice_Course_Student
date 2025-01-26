package com.example.course.Repository;

import com.example.course.Entity.CourseStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseStudentRepository extends JpaRepository<CourseStudent, Long> {
    List<CourseStudent> findByCourseId(Long courseId);
    Optional<CourseStudent> findByCourseIdAndStudentId(Long courseId, Long studentId);

}
