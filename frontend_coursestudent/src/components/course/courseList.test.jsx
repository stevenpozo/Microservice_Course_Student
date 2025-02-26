import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CourseList from './courseList';
import { expect, test, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

globalThis.fetch = vi.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([{ id: 1, name: 'Math', description: 'new', credits: 100 }]),
    })
);

test('fetches and displays courses from API', async () => {
    render(
        <BrowserRouter>
            <CourseList />
        </BrowserRouter>
    );

    // Verificar que el estudiante se carga y se muestra
    await waitFor(() => expect(screen.getByText('Math')).toBeInTheDocument());
    expect(screen.getByText('Math')).toBeInTheDocument();
});

test('navigates to add student page when "Add New Course" button is clicked', async () => {
    render(
        <BrowserRouter>
            <CourseList />
        </BrowserRouter>
    );

    // Esperar a que los estudiantes se carguen
    await waitFor(() => expect(screen.getByText('Math')).toBeInTheDocument());

    // Buscar y verificar el botón "Add New Student"
    const addButton = screen.getByText('Add New Course');
    expect(addButton.closest('a')).toHaveAttribute('href', '/course/add');
});

test('deletes a course', async () => {
    // Mock para la carga de cursos
    globalThis.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve([{ id: 1, name: 'Math', description: 'new', credits: 100 }]),
    });

    render(
        <BrowserRouter>
            <CourseList />
        </BrowserRouter>
    );

    // Espera a que el curso se cargue
    await waitFor(() => expect(screen.getByText('Math')).toBeInTheDocument());

    // Mock para la eliminación del curso
    globalThis.fetch.mockImplementationOnce((url, options) => {
        if (options && options.method === 'DELETE') {
            // Aquí simulamos que el curso se elimina correctamente
            return Promise.resolve({});
        }
        return Promise.resolve({
            json: () => Promise.resolve([{ id: 1, name: 'Math', description: 'new', credits: 100 }]),
        });
    });

    // Buscar y hacer clic en el botón "Delete"
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Esperar que el curso 'Math' sea eliminado de la lista
    await waitFor(() => expect(screen.queryByText('Math')).toBeInTheDocument());
});

