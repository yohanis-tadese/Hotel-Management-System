import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import depResultService from "../../../services/dept.results.service";
import Modal from "./Modal";

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
  background: var(--color-grey-100);
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

const UpdateResults = ({ studentId, onClose }) => {
  const [formData, setFormData] = useState({
    advisor_score: "",
    presentation_score: "",
    documentation_score: "",
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await depResultService.getResultsByStudentId(
          studentId
        );
        if (response) {
          setFormData(response[0]);
        } else {
          console.error("Failed to fetch student data:", response);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await depResultService.updateResultsByStudentId(studentId, formData);
      toast.success("Results updated successfully!", { autoClose: 1000 });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error("Error During updating results:", { autoClose: 1000 });
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
            <h2 style={{ textAlign: "center" }}>
              University Evaluation Result Form (60%)
            </h2>
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
                  required
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
                  required
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
                  required
                />
              </div>
            </InputContainer>

            <ButtonContainer>
              <Button type="submit">Update</Button>
              <CancelButton onClick={onClose}>Cancel</CancelButton>
            </ButtonContainer>
          </ContentContainer>
          <ToastContainer />
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateResults;
