import React, { useEffect, useState } from "react";
import Button from "../../../ui/Button";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import CancelButton from "../../../ui/CancelButton";
import Modal from "../../../ui/Modal";
import studentService from "../../../services/student.service";
import departmentService from "../../../services/department.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";
import styled from "styled-components";

// Styled component for the select container
const SelectContainer = styled.div`
  select {
    width: 100%;
    padding: 0.7rem;
    border: 1px solid #ccc;
    background-color: var(--color-grey-50);
    border-radius: 5px;
    font-size: 1.4rem;
  }

  /* Style the selected option */
  select option:checked {
    background-color: #007bff; /* Change the background color */
  }
`;

const CreateStudent = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    contact_email: "",
    gpa: "",
    password: "",
    department_id: "",
  });

  const { userId } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [departmentIds, setDepartmentIds] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch department IDs when component mounts
    const fetchDepartmentIds = async () => {
      try {
        const ids = await departmentService.getDepartmentIds();

        // Set the department ID to the user's department ID
        setFormData((prevData) => ({
          ...prevData,
          department_id: userId,
        }));

        setDepartmentIds(ids); // Set department names in the state
      } catch (error) {
        console.error("Error fetching department IDs:", error.message);
      }
    };

    fetchDepartmentIds();
  }, [userId]);

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

    // Validate department ID
    if (!formData.department_id) {
      newErrors.department_id = "Department is required";
      valid = false;
    }

    // Validate GPA
    if (!formData.gpa) {
      newErrors.gpa = "Student GPA is required";
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
      // Send post request to create student
      const response = await studentService.createStudent(formData);

      if (response.status === 400) {
        // If error occurs
        const responseData = await response.json();
        toast.error(responseData.error, { autoClose: 2000 });
        return;
      }

      if (!response.ok) {
        toast.error("Failed to create student", { autoClose: 2000 });
        return;
      }

      const responseData = await response.json();
      if (response.status === 200) {
        setFormData({
          first_name: "",
          last_name: "",
          phone_number: "",
          contact_email: "",
          gpa: "",
          password: "",
          department_id: "",
        });
        setErrors({});
        toast.success("Student created successfully", { autoClose: 1000 });
      }

      setModalVisible(false);
    } catch (error) {
      toast.error(
        "Error creating student:",
        {
          autoClose: 1000,
        },
        error.message
      );
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
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

    setFormData((prevData) => ({
      ...prevData,
      [id]: newValue,
    }));
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setErrors({});
  };

  return (
    <div>
      <Button size="medium" onClick={() => setModalVisible(true)}>
        Add New
      </Button>

      {modalVisible && (
        <Modal onClick={handleCloseModal}>
          <Form onSubmit={handleSubmit}>
            <FormRow label="First Name" error={errors.first_name}>
              <Input
                type="text"
                id="first_name"
                autoComplete="on"
                value={formData.first_name}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow label="Last Name" error={errors.last_name}>
              <Input
                type="text"
                id="last_name"
                autoComplete="on"
                value={formData.last_name}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow label="Phone Number" error={errors.phone_number}>
              <Input
                type="text"
                id="phone_number"
                autoComplete="on"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow label="Contact Email" error={errors.contact_email}>
              <Input
                type="text"
                id="contact_email"
                autoComplete="on"
                value={formData.contact_email}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow label="Student GPA" error={errors.gpa}>
              <Input
                type="number"
                id="gpa"
                autoComplete="off"
                value={formData.gpa}
                onChange={handleChange}
              />
            </FormRow>
            <FormRow label="Password" error={errors.password}>
              <Input
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
            </FormRow>
            {/* <FormRow label="Department" error={errors.department_id}>
              <Input
                type="text"
                id="department_id"
                value={formData.department_id}
                onChange={handleChange}
                disabled
              />
            </FormRow> */}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "3rem",
                marginTop: "2rem",
              }}
            >
              <CancelButton onClick={handleCloseModal}>Cancel</CancelButton>
              <Button>Create Student</Button>
            </div>
          </Form>
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

export default CreateStudent;
