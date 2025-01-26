import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="home-container">
            <h1>Welcome to the Management Portal</h1>
            <div className="card-container">
                <Link to="/students/list" className="card">
                    <i className="fas fa-user-graduate card-icon"></i>
                    <h2>Student Management</h2>
                </Link>
                <Link to="/course/list" className="card">
                    <i className="fas fa-book card-icon"></i>
                    <h2>Course Management</h2>
                </Link>
                <Link to="/course-student" className="card">
                    <i className="fas fa-chalkboard-teacher card-icon"></i> 
                    <h2>Assign Students to Courses</h2>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
