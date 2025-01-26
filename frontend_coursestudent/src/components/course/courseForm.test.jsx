import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseForm from './courseForm';

// Mocks
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

const mockCourse = {
  id: 1,
  name: 'Mathematics',
  description: 'Advanced Algebra',
  credits: 4
};

describe('CourseForm', () => {
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
    render(<CourseForm />);
    
    expect(screen.getByText('Add Course')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/credits/i)).toBeInTheDocument();
  });

  it('should render edit form with course data', async () => {
    useParams.mockReturnValue({ id: '1' });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCourse),
    });
    
    render(<CourseForm />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Mathematics')).toBeInTheDocument();
      expect(screen.getByDisplayValue('4')).toBeInTheDocument();
      expect(screen.getByText('Edit Course')).toBeInTheDocument();
    });
  });

  it('should submit new course data', async () => {
    useParams.mockReturnValue({});
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });
    
    render(<CourseForm />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/name/i), { 
      target: { value: 'Physics' } 
    });
    fireEvent.change(screen.getByLabelText(/description/i), { 
      target: { value: 'Basic Physics Principles' } 
    });
    fireEvent.change(screen.getByLabelText(/credits/i), { 
      target: { value: '3' } 
    });
    
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8003/course',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'Physics',
            description: 'Basic Physics Principles',
            credits: 3
          })
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/course/list');
    });
  });

  it('should handle validation errors', async () => {
    useParams.mockReturnValue({});
    const mockErrors = {
      name: 'Name is required',
      credits: 'Credits must be between 1 and 5'
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockErrors),
    });

    render(<CourseForm />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Credits must be between 1 and 5')).toBeInTheDocument();
    });
  });

  it('should handle cancel with confirmation', async () => {
    useParams.mockReturnValue({});
    window.confirm = vi.fn(() => true);
    
    render(<CourseForm />);
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to leave without saving?"
    );
    expect(mockNavigate).toHaveBeenCalledWith('/course/list');
  });

  it('should show global error notification', async () => {
    useParams.mockReturnValue({});
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<CourseForm />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should update existing course', async () => {
    useParams.mockReturnValue({ id: '1' });
    mockFetch.mockResolvedValueOnce({  // Mock GET
      ok: true,
      json: () => Promise.resolve(mockCourse),
    });
    mockFetch.mockResolvedValueOnce({  // Mock PUT
      ok: true,
      json: () => Promise.resolve({}),
    });
    
    render(<CourseForm />);
    
    await waitFor(() => screen.getByDisplayValue('Mathematics'));
    
    fireEvent.change(screen.getByLabelText(/name/i), { 
      target: { value: 'Advanced Mathematics' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8003/course/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            ...mockCourse,
            name: 'Advanced Mathematics'
          })
        })
      );
    });
  });
});