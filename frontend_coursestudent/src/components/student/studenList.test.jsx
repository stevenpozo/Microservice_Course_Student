import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import StudentList from './StudentList';
import { expect, test, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

globalThis.fetch = vi.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([{ id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' }]),
    })
);

test('fetches and displays students from API', async () => {
    render(
        <BrowserRouter>
            <StudentList />
        </BrowserRouter>
    );

    // Verificar que el estudiante se carga y se muestra
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
});

test('navigates to add student page when "Add New Student" button is clicked', async () => {
    render(
        <BrowserRouter>
            <StudentList />
        </BrowserRouter>
    );

    // Esperar a que los estudiantes se carguen
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

    // Buscar y verificar el botón "Add New Student"
    const addButton = screen.getByText('Add New Student');
    expect(addButton.closest('a')).toHaveAttribute('href', '/students/add');
});

test('deletes a student', async () => {
    // Mock del fetch para la eliminación
    globalThis.fetch.mockImplementationOnce((url, options) => {
        if (options && options.method === 'DELETE') {
            return Promise.resolve({});
        }
        return Promise.resolve({
            json: () => Promise.resolve([{ id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' }]),
        });
    });

    render(
        <BrowserRouter>
            <StudentList />
        </BrowserRouter>
    );

    // Esperar a que el estudiante se cargue
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

    // Buscar y hacer clic en el botón "Delete"
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Comprobar que el estudiante se elimina de la lista
    await waitFor(() => expect(screen.queryByText('John Doe')).not.toBeInTheDocument());
});
