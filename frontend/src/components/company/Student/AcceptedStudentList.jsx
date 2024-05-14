import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Heading from "./../../../ui/Heading";
import placementService from "./../../../services/placement.service";
import { useAuth } from "./../../../context/AuthContext";
import SendResults from "./SendResults";

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
  fontSize: "17px",
  borderRadius: "30px",
  margin: "5px",
  color: "white",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease",
  backgroundColor: "red",
};

const disabledButtonStyle = {
  ...buttonStyle,
  backgroundColor: "gray",
  // cursor: "not-allowed",
};

const Dropdown = styled.select`
  padding: 4px 12px;
  font-size: 15px;
  border-radius: 30px;
`;

const AcceptedStudentList = () => {
  const [placementResults, setPlacementResults] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [studentStatus, setStudentStatus] = useState({});
  const { userId } = useAuth();

  useEffect(() => {
    const fetchPlacementResults = async () => {
      try {
        if (userId) {
          const data = await placementService.getAllPlacementResultsByCompanyId(
            userId
          );
          setPlacementResults(data);

          // Initialize studentStatus state with default status for each student
          const initialStatus = {};
          data.forEach((result) => {
            initialStatus[result.student_id] = result.student_status;
          });
          setStudentStatus(initialStatus);
        }
      } catch (error) {
        console.error("Error fetching placement results:", error);
      }
    };

    fetchPlacementResults();
  }, [userId]);

  const handleStatusChange = (studentId, event) => {
    const newStatus = { ...studentStatus, [studentId]: event.target.value };
    setStudentStatus(newStatus);
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
              <TableHeaderCell>Gender</TableHeaderCell>
              <TableHeaderCell>Disability</TableHeaderCell>
              <TableHeaderCell>Department Name</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Final Result</TableHeaderCell>
            </TableRow>
          </thead>
          <tbody>
            {placementResults.map((result, index) => (
              <TableRow key={result.placement_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {result.student_first_name} {result.student_last_name}
                </TableCell>
                <TableCell>{result.gender}</TableCell>
                <TableCell>{result.disability === 1 ? "yes" : "no"}</TableCell>
                <TableCell>{result.department_name}</TableCell>
                <TableCell>
                  <Dropdown
                    value={result.student_status}
                    onChange={(e) => handleStatusChange(result.student_id, e)}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Nearly Completed">Nearly Completed</option>
                    <option value="Almost Finished">Almost Finished</option>
                    <option value="Completed">Completed</option>
                  </Dropdown>
                </TableCell>
                <TableCell>
                  <button
                    style={
                      result.student_status === "Completed"
                        ? buttonStyle
                        : disabledButtonStyle
                    }
                    onClick={() => {
                      setSelectedStudentId(result.student_id);
                      setSelectedCompanyId(result.company_id);
                      setSelectedDepartmentId(result.department_id);
                    }}
                    disabled={result.student_status !== "Completed"}
                  >
                    Send
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </PlacementResultTable>
      </PlacementResultsContainer>

      {selectedStudentId && (
        <SendResults
          companyId={selectedCompanyId}
          studentId={selectedStudentId}
          departmentId={selectedDepartmentId}
          onClose={() => {
            setSelectedStudentId(null);
            setSelectedCompanyId(null);
            setSelectedDepartmentId(null);
          }}
        />
      )}
    </>
  );
};

export default AcceptedStudentList;
