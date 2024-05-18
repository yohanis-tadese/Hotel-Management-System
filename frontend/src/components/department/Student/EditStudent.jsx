import { useState, useEffect } from "react";
import Button from "../../../ui/Button";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import Modal from "../../../ui/Modal";
import CancelButton from "../../../ui/CancelButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StudentForm } from "../../FormField";
import departmentService from "../../../services/department.service";
import studentService from "../../../services/student.service";
import styled from "styled-components";
import { useAuth } from "../../../context/AuthContext";

// Styled component for the select container
const SelectContainer = styled.div`
  input {
    width: 100%;
    padding: 0.7rem;
    border: 1px solid #ccc;
    background-color: var(--color-grey-50);
    border-radius: 5px;
    font-size: 1.4rem;
  }
`;

const EditStudent = ({ studentId, initialData, onCancel, fetchStudents }) => {
  const { userId } = useAuth();
  const [formData, setFormData] = useState(initialData || {});
  const [modalVisible, setModalVisible] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch department IDs when component mounts
    const fetchDepartmentIds = async () => {
      try {
        await departmentService.getDepartmentIds();

        setFormData((prevData) => ({
          ...prevData,
          department_id: userId,
        }));
      } catch (error) {
        console.error("Error fetching department IDs:", error.message);
      }
    };

    fetchDepartmentIds();
  }, [userId]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await studentService.getStudent(studentId);
        if (response.ok) {
          const responseData = await response.json();
          setFormData(responseData.students);
        } else {
          console.error("Failed to fetch student:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };
    if (!initialData) {
      fetchStudentData();
    }
  }, [initialData, studentId]);

  const handleCloseModal = () => {
    setModalVisible(false);
    onCancel(); // Call onCancel function provided by parent
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.first_name) {
      newErrors.first_name = "First Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.first_name)) {
      newErrors.first_name = "First Name must contain only letters and spaces";
    } else if (formData.first_name.length < 4) {
      newErrors.first_name = "First Name must be at least 4 characters long";
    }

    if (!formData.last_name) {
      newErrors.last_name = "Last Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.last_name)) {
      newErrors.last_name = "Last Name must contain only letters and spaces";
    } else if (formData.last_name.length < 4) {
      newErrors.last_name = "Last Name must be at least 4 characters long";
    }

    // Validate phone number
    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required";
      valid = false;
    }

    // Validate contact email
    if (!formData.contact_email) {
      newErrors.contact_email = "Contact email is required";
      valid = false;
    } else if (!isValidEmail(formData.contact_email)) {
      newErrors.contact_email = "Invalid email format";
      valid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }
    // Validate GPA
    if (!formData.gpa) {
      newErrors.gpa = "Student GPA is required";
      valid = false;
    } else if (parseFloat(formData.gpa) < 0 || parseFloat(formData.gpa) > 4) {
      newErrors.gpa = "Student GPA must be between 0 and 4";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const isValidEmail = (email) => {
    // Email validation logic
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await studentService.updateStudent(studentId, formData);

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      if (response.status === 200) {
        setErrors({});
        toast.success(responseData.message, { autoClose: 1000 });
      }

      setModalVisible(false);
      setTimeout(() => {
        fetchStudents();
      }, 1000);
    } catch (error) {
      console.error("Error updating student:", error); // Log the error
      toast.error("Error updating student.", { autoClose: 2000 });
    }
  };

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    let newValue = value;

    // Validate first name and last name (only allow letters and spaces)
    if (id === "first_name" || id === "last_name") {
      newValue = value.replace(/[^A-Za-z\s]/g, "");
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }

    // Validate phone number (only allow numeric characters)
    if (id === "phone_number") {
      // Validate phone number (allow numeric characters and '+')
      if (id === "phone_number") {
        // Remove all non-digit characters except '+'
        newValue = value.replace(/[^\d+]/g, "");

        // Ensure '+' sign is at the start and only once
        if (newValue.startsWith("+")) {
          // Remove any additional '+' signs except the first one
          newValue = "+" + newValue.slice(1).replace(/\+/g, "");
        } else {
          // If '+' is not at the start, remove all occurrences of '+'
          newValue = newValue.replace(/\+/g, "");
        }
        newValue = newValue.substring(0, 13);
      }
    }

    if (type === "number" && id === "gpa") {
      const maxAllowed = 4;
      if (
        value === "" ||
        (parseFloat(value) >= 0 && parseFloat(value) <= maxAllowed)
      ) {
        setFormData((prevData) => ({
          ...prevData,
          [id]: newValue,
        }));
        return;
      } else {
        return; // Don't update state if the value is out of range
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [id]: newValue,
    }));
  };

  return (
    <div>
      {modalVisible && (
        <Modal onClick={handleCloseModal}>
          <Form onSubmit={handleSubmit}>
            {StudentForm.map((field) => (
              <FormRow
                key={field.id}
                label={field.label}
                error={errors[field.id]}
              >
                {field.id === "department_id" ? (
                  <SelectContainer>
                    <Input
                      type="text"
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={handleChange}
                      disabled // Prevent editing
                    />
                  </SelectContainer>
                ) : (
                  <Input
                    type={field.type}
                    id={field.id}
                    autoComplete={field.autoComplete}
                    value={formData[field.id] || ""}
                    onChange={handleChange}
                  />
                )}
              </FormRow>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "3rem",
                marginTop: "2rem",
              }}
            >
              <CancelButton onClick={handleCloseModal}>Cancel</CancelButton>
              <Button type="submit">Update Student</Button>
            </div>
          </Form>
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

export default EditStudent;
