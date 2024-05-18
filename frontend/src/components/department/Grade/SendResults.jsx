import React, { useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import depResultService from "../../../services/dept.results.service";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 30px;
`;

const ContentContainer = styled.div`
  max-height: 90vh;
  overflow-y: auto;
`;

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-bottom: 10px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--color-grey-100);
  width: 95%;
  margin-left: 4px;
  background: var(--color-grey-50);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 8px 20px;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 17px;
`;

const CancelButton = styled(Button)`
  background-color: red;
`;

const SendResults = ({ studentId, departmentId, onClose }) => {
  const [formData, setFormData] = useState({
    student_id: studentId,
    department_id: departmentId,
    advisor_score: "",
    presentation_score: "",
    documentation_score: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Extract the maxAllowed value from the maxAllowed prop of the input element
    const maxAllowed = parseInt(e.target.getAttribute("maxAllowed"));

    // Check if the input element is a number type
    if (e.target.type === "number") {
      // Check if the value is a valid number within the allowed range
      if (
        value === "" ||
        (parseFloat(value) >= 0 && parseFloat(value) <= maxAllowed)
      ) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      // For non-number and non-text inputs, update form data directly
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await depResultService.saveResults(formData);
      toast.success("Form submitted successfully!", { autoClose: 1000 });
      setTimeout(() => {
        console.log("Results saved successfully", formData);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  return (
    <Modal onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <div
          style={{
            border: "1px solid green",
            padding: "25px",
            margin: "10px 5px 30px 5px",
          }}
        >
          <ContentContainer>
            <h2>University Evaluation Result Form (60%)</h2>
            <hr />

            <InputContainer>
              <div>
                <Label htmlFor="advisor_score">Advisor Score</Label>
                <Input
                  type="number"
                  id="advisor_score"
                  name="advisor_score"
                  value={formData.advisor_score}
                  onChange={handleChange}
                  maxAllowed={10}
                />
              </div>
              <div>
                <Label htmlFor="presentation_score">Presentation Score</Label>
                <Input
                  type="number"
                  id="presentation_score"
                  name="presentation_score"
                  value={formData.presentation_score}
                  onChange={handleChange}
                  maxAllowed={25}
                />
              </div>
              <div>
                <Label htmlFor="documentation_score">Documentation Score</Label>
                <Input
                  type="number"
                  id="documentation_score"
                  name="documentation_score"
                  value={formData.documentation_score}
                  onChange={handleChange}
                  maxAllowed={25}
                />
              </div>
            </InputContainer>
            <ButtonContainer>
              <Button type="submit">Send</Button>
              <CancelButton onClick={onClose}>Cancel</CancelButton>
            </ButtonContainer>
          </ContentContainer>
        </div>
      </Form>
      <ToastContainer />
    </Modal>
  );
};

export default SendResults;
