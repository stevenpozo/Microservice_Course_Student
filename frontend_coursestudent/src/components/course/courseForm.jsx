import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_URLS from '../../Config/config'; 


const CourseForm = () => {
    const [course, setCourse] = useState({
        name: '',
        description: '',
        credits: 0,
    });
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetch(`${API_URLS.courses}/course/${id}`)
                .then(response => response.json())
                .then(data => setCourse(data))
                .catch(error => console.error('Error fetching course:', error));
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URLS.courses}/course/${id}` : `${API_URLS.courses}/course`;
    
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(course),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        setErrors(errorData); // Actualizar los errores con los datos del backend
                        throw new Error(errorData.message || "Something went wrong");
                    });
                }
                return response.json();
            })
            .then(data => {
                navigate('/course/list'); // Redirigir a la lista de cursos
            })
            .catch(error => {
                console.error('Error submitting course:', error);
                setErrors(prevErrors => ({
                    ...prevErrors,
                    globalError: error.message
                }));
            });
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse({
            ...course,
            [name]: value,
        });
    };

    const handleCancel = () => {
        // Confirmar si el usuario está seguro de cancelar sin guardar
        const confirmCancel = window.confirm("Are you sure you want to leave without saving?");
        if (confirmCancel) {
            navigate('/course/list'); 
        }
    };
    

    return (
        <div className="form-container">
            {errors.globalError && (
                <div className="notification">{errors.globalError}</div>
            )}
            <h2>{id ? 'Edit Course' : 'Add Course'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={course.name}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="error">{errors.name}</div>}
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={course.description}
                        onChange={handleChange}
                    />
                    {errors.description && <div className="error">{errors.description}</div>}
                </div>
                <div>
                    <label>Credits:</label>
                    <input
                        type="number"
                        name="credits"
                        value={course.credits}
                        onChange={handleChange}
                    />
                    {errors.credits && <div className="error">{errors.credits}</div>}
                </div>
                <button type="submit">{id ? 'Update' : 'Add'}</button>
                <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button> {/* Botón de Cancelar */}
            </form>
        </div>
    );
};

export default CourseForm;
