import { useState, useEffect } from "react";
import Button from "../../../ui/Button";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CancelButton from "../../../ui/CancelButton";
import { useAuth } from "../../../context/AuthContext";
import companyService from "../../../services/company.service";

function UpdateProfile() {
  const { userId } = useAuth();

  const [formData, setFormData] = useState({
    company_name: "",
    phone_number: "",
    contact_email: "",
    location: "",
    industry_sector: "",
    website: "",
    photo: "default.jpg",
  });

  const [errors, setErrors] = useState({});

  const fetchCompanyData = async () => {
    try {
      const response = await companyService.getCompany(userId);

      if (!response.ok) {
        throw new Error("Failed to fetch admin data");
      }
      const companyData = await response.json();
      const company = companyData.company;

      setFormData(company);
    } catch (error) {
      console.error("Error fetching company data:", error);
      toast.error("Error fetching company data", { autoClose: 2000 });
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validate first name and last name (only allow letters and spaces)
    if (name === "company_name") {
      newValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
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
    if (!formData.company_name) {
      errors.company_name = "Company Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.company_name)) {
      errors.company_name = "Company Name must contain only letters and spaces";
    } else if (formData.company_name.length < 4) {
      errors.company_name = "Company Name must be at least 4 characters long";
    }

    setErrors(errors);

    // If there are no errors, submit the form
    if (Object.keys(errors).length === 0) {
      try {
        const formDataWithFile = new FormData();
        formDataWithFile.append("company_name", formData.company_name);
        formDataWithFile.append("phone_number", formData.phone_number);
        formDataWithFile.append("contact_email", formData.contact_email);
        formDataWithFile.append("location", formData.location);
        formDataWithFile.append("industry_sector", formData.industry_sector);
        formDataWithFile.append("website", formData.website);
        if (formData.photo) {
          formDataWithFile.append("photo", formData.photo);
        }

        // Update admin information
        const updateResponse = await companyService.updateCompanyProfile(
          userId,
          formDataWithFile
        );

        if (!updateResponse.ok) {
          throw new Error("Failed to update admin");
        }

        // Show success toast message
        toast.success("Profile updated successfully", {
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Error updating admin profile:", error);
        // Show error toast message
        toast.error("Failed to update admin profile", { autoClose: 1000 });
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Company Name" error={errors?.company_name}>
        <Input
          type="text"
          id="company_name"
          name="company_name"
          value={formData.company_name}
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

      <FormRow label="Location" error={errors?.location}>
        <Input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow label="Industry Sector" error={errors?.industry_sector}>
        <Input
          type="text"
          id="industry_sector"
          name="industry_sector"
          value={formData.industry_sector}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow label="Website" error={errors?.website}>
        <Input
          type="text"
          id="website"
          name="website"
          value={formData.website}
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
              company_name: "",
              phone_number: "",
              contact_email: "",
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
