import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act} from "@testing-library/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CourseStudentList from "./courseStudentList";

// Mocks
vi.mock("axios");
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

const mockCourses = [
  { id: 1, name: "Math", description: "Mathematics 101" },
  { id: 2, name: "Physics", description: "Physics Fundamentals" },
];

const mockEnrolledStudents = [
  { id: 1, first_name: "John", last_name: "Doe", email: "john@example.com" },
];

const mockNotEnrolledStudents = [
  { id: 2, first_name: "Jane", last_name: "Doe", email: "jane@example.com" },
];

describe("CourseStudentList", () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    axios.get.mockImplementation((url) => {
      if (url.includes("/course/1/students")) {
        return Promise.resolve({ data: mockEnrolledStudents });
      }
      if (url.includes("/students/not-enrolled")) {
        return Promise.resolve({ data: mockNotEnrolledStudents });
      }
      return Promise.resolve({ data: mockCourses });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should load courses on mount", async () => {
    render(<CourseStudentList />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("http://localhost:8003/course");
    });
    expect(screen.getByText("Math")).toBeInTheDocument();
    expect(screen.getByText("Physics")).toBeInTheDocument();
  });


  it("should remove student successfully", async () => {
    axios.delete.mockResolvedValue({ status: 200 });
    render(<CourseStudentList />);
    
    // Open student list
    const viewButtons = await screen.findAllByText("View Participants");
    fireEvent.click(viewButtons[0]);
    
    // Click remove
    const removeButton = await screen.findByText("Remove");
    await act(async () => {
      fireEvent.click(removeButton);
    });
    
    expect(axios.delete).toHaveBeenCalledWith(
      "http://localhost:8003/course/1/students/1"
    );
  });

  it("should navigate to main menu", async () => {
    render(<CourseStudentList />);
    const backButton = screen.getByText("Back to Main Menu");
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});