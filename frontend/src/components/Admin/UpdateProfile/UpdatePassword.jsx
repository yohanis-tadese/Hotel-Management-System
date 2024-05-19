import { useState } from "react";
import Input from "../../../ui/Input";
import FormRow from "../../../ui/FormRow";
import adminService from "../../../services/admin.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CancelButton from "../../../ui/CancelButton";
import Form from "./../../../ui/Form";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../ui/Button";

function UpdatePassword() {
  const { userId } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordView = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const errors = {};
    if (formData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters long";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await adminService.changePassword(
        userId,
        formData.oldPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      if (response) {
        if (response.status === 200) {
          const data = await response.json();
          toast.success(data.message, { autoClose: 1000 });

          setTimeout(() => {
            setFormData({
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          }, 1000);
        } else {
          const data = await response.json();
          toast.error(data.message, { autoClose: 1000 });
        }
      }
    } catch (error) {
      if (error.message === "Old password is incorrect") {
        toast.error(error.message, { autoClose: 1000 });
      }
      console.error("Error updating password:", error);
      toast.error("Failed to update password", { autoClose: 1000 });
    }
  };

  const handleCancel = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <>
      <Form onSubmit={handlePasswordChange}>
        <FormRow label="Old Password" error={errors?.password}>
          <Input
            type={showPassword ? "text" : "password"}
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow label="New Password" error={errors?.password}>
          <Input
            type={showPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow label="Confirm Password" error={errors?.confirmPassword}>
          <Input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
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
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </CancelButton>
          <Button type="submit">Change Password</Button>
        </FormRow>
      </Form>
      <ToastContainer />
    </>
  );
}

export default UpdatePassword;
