// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../src/components/HomePage';
import StudentList from './components/student/studentList';
import CourseList from './components/course/courseList';
import AssignStudentsToCourses from './components/student/studentList';
import StudentForm from './components/student/studentForm';
import CourseForm from './components/course/courseForm'
import CourseStudentList from './components/courseStudent/courseStudentList'
import '../src/styles/HomePage.css'; 
import 'font-awesome/css/font-awesome.min.css';
import '../src/styles/Form.css'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/students/list" element={<StudentList />} />
        <Route path="/students/add" element={<StudentForm />} />
        <Route path="/course/list" element={<CourseList />} />
        <Route path="/course/add" element={<CourseForm />} />
        <Route path="/assignments" element={<AssignStudentsToCourses />} />
        <Route path="/student/edit/:id" element={<StudentForm />} />
        <Route path="/course/edit/:id" element={<CourseForm />} />
        <Route path='/course-student' element={<CourseStudentList/>} />
      </Routes>
    </Router>
  );
}

export default App;
