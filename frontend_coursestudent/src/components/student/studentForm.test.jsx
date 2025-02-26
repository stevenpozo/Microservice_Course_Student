import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentForm from './StudentForm';

// Mocks
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

const mockStudent = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  birthday: '2000-01-01',
  phone_number: '+1234567890',
};

describe('StudentForm', () => {
  const mockNavigate = vi.fn();
  const mockFetch = vi.spyOn(window, 'fetch');
  
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render add form correctly', () => {
    useParams.mockReturnValue({});
    render(<StudentForm />);
    
    expect(screen.getByText('Add Student')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('should render edit form with student data', async () => {
    useParams.mockReturnValue({ id: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStudent),
    });
    
    render(<StudentForm />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByText('Edit Student')).toBeInTheDocument();
    });
  });

  it('should submit new student data', async () => {
    useParams.mockReturnValue({});
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });
    
    render(<StudentForm />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText('Birthday:'), { target: { value: '2005-05-05' } });
    fireEvent.change(screen.getByLabelText('Phone Number:'), { target: { value: '+987654321' } });
    
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8002/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
          birthday: '2005-05-05',
          phone_number: '+987654321',
        }),
      });
      expect(mockNavigate).toHaveBeenCalledWith('/students/list');
    });
  });

  it('should handle validation errors', async () => {
    useParams.mockReturnValue({});
    const mockErrors = {
      first_name: 'First name is required',
      email: 'Invalid email format',
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockErrors),
    });

    render(<StudentForm />);
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  it('should handle cancel with confirmation', async () => {
    useParams.mockReturnValue({});
    window.confirm = vi.fn(() => true);
    
    render(<StudentForm />);
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/students/list');
  });

  it('should show notification on error', async () => {
    useParams.mockReturnValue({});
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<StudentForm />);
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should update existing student', async () => {
    useParams.mockReturnValue({ id: '1' });
    mockFetch.mockResolvedValueOnce({  // Mock GET request
      ok: true,
      json: () => Promise.resolve(mockStudent),
    });
    mockFetch.mockResolvedValueOnce({  // Mock PUT request
      ok: true,
      json: () => Promise.resolve({}),
    });
    
    render(<StudentForm />);
    
    await waitFor(() => screen.getByDisplayValue('John'));
    
    fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'Johnny' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8002/student/1',
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });
});