import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import API_URLS from '../../Config/config'; 


const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URLS.courses}/course`)
            .then(response => response.json())
            .then(data => setCourses(data))
            .catch(error => console.error('Error fetching courses:', error));
    }, []);

    const handleDelete = (courseId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (confirmDelete) {
            fetch(`${API_URLS.courses}/course/${courseId}`, {
                method: 'DELETE',
            })
                .then(() => {
                    setCourses(courses.filter(course => course.id !== courseId));
                    alert('Course deleted successfully!');
                })
                .catch(error => {
                    console.error('Error deleting course:', error);
                    alert('Failed to delete course');
                });
        }
    };

    const handleGoBack = () => {
        navigate("/");
    };

    return (
        <div className="list-container">
            <Button onClick={handleGoBack} className="mb-4">
                Back to Main Menu
            </Button>
            <h2>Course List</h2>
            <div className="button-container">
                <Link to="/course/add">
                    <button className="add-button">Add New Course</button>
                </Link>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Credits</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id}>
                                <td>{course.id}</td>
                                <td>{course.name}</td>
                                <td>{course.description}</td>
                                <td>{course.credits}</td>
                                <td>
                                    <Link to={`/course/edit/${course.id}`}>
                                        <button className='btn_edit'>Edit</button>
                                    </Link>
                                    <button className='btn_delete' onClick={() => handleDelete(course.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseList;
