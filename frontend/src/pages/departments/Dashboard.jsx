import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdBusiness } from "react-icons/md"; // Import organization icon
import { FaUserGraduate } from "react-icons/fa"; // Import student icon
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import { Link } from "react-router-dom";
import companyService from "../../services/company.service";
import studentService from "../../services/student.service";
import { useAuth } from "../../context/AuthContext";
import resultService from "./../../services/result.service";
import Box from "../../ui/Box";
import ReactApexChart from "react-apexcharts";
import DashboardContainer from "../../ui/DashboardContainer";
import Spinner from "../../ui/Spinner";
import placementService from "../../services/placement.service";
import depResultService from "../../services/dept.results.service";
import Boxs from "../../ui/Boxes";

const StyledLink = styled(Link)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #0984e3;
  text-decoration: none;
  font-weight: bold;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const PieChartContainer = styled.div`
  margin-top: 2rem;
  width: 300px;
  margin-bottom: 30px;
`;

function Dashboard() {
  const [numCompanies, setNumCompanies] = useState(0);
  const [numStudents, setNumStudents] = useState(0);
  const [numSendResults, setNumSendResults] = useState(0);
  const [numEvaluatedResults, setNumEvaluatedResults] = useState(0); // New state for evaluated results count
  const [studentData, setStudentData] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const { userId } = useAuth();

  const [showCompany, setShowCompany] = useState(false);

  useEffect(() => {
    const storedShowCompany = localStorage.getItem("showCompany");
    if (storedShowCompany) {
      setShowCompany(JSON.parse(storedShowCompany));
    }
  }, [showCompany]);

  useEffect(() => {
    // Fetch real data for the dashboard
    async function fetchData() {
      try {
        const companyResponse =
          await companyService.getAllCompaniesWithoutPagination();
        const studentResponse = await studentService.getStudentsByDepartment(
          userId
        );

        const resultResponse = await resultService.getResultsByDepartmentId(
          userId
        );

        const evaluatedResultsResponse =
          await depResultService.getResultsByDepartmentId(userId);

        if (companyResponse.ok && studentResponse.ok) {
          const companyData = await companyResponse.json();
          const studentData = await studentResponse.json();

          setNumCompanies(companyData.companies.length);
          setNumStudents(studentData.length);
          setNumSendResults(resultResponse.length);
          setNumEvaluatedResults(evaluatedResultsResponse.length);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }

    fetchData();
  }, [userId]);

  useEffect(() => {
    async function fetchData() {
      try {
        const studentResponse =
          await placementService.getAllPlacementResultsByDepartmentId(userId);

        setStudentData(studentResponse);

        setNumStudents(studentResponse.length);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
      setLoadingStudents(false);
    }

    fetchData();
  }, [userId]);

  const calculateCompanyDistribution = () => {
    const departmentCounts = {};
    studentData.forEach((student) => {
      if (departmentCounts.hasOwnProperty(student.company_name)) {
        departmentCounts[student.company_name]++;
      } else {
        departmentCounts[student.company_name] = 1;
      }
    });

    return departmentCounts;
  };

  const departmentDistributionData = {
    labels: Object.keys(calculateCompanyDistribution()),
    series: Object.values(calculateCompanyDistribution()),
  };

  const pieOptions = {
    labels: departmentDistributionData.labels,
    colors: ["#FF6384", "#36A2EB", "#FFCE56", "#66ff33", "#ff33cc", "#9966ff"],
    legend: {
      position: "right",
    },
  };

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Department Dashboard</Heading>
      </Row>

      <DashboardContainer>
        <Box>
          <Heading as="h2">Number of Students</Heading>
          <h3>{numStudents}</h3>
          <IconContainer>
            <FaUserGraduate size={24} color="#0984e3" />
          </IconContainer>
          <StyledLink to="/department/student">See detail</StyledLink>
        </Box>
        <Box>
          <Heading as="h2">Number of Companies</Heading>
          <h3>{numCompanies}</h3>
          <IconContainer>
            <MdBusiness size={24} color="#0984e3" />
          </IconContainer>
          <StyledLink>Numbers of companys</StyledLink>
        </Box>
        <Boxs>
          <Box>
            <Heading as="h2">Student With Organizational Results</Heading>
            <h3>{numSendResults}</h3>
            <IconContainer>
              <MdBusiness size={24} color="#0984e3" />
            </IconContainer>
            <StyledLink to="/department/student-organizational-results">
              See detail
            </StyledLink>
          </Box>
          <br />
          <Box>
            <Heading as="h2">Fully Evaluated Students</Heading>
            <h3>{numEvaluatedResults}</h3>
            <IconContainer>
              <MdBusiness size={24} color="#0984e3" />
            </IconContainer>
            <StyledLink to="/department/student-evaluation-results">
              See detail
            </StyledLink>
          </Box>
        </Boxs>

        <Box>
          <Heading as="h2">Assigned Student Lists</Heading>
          <IconContainer>
            <FaUserGraduate size={24} color="#0984e3" />
          </IconContainer>
          {loadingStudents ? (
            <Spinner />
          ) : (
            <PieChartContainer>
              <ReactApexChart
                options={pieOptions}
                series={departmentDistributionData.series}
                type="pie"
                width="380"
              />
            </PieChartContainer>
          )}

          <StyledLink to="/department/student-placement-results">
            See Detail
          </StyledLink>
        </Box>
      </DashboardContainer>
    </>
  );
}

export default Dashboard;
