import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Heading from "./../../../ui/Heading";
import { useAuth } from "./../../../context/AuthContext";
import depResultService from "../../../services/dept.results.service";
import PrintButton from "../../../ui/PrintButton";

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

const EvaluationResult = () => {
  const [placementResults, setPlacementResults] = useState([]);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchPlacementResults = async () => {
      try {
        if (userId) {
          const data = await depResultService.getResultsByDepartmentId(userId);
          setPlacementResults(data);
        }
      } catch (error) {
        console.error("Error fetching placement results:", error);
      }
    };

    fetchPlacementResults();
  }, [userId]);

  // Function to calculate grade based on total score
  const calculateGrade = (total) => {
    if (total < 40) return "F";
    else if (total >= 40 && total < 45) return "D";
    else if (total >= 45 && total < 50) return "C-";
    else if (total >= 50 && total < 60) return "C";
    else if (total >= 60 && total < 65) return "C+";
    else if (total >= 65 && total < 70) return "B-";
    else if (total >= 70 && total < 75) return "B";
    else if (total >= 75 && total < 80) return "B+";
    else if (total >= 80 && total < 85) return "A-";
    else if (total >= 85 && total < 90) return "A";
    else if (total >= 90 && total <= 100) return "A+";
    else return "Invalid score";
  };

  return (
    <>
      <Heading as="h1">All Accepted Students</Heading>

      <PrintButton printableElementId="printableTable" />

      <PlacementResultsContainer id="printableTable">
        <PlacementResultTable>
          <thead>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Company (40%)</TableHeaderCell>
              <TableHeaderCell>Advisor (10%)</TableHeaderCell>
              <TableHeaderCell>Presentation (25%)</TableHeaderCell>
              <TableHeaderCell>Document (25%)</TableHeaderCell>
              <TableHeaderCell>Total (100%)</TableHeaderCell>
              <TableHeaderCell>Grade</TableHeaderCell>
            </TableRow>
          </thead>
          <tbody>
            {placementResults.map((result, index) => (
              <TableRow key={result.placement_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {result.student_first_name} {result.student_last_name}
                </TableCell>
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
                <TableCell>{result.advisor_score}</TableCell>
                <TableCell>{result.presentation_score}</TableCell>
                <TableCell>{result.documentation_score}</TableCell>
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
                    parseFloat(result.attendance) +
                    parseFloat(result.advisor_score) +
                    parseFloat(result.presentation_score) +
                    parseFloat(result.documentation_score)}
                </TableCell>
                <TableCell>
                  {/* Set grade based on total score */}
                  {calculateGrade(
                    parseFloat(result.commitment) +
                      parseFloat(result.courtesy) +
                      parseFloat(result.conduct) +
                      parseFloat(result.perseverance) +
                      parseFloat(result.teamwork) +
                      parseFloat(result.professional_ethics) +
                      parseFloat(result.creativity) +
                      parseFloat(result.technical_knowledge) +
                      parseFloat(result.efficiency) +
                      parseFloat(result.professional_comments) +
                      parseFloat(result.attendance) +
                      parseFloat(result.advisor_score) +
                      parseFloat(result.presentation_score) +
                      parseFloat(result.documentation_score)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </PlacementResultTable>
      </PlacementResultsContainer>
    </>
  );
};

export default EvaluationResult;
