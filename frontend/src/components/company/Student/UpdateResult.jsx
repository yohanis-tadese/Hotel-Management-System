import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import resultService from "../../../services/result.service";
import Textarea from "../../../ui/Textarea";

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
  width: 98%;
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
  const [studentData, setStudentData] = useState(null);
  const [formData, setFormData] = useState({
    commitment: "",
    courtesy: "",
    conduct: "",
    perseverance: "",
    teamwork: "",
    professional_ethics: "",
    creativity: "",
    technical_knowledge: "",
    efficiency: "",
    professional_comments: "",
    attendance: "",
    advisor_name: "",
    department_assigned: "",
    attachment_from_date: "",
    attachment_to_date: "",
    area_of_work: "",
    total_hours: "",
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await resultService.getResultsByStudentId(studentId);
        console.log("Response:", response[0]);

        if (response && response[0]) {
          const result = response[0];
          setStudentData(result);
          setFormData(result);
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

    const regex = /^[a-zA-Z_$ ]*$/;
    const maxAllowed = parseInt(e.target.getAttribute("maxAllowed"));

    if (e.target.type === "number") {
      if (
        value === "" ||
        (parseFloat(value) >= 0 && parseFloat(value) <= maxAllowed)
      ) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (e.target.type === "text") {
      if (regex.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await resultService.updateResultsByStudentId(studentId, formData);
      toast.success("Results updated successfully!", { autoClose: 1000 });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error("Error updating results:", error);
    }
  };

  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <Modal onClose={onClose}>
      <ContentContainer>
        <h2
          style={{
            textAlign: "center",
            background: "var(--color-grey-50)",
            fontSize: "25px",
            borderRadius: "6px",
            padding: "13px",
            width: "90%",
            margin: "auto",
          }}
        >
          Work Performance Assessment Form (40%)
        </h2>

        <br />

        <hr />
        <Form onSubmit={handleSubmit}>
          <h1>Personality and Behavioral Traits (15%)</h1>
          <div
            style={{
              border: "1px solid green",
              padding: "25px",
              margin: "10px 5px 30px 5px",
            }}
          >
            <br />
            <InputContainer>
              <div>
                <Label htmlFor="commitment" maxAllowed="3">
                  Commitment (Attitude towards work showing enthusiasm and
                  interest) 3%
                </Label>
                <Input
                  type="number"
                  id="commitment"
                  name="commitment"
                  value={formData.commitment}
                  onChange={handleChange}
                  maxAllowed={3}
                />
              </div>
              <div>
                <Label htmlFor="courtesy">
                  Courtesy (shows respect for authority at all times) 2%
                </Label>
                <Input
                  type="number"
                  id="courtesy"
                  name="courtesy"
                  value={formData.courtesy}
                  onChange={handleChange}
                  maxAllowed={2}
                />
              </div>
            </InputContainer>

            <InputContainer>
              <div>
                <Label htmlFor="conduct">
                  Conduct (follows rules and regulations of the organization) 2%
                </Label>
                <Input
                  type="number"
                  id="conduct"
                  name="conduct"
                  value={formData.conduct}
                  onChange={handleChange}
                  maxAllowed={2}
                />
              </div>
              <div>
                <Label htmlFor="perseverance">
                  perseverance and Industriousness (sincerity and seriousness
                  towards works) 2%
                </Label>
                <Input
                  type="number"
                  id="perseverance"
                  name="perseverance"
                  value={formData.perseverance}
                  onChange={handleChange}
                  maxAllowed={2}
                />
              </div>

              <div>
                <Label htmlFor="teamwork">
                  teamwork (can work harmoniously with other employees) 2%
                </Label>
                <Input
                  type="number"
                  id="teamwork"
                  name="teamwork"
                  value={formData.teamwork}
                  onChange={handleChange}
                  maxAllowed={2}
                />
              </div>
              <div>
                <Label htmlFor="professional_ethics">
                  professionalEthics (position of traits necessary for
                  employment in this kind) 2%
                </Label>
                <Input
                  type="number"
                  id="professional_ethics"
                  name="professional_ethics"
                  value={formData.professional_ethics}
                  onChange={handleChange}
                  maxAllowed={2}
                />
              </div>
              <div>
                <Label htmlFor="creativity">
                  creativity and possess initiative in daily task 2%
                </Label>
                <Input
                  type="number"
                  id="creativity"
                  name="creativity"
                  value={formData.creativity}
                  onChange={handleChange}
                  maxAllowed={2}
                />
              </div>
            </InputContainer>
          </div>

          <hr />
          <br />
          <h1>Work-Related Performance Indicator (25%) </h1>
          <div
            style={{
              border: "1px solid green",
              padding: "30px",
              margin: "10px 5px 30px 5px",
            }}
          >
            <br />
            <InputContainer>
              <div>
                <Label htmlFor="technical_knowledge">
                  Technical Knowledge of Work (able to grasp as instructed) 8%
                </Label>
                <Input
                  type="number"
                  id="technical_knowledge"
                  name="technical_knowledge"
                  value={formData.technical_knowledge}
                  onChange={handleChange}
                  maxAllowed={8}
                />
              </div>
              <div>
                <Label htmlFor="efficiency">
                  The efficiency of the student in the job 7%
                </Label>
                <Input
                  type="number"
                  id="efficiency"
                  name="efficiency"
                  value={formData.efficiency}
                  onChange={handleChange}
                  maxAllowed={7}
                />
              </div>
            </InputContainer>

            <InputContainer>
              <div>
                <Label htmlFor="professional_comments">
                  Willing to accept professional comments and apply it in the
                  workplace 5%
                </Label>
                <Input
                  type="number"
                  id="professional_comments"
                  name="professional_comments"
                  value={formData.professional_comments}
                  onChange={handleChange}
                  maxAllowed={5}
                />
              </div>
              <div>
                <Label htmlFor="attendance">
                  Attendance and Punctuality (Reports to work assignment as
                  scheduled) 5%
                </Label>
                <Input
                  type="number"
                  id="attendance"
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  maxAllowed={5}
                />
              </div>
            </InputContainer>
          </div>
          <hr />
          <br />
          <h1>General information </h1>
          <div
            style={{
              border: "1px solid green",
              padding: "30px",
              margin: "10px 5px 30px 5px",
            }}
          >
            <InputContainer>
              <div>
                <Label htmlFor="advisor_name">Advisor Name</Label>
                <Input
                  type="text"
                  id="advisor_name"
                  name="advisor_name"
                  value={formData.advisor_name}
                  onChange={handleChange}
                />
              </div>
            </InputContainer>

            <InputContainer>
              <div>
                <Label htmlFor="department_assigned">Department Assigned</Label>
                <Input
                  type="text"
                  id="department_assigned"
                  name="department_assigned"
                  value={formData.department_assigned}
                  onChange={handleChange}
                />
              </div>
            </InputContainer>

            <InputContainer>
              <Label>Inclusive Date of Attachment From</Label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  textAlign: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                From
                <Input
                  type="date"
                  id="attachment_from_date"
                  name="attachment_from_date"
                  value={formData.attachment_from_date}
                  onChange={handleChange}
                />
                To
                <Input
                  type="date"
                  id="attachment_to_date"
                  name="attachment_to_date"
                  value={formData.attachment_to_date}
                  onChange={handleChange}
                />
              </div>
            </InputContainer>

            <InputContainer>
              <div>
                <Label htmlFor="area_of_work">Area of Work</Label>
                <Input
                  type="text"
                  id="area_of_work"
                  name="area_of_work"
                  value={formData.area_of_work}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="total_hours">Total Working Hours </Label>
                <Input
                  type="number"
                  id="total_hours"
                  name="total_hours"
                  value={formData.total_hours}
                  onChange={handleChange}
                  maxAllowed={800}
                />
              </div>
              <div>
                <Label htmlFor="comment">Give Comment About This Student</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  maxLength={1000}
                />
              </div>
            </InputContainer>
          </div>

          <ButtonContainer>
            <Button type="submit">Update</Button>
            <CancelButton onClick={onClose}>Cancel</CancelButton>
          </ButtonContainer>
          <ToastContainer />
        </Form>
      </ContentContainer>
    </Modal>
  );
};

export default UpdateResults;
