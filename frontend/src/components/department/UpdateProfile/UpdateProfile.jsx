import { useState, useEffect } from "react";
import Button from "../../../ui/Button";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CancelButton from "../../../ui/CancelButton";
import { useAuth } from "../../../context/AuthContext";
import departmentService from "../../../services/department.service";

function UpdateProfile() {
  const { userId } = useAuth();

  const [formData, setFormData] = useState({
    department_name: "",
    phone_number: "",
    contact_email: "",
    office_location: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});

  const fetchDepartmentData = async () => {
    try {
      const response = await departmentService.getDepartments(userId);

      if (!response.ok) {
        throw new Error("Failed to fetch department data");
      }
      const departmentData = await response.json();
      const department = departmentData.department;

      setFormData(department);
    } catch (error) {
      console.error("Error fetching department data:", error);
      toast.error("Error fetching department data", { autoClose: 2000 });
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      photo: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.department_name) {
      errors.department_name = "Department Name is required";
    }
    setErrors(errors);

    // If there are no errors, submit the form
    if (Object.keys(errors).length === 0) {
      try {
        const formDataWithFile = new FormData();
        formDataWithFile.append("department_name", formData.department_name);
        formDataWithFile.append("phone_number", formData.phone_number);
        formDataWithFile.append("contact_email", formData.contact_email);
        formDataWithFile.append("office_location", formData.office_location);
        if (formData.photo) {
          formDataWithFile.append("photo", formData.photo);
        }

        // Update department information
        const updateResponse = await departmentService.updateDepartmentProfile(
          userId,
          formDataWithFile
        );

        if (!updateResponse) {
          throw new Error("Failed to update department profile");
        }

        // Show success toast message
        toast.success("Profile updated successfully", {
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Error updating department profile:", error);
        // Show error toast message
        toast.error("Failed to update department profile", { autoClose: 1000 });
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Department Name" error={errors?.department_name}>
        <Input
          type="text"
          id="department_name"
          name="department_name"
          value={formData.department_name}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow label="Phone Number" error={errors?.phone_number}>
        <Input
          type="text"
          id="phone_number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.contact_email}>
        <Input
          type="contact_email"
          id="contact_email"
          name="contact_email"
          autoComplete="off"
          value={formData.contact_email}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow label="Office Location" error={errors?.office_location}>
        <Input
          type="text"
          id="office_location"
          name="office_location"
          value={formData.office_location}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow label="Profile Photo">
        <Input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
        />
      </FormRow>

      <FormRow>
        <CancelButton
          variant="secondary"
          type="reset"
          onClick={() =>
            setFormData({
              department_name: "",
              phone_number: "",
              contact_email: "",
              office_location: "",
              photo: null,
            })
          }
        >
          Cancel
        </CancelButton>
        <Button type="submit">Update Profile</Button>
      </FormRow>
      <ToastContainer />
    </Form>
  );
}

export default UpdateProfile;
