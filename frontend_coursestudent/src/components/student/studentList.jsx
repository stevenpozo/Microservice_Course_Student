import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8002/student')
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => console.error('Error fetching students:', error));
    }, []);

    const handleDelete = (id) => {
        fetch(`http://localhost:8002/student/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                setStudents(students.filter(student => student.id !== id));
            })
            .catch(error => console.error('Error deleting student:', error));
    };

    const handleGoBack = () => {
        navigate("/");
    };

    return (
        <div className="list-container">
            <Button onClick={handleGoBack} className="mb-4">
                Back to Main Menu
            </Button>
            <h2>Student List</h2>
            <div className="button-container">
                <Link to="/students/add">
                    <button className="add-button">Add New Student</button>
                </Link>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.first_name} {student.last_name}</td>
                                <td>{student.email}</td>
                                <td>
                                    <Link to={`/student/edit/${student.id}`}>
                                        <button className='btn_edit'>Edit</button>
                                    </Link>
                                    <button className='btn_delete' onClick={() => handleDelete(student.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentList;
