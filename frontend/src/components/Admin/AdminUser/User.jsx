import { useState } from "react";
import Button from "../../../ui/Button";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CancelButton from "../../../ui/CancelButton";
import adminService from "./../../../services/admin.service";

function SignupForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validate first name and last name (only allow letters and spaces)
    if (name === "first_name" || name === "last_name") {
      newValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    // Validation logic
    if (!formData.first_name) {
      errors.first_name = "First Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.first_name)) {
      errors.first_name = "First Name must contain only letters and spaces";
    } else if (formData.first_name.length < 4) {
      errors.first_name = "First Name must be at least 4 characters long";
    }

    if (!formData.last_name) {
      errors.last_name = "Last Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.last_name)) {
      errors.last_name = "Last Name must contain only letters and spaces";
    } else if (formData.last_name.length < 4) {
      errors.last_name = "Last Name must be at least 4 characters long";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password needs to be at least 6 characters long";
    }
    setErrors(errors);

    // If there are no errors, submit the form
    if (Object.keys(errors).length === 0) {
      try {
        // Send a request to create the admin
        const adminResponse = await adminService.createAdmin(formData);

        if (!adminResponse.ok) {
          toast.error("Failed to create admin", { autoClose: 2000 });
          return;
        }

        // Check if the response is valid JSON
        const responseData = await adminResponse.json();
        if (!adminResponse.ok) {
          // If the response is not JSON, display an error message
          throw new Error(responseData.error || "Failed to create admin");
        }

        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        });
        toast.success(responseData.message, { autoClose: 2000 });
      } catch (error) {
        console.error("Error creating admin:", error);
        toast.error(error.message || "Error creating admin", {
          autoClose: 2000,
        });
      }
    }
  };

  const togglePasswordView = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="First Name" error={errors?.first_name}>
        <Input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow label="Last Name" error={errors?.last_name}>
        <Input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email}>
        <Input
          type="email"
          id="email"
          name="email"
          autoComplete="on"
          value={formData.email}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow label="Password (min 6 characters)" error={errors?.password}>
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            padding: "2px",
            borderRadius: "7px",
          }}
        >
          <input
            type="checkbox"
            checked={showPassword}
            onChange={togglePasswordView}
            style={{ marginRight: "10px", cursor: "pointer" }}
          />
          <span>Show Password</span>
        </label>
      </FormRow>

      <FormRow>
        <CancelButton
          variant="secondary"
          type="reset"
          onClick={() =>
            setFormData({
              first_name: "",
              last_name: "",
              email: "",
              password: "",
            })
          }
        >
          Cancel
        </CancelButton>
        <Button type="submit">Create new user</Button>
      </FormRow>
      <ToastContainer />
    </Form>
  );
}

export default SignupForm;
