import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "./../../../context/AuthContext";
import depResultService from "../../../services/dept.results.service";
import PrintButton from "../../../ui/PrintButton";
import Header from "../Header/Header";
import Button from "../../../ui/Button";
import SeeResultDetail from "./ResultDetail";

const PlacementResultsContainer = styled.div`
  margin-top: 20px;
  border: 2px solid #0273b6;
  padding: 40px 30px;
`;

const PlacementResultTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--color-grey-400);
`;

const Title = styled.h1`
  font-size: 20px;
  margin-bottom: -21px;
  padding: 10px;
  text-align: center;
  background-color: #0273b6;
  border-top-right-radius: 7px;
  border-top-left-radius: 7px;
  color: white;
`;

const PlacementContainer = styled.div`
  background-color: var(--color-grey-100);
  min-height: 100vh;
  padding: 20px;
  margin-top: -5px;
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

const PrintButtonWrapper = styled.div`
  position: absolute;
  margin: auto;
  align-items: center;
  right: 30px;
  top: 330px;
`;

const EvaluationResults = () => {
  const [placementResults, setPlacementResults] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchPlacementResults = async () => {
      try {
        if (userId) {
          const data = await depResultService.getResultsByStudentId(userId);
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
      <Header />
      <br /> <br />
      <br />
      <PlacementContainer>
        <Title>Wellcome to see your final evaluation results out of 100%</Title>
        <PlacementResultsContainer id="printableTable">
          {placementResults.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <p>No evaluation results found. Please come back later.</p>
            </div>
          ) : (
            <PlacementResultTable>
              <thead>
                <TableRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>Full Name</TableHeaderCell>
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
          )}
        </PlacementResultsContainer>

        <PrintButtonWrapper>
          <Button
            style={{
              marginRight: "20px",
            }}
            onClick={() => {
              setSelectedStudentId(userId);
            }}
          >
            See Detail
          </Button>

          <PrintButton printableElementId="printableTable" />
        </PrintButtonWrapper>
      </PlacementContainer>
      {selectedStudentId && (
        <SeeResultDetail
          studentId={selectedStudentId}
          onClose={() => {
            setSelectedStudentId(null);
          }}
        />
      )}
    </>
  );
};

export default EvaluationResults;
