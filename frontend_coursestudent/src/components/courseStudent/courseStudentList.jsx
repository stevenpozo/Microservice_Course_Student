import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Select, SelectItem } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { useNavigate } from "react-router-dom"; 
import API_URLS from '../../Config/config'; 


const CourseStudentList = () => {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [notEnrolledStudents, setNotEnrolledStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedCourseName, setSelectedCourseName] = useState("");
    const [studentToAdd, setStudentToAdd] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate(); 

    // Fetch all courses
    useEffect(() => {
        const fetchCourses = async () => {
            const response = await axios.get(`${API_URLS.courses}/course`);
            setCourses(response.data);
        };
        fetchCourses();
    }, []);

    const fetchStudentsInCourse = async (courseId) => {
        const response = await axios.get(`${API_URLS.courses}/course/${courseId}/students`);
        setStudents(response.data);
    };

    const fetchNotEnrolledStudents = async (courseId) => {
        const response = await axios.get(`${API_URLS.courses}/course/${courseId}/students/not-enrolled`);
        setNotEnrolledStudents(response.data);
    };

    const handleAddStudent = async () => {
        if (selectedCourse && studentToAdd) {
            await axios.post(`${API_URLS.courses}/course/${selectedCourse}/students/${studentToAdd}`);
            setShowModal(false);
            fetchStudentsInCourse(selectedCourse);
        }
    };

    const handleRemoveStudent = async (studentId) => {
        if (selectedCourse) {
            await axios.delete(`${API_URLS.courses}/course/${selectedCourse}/students/${studentId}`);
            fetchStudentsInCourse(selectedCourse);
        }
    };

    const handleGoBack = () => {
        navigate("/"); 
    };

    return (
        <div className="course-student-list-container">
            <h1>Courses and Students</h1>
    
            <Button onClick={handleGoBack} className="mb-4">
                Back to Main Menu
            </Button>
    
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td>{course.name}</td>
                                <td>{course.description}</td>
                                <td>
                                    <Button
                                        onClick={() => {
                                            setSelectedCourse(course.id);
                                            setSelectedCourseName(course.name);
                                            fetchNotEnrolledStudents(course.id);
                                            setShowModal(true);
                                        }}
                                    >
                                        Add Student
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setSelectedCourse(course.id);
                                            setSelectedCourseName(course.name);
                                            setStudents([]);
                                            fetchStudentsInCourse(course.id);
                                        }}
                                        className="ml-2"
                                    >
                                        View Participants
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    
            {selectedCourse && (
                <div className="table-container">
                    <h2>
                        Students in Course: {selectedCourseName}
                    </h2>
                    <table>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.first_name}</td>
                                        <td>{student.last_name}</td>
                                        <td>{student.email}</td>
                                        <td>
                                            <Button
                                                onClick={() => handleRemoveStudent(student.id)}
                                                variant="destructive"
                                            >
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No students enrolled in this course.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
    
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <h2 className="add_student">Add Student</h2>
                    <select
                        className="select"
                        onChange={(e) => setStudentToAdd(e.target.value)}
                    >
                        <option value="" disabled selected>
                            Select a student
                        </option>
                        {notEnrolledStudents.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.first_name} {student.last_name}
                            </option>
                        ))}
                    </select>
                    <Button onClick={handleAddStudent} className="btn_addstudent">
                        Add Student
                    </Button>
                </Modal>
            )}
        </div>
    );
    
};

export default CourseStudentList;
