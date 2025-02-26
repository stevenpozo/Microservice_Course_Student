import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_URLS from '../../Config/config'; 


const StudentForm = () => {
    const [notification, setNotification] = useState(null);
    const [student, setStudent] = useState({
        first_name: '',
        last_name: '',
        email: '',
        birthday: '',
        phone_number: '',
    });
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetch(`${API_URLS.students}/student/${id}`)
                .then(response => response.json())
                .then(data => setStudent(data))
                .catch(error => console.error('Error fetching student:', error));
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URLS.students}/student/${id}` : `${API_URLS.students}/student`;
    
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        // Aquí manejas los errores del backend y los asignas al estado
                        if (errorData) {
                            setErrors(errorData);  // Aquí guardas los errores específicos de los campos
                        }
                        throw new Error(errorData.message || "Something went wrong");
                    });
                }
                return response.json();
            })
            .then(data => {
                navigate('/students/list'); // Redirigir a la lista de estudiantes
            })
            .catch(error => {
                console.error('Error submitting student:', error);
                setNotification(error.message);
                setTimeout(() => {
                    setNotification(null);
                }, 5000);
            });
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent({
            ...student,
            [name]: value,
        });
    };

    const handleCancel = () => {
        // Confirmar si el usuario está seguro de cancelar sin guardar
        const confirmCancel = window.confirm("Are you sure you want to leave without saving?");
        if (confirmCancel) {
            navigate('/students/list'); // Redirigir a la lista de estudiantes
        }
    };

    return (
        <div className="form-container">
            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}
            <h2>{id ? 'Edit Student' : 'Add Student'}</h2>
            
            <form onSubmit={handleSubmit} aria-label="Student form">
                <div>
                    <label htmlFor="first_name">First Name:</label>
                    <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        value={student.first_name}
                        onChange={handleChange}
                    />
                    {errors.first_name && <div className="error">{errors.first_name}</div>}
                </div>
                <div>
                    <label htmlFor="last_name">Last Name:</label>
                    <input
                        id="last_name"
                        type="text"
                        name="last_name"
                        value={student.last_name}
                        onChange={handleChange}
                    />
                    {errors.last_name && <div className="error">{errors.last_name}</div>}
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={student.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>
                <div>
                    <label htmlFor="birthday">Birthday:</label>
                    <input
                        id="birthday"
                        type="date"
                        name="birthday"
                        value={student.birthday}
                        onChange={handleChange}
                    />
                    {errors.birthday && <div className="error">{errors.birthday}</div>}
                </div>
    
                <div>
                    <label htmlFor="phone_number">Phone Number:</label>
                    <input
                        id="phone_number"
                        type="text"
                        name="phone_number"
                        value={student.phone_number}
                        onChange={handleChange}
                    />
                    {errors.phone_number && <div className="error">{errors.phone_number}</div>}
                </div>
                <button type="submit">{id ? 'Update' : 'Add'}</button>
                <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button> {/* Botón de Cancelar */}
            </form>
        </div>
    );
    
};

export default StudentForm;
