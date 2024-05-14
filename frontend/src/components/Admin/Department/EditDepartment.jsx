import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../../ui/Button";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import Modal from "../../../ui/Modal";
import CancelButton from "../../../ui/CancelButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DepartmentForm } from "../../FormField";
import departmentService from "../../../services/department.service";

const EditDepartment = ({
  departmentId,
  initialData,
  onCancel,
  onDepartmentUpdated,
}) => {
  const [formData, setFormData] = useState({});
  const [modalVisible, setModalVisible] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await departmentService.getDepartments(departmentId);
        console.log(response);
        if (response.ok) {
          const responseData = await response.json();
          setFormData(responseData.department);
        } else {
          console.error("Failed to fetch department:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };

    if (initialData) {
      setFormData(initialData);
    } else {
      fetchDepartmentData();
    }
  }, [departmentId, initialData]);

  const handleCloseModal = () => {
    setModalVisible(false);
    onCancel(); // Call onCancel function provided by parent
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.department_name) {
      newErrors.department_name = "Department name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.department_name)) {
      newErrors.department_name =
        "Department name must contain only letters and spaces";
    } else if (formData.department_name.length < 3) {
      newErrors.department_name =
        "Department name must be at least 3 characters long";
    }

    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (
      formData.phone_number &&
      !/^\+?\d{10,12}$/.test(formData.phone_number)
    ) {
      newErrors.phone_number = "Phone number must be between 10 and 12 digits";
    }

    // Validate contact email
    if (!formData.contact_email) {
      newErrors.contact_email = "Contact email is required";
    } else if (!isValidEmail(formData.contact_email)) {
      newErrors.contact_email = "Invalid email format";
    }

    // Validate office location
    if (!formData.office_location) {
      newErrors.office_location = "Office location is required";
    }

    setErrors(newErrors);

    // If there are no errors, return true
    return Object.keys(newErrors).length === 0;
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
      const response = await departmentService.updateDepartment(
        departmentId,
        formData
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      if (response.status === 200) {
        setErrors({});
        toast.success(responseData.message, { autoClose: 700 });
      }

      setModalVisible(false);
      setTimeout(onDepartmentUpdated, 1000);
    } catch (error) {
      console.error("Error updating department:", error); // Log the error
      toast.error("Error updating department.", { autoClose: 2000 });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    let newValue = value;

    // Validate department name (only allow letters and spaces)
    if (id === "department_name") {
      newValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    // Validate department name (only allow letters and spaces)
    if (id === "department_name") {
      newValue = value.replace(/[^A-Za-z\s]/g, "");
    }

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

    setFormData({
      ...formData,
      [id]: newValue,
    });
  };

  return (
    <div>
      {modalVisible && (
        <Modal onClick={handleCloseModal}>
          <Form onSubmit={handleSubmit}>
            {DepartmentForm.map((field) => (
              <FormRow
                key={field.id}
                label={field.label}
                error={errors[field.id]}
              >
                <Input
                  type={field.type}
                  id={field.id}
                  autoComplete={field.autoComplete}
                  value={formData[field.id] || ""}
                  onChange={handleChange}
                />
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
              <Button type="submit">Update Department</Button>
            </div>
          </Form>
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

EditDepartment.propTypes = {
  departmentId: PropTypes.string.isRequired,
  initialData: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onDepartmentUpdated: PropTypes.func.isRequired,
};

export default EditDepartment;
