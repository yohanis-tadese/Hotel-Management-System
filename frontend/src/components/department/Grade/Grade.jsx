import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Heading from "./../../../ui/Heading";
import { useAuth } from "./../../../context/AuthContext";
import resultService from "../../../services/result.service";
import SendResults from "./SendResults";
import UpdateResults from "./UpdateResult";
import depResultService from "../../../services/dept.results.service";

const PlacementResultsContainer = styled.div`
  margin-top: 20px;
`;

const PlacementResultTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--color-grey-100);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: var(--color-grey-100);
  }
`;

const TableHeaderCell = styled.th`
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  background-color: var(--color-grey-100);
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const buttonStyle = {
  padding: "5px 25px",
  fontSize: "15px",
  width: "100px",
  borderRadius: "30px",
  margin: "5px",
  color: "white",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease",
};

const sendButtonStyle = {
  ...buttonStyle,
  backgroundColor: "red",
};

const updateButtonStyle = {
  ...buttonStyle,
  backgroundColor: "blue",
};

const StudentGrade = () => {
  const [placementResults, setPlacementResults] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [resultsSentStatus, setResultsSentStatus] = useState({});

  const { userId } = useAuth();

  useEffect(() => {
    const fetchPlacementResults = async () => {
      try {
        if (userId) {
          const data = await resultService.getResultsByDepartmentId(userId);
          setPlacementResults(data);

          // Check result for each student
          const status = {};
          for (const result of data) {
            const studentResults = await depResultService.getResultsByStudentId(
              result.student_id
            );
            status[result.student_id] = studentResults.length > 0;
          }
          setResultsSentStatus(status);
        }
      } catch (error) {
        console.error("Error fetching placement results:", error);
      }
    };

    fetchPlacementResults();

    // Refresh every 3000 seconds (5 minutes)
    const intervalId = setInterval(fetchPlacementResults, 4000);

    // Cleanup interval
    return () => clearInterval(intervalId);
  }, [userId]);

  const handleButtonClick = (studentId) => {
    setSelectedStudentId(studentId);
    setSelectedDepartmentId(userId);
  };

  return (
    <>
      <Heading as="h1">All Accepted Students</Heading>

      <PlacementResultsContainer>
        <PlacementResultTable>
          <thead>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Student Name</TableHeaderCell>
              <TableHeaderCell>Advisor Name</TableHeaderCell>
              <TableHeaderCell>Company Name</TableHeaderCell>
              <TableHeaderCell>Total (40%)</TableHeaderCell>
              <TableHeaderCell>Final Result</TableHeaderCell>
            </TableRow>
          </thead>
          <tbody>
            {placementResults.map((result, index) => (
              <TableRow key={`${result.placement_id}-${index}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {result.student_first_name} {result.student_last_name}
                </TableCell>
                <TableCell>{result.advisor_name}</TableCell>
                <TableCell>{result.company_name}</TableCell>
                <TableCell>
                  {parseFloat(result.commitment) +
                    parseFloat(result.courtesy) +
                    parseFloat(result.conduct) +
                    parseFloat(result.perseverance) +
                    parseFloat(result.teamwork) +
                    parseFloat(result.professional_ethics) +
                    parseFloat(result.creativity) +
                    parseFloat(result.technical_knowledge) +
                    parseFloat(result.efficiency) +
                    parseFloat(result.professional_comments) +
                    parseFloat(result.attendance)}
                </TableCell>
                <TableCell>
                  <button
                    style={
                      resultsSentStatus[result.student_id]
                        ? updateButtonStyle
                        : sendButtonStyle
                    }
                    onClick={() => handleButtonClick(result.student_id)}
                  >
                    {resultsSentStatus[result.student_id] ? "Update" : "Send"}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </PlacementResultTable>
      </PlacementResultsContainer>

      {selectedStudentId &&
        (resultsSentStatus[selectedStudentId] ? (
          <UpdateResults
            studentId={selectedStudentId}
            departmentId={selectedDepartmentId}
            onClose={() => {
              setSelectedStudentId(null);
              setSelectedDepartmentId(null);
            }}
          />
        ) : (
          <SendResults
            studentId={selectedStudentId}
            departmentId={selectedDepartmentId}
            onClose={() => {
              setSelectedStudentId(null);
              setSelectedDepartmentId(null);
            }}
          />
        ))}
    </>
  );
};

export default StudentGrade;
