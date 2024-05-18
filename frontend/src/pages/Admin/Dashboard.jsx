import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { MdBusiness, MdSchool, MdAdminPanelSettings } from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import departmentService from "../../services/department.service";
import companyService from "../../services/company.service";
import studentService from "../../services/student.service";
import adminService from "../../services/admin.service";
import placementService from "../../services/placement.service";
import Spinner from "../../ui/Spinner";
import DashboardContainer from "../../ui/DashboardContainer";
import Box from "../../ui/Box";
import ReactApexChart from "react-apexcharts";
import Boxs from "../../ui/Boxes";

const IconContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const StyledLink = styled(Link)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #0984e3;
  text-decoration: none;
  font-weight: bold;
`;

const PieChartContainer = styled.div`
  margin-top: 2rem;
  width: 300px;
  margin-bottom: 30px;
`;

function Dashboard() {
  const [numDepartments, setNumDepartments] = useState(0);
  const [numCompanies, setNumCompanies] = useState(0);
  const [numStudents, setNumStudents] = useState(0);
  const [numAdmins, setNumAdmins] = useState(0);
  const [numApplyStudents, setNumApplyStudents] = useState([]);
  const [numPlacements, setNumPlacements] = useState(0);
  const [studentData, setStudentData] = useState([]);

  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [loadingApplyStudents, setLoadingApplyStudents] = useState(true);
  const [loadingPlacements, setLoadingPlacements] = useState(true);

  const [showCompany, setShowCompany] = useState(false);

  useEffect(() => {
    const storedShowCompany = localStorage.getItem("showCompany");
    if (storedShowCompany) {
      setShowCompany(JSON.parse(storedShowCompany));
    }
  }, [showCompany]);

  useEffect(() => {
    async function fetchData() {
      const departmentResponse = await departmentService.getAllDepartments();
      const companyResponse =
        await companyService.getAllCompaniesWithoutPagination();
      const studentResponse = await studentService.getAllStudents();
      const adminResponse = await adminService.getAllAdmins();
      const applyStudentResponse = await studentService.getAllApplyStudents();

      await new Promise((resolve) => setTimeout(resolve, 400));

      if (
        departmentResponse.ok &&
        companyResponse.ok &&
        studentResponse.ok &&
        adminResponse.ok &&
        applyStudentResponse
      ) {
        const departmentData = await departmentResponse.json();
        const companyData = await companyResponse.json();
        const studentData = await studentResponse.json();
        const adminData = await adminResponse.json();

        setNumDepartments(departmentData.totalCount);
        setNumCompanies(companyData.companies.length);
        setNumStudents(studentData.students.length);
        setNumAdmins(adminData.admins.length);
        setNumApplyStudents(applyStudentResponse.students.length);
      } else {
        console.error("Failed to fetch dashboard data");
      }

      setLoadingDepartments(false);
      setLoadingCompanies(false);
      setLoadingStudents(false);
      setLoadingAdmins(false);
      setLoadingApplyStudents(false);
      setLoadingPlacements(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const studentResponse = await placementService.getAllPlacementResults();

        setStudentData(studentResponse);
        setNumPlacements(studentResponse.length);
        setNumStudents(studentResponse.length);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
      setLoadingStudents(false);
    }

    fetchData();
  }, []);

  const calculateCompanyDistribution = () => {
    const departmentCounts = {};
    if (Array.isArray(studentData)) {
      studentData.forEach((student) => {
        if (departmentCounts.hasOwnProperty(student.company_name)) {
          departmentCounts[student.company_name]++;
        } else {
          departmentCounts[student.company_name] = 1;
        }
      });
    }
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
        <Heading as="h1">Admin Dashboard</Heading>
      </Row>
      <DashboardContainer>
        <Box>
          <Heading as="h2">Number of Admins</Heading>
          {loadingAdmins ? (
            <Spinner />
          ) : (
            <>
              <h3>{numAdmins}</h3>
              <IconContainer>
                <MdAdminPanelSettings size={24} color="#00b494" />
              </IconContainer>
              <StyledLink>Admins</StyledLink>
            </>
          )}
        </Box>
        <Box>
          <Heading as="h2">Number of Departments</Heading>
          {loadingDepartments ? (
            <Spinner />
          ) : (
            <>
              <h3>{numDepartments}</h3>
              <IconContainer>
                <MdSchool size={24} color="#00b894" />
              </IconContainer>
              <StyledLink to="/admin/department">See detail</StyledLink>
            </>
          )}
        </Box>
        <Box>
          <Heading as="h2">Number of Companies</Heading>
          {loadingCompanies ? (
            <Spinner />
          ) : (
            <>
              <h3>{numCompanies}</h3>
              <IconContainer>
                <MdBusiness size={24} color="#0984e3" />
              </IconContainer>
              <StyledLink to="/admin/company">See detail</StyledLink>
            </>
          )}
        </Box>
        <Box>
          <Heading as="h2">Number of Students</Heading>
          {loadingStudents ? (
            <Spinner />
          ) : (
            <>
              <h3>{numStudents}</h3>
              <IconContainer>
                <FaUserGraduate size={24} color="#0984e3" />
              </IconContainer>
              <StyledLink>Students</StyledLink>
            </>
          )}
        </Box>
      </DashboardContainer>
      <DashboardContainer>
        <Boxs>
          <Box>
            <Heading as="h2">Number of Apply Students</Heading>
            {loadingApplyStudents ? (
              <Spinner />
            ) : (
              <>
                <h3>{numApplyStudents}</h3>
                <IconContainer>
                  <FaUserGraduate size={24} color="#0984e3" />
                </IconContainer>
                <StyledLink to="/admin/placement">See detail</StyledLink>
              </>
            )}
          </Box>
          <br />
          <br />
          {showCompany && (
            <Box>
              <Heading as="h2">Number of Assigned Students</Heading>
              {loadingPlacements ? (
                <Spinner />
              ) : (
                <>
                  <h3>{numPlacements}</h3>
                  <IconContainer>
                    <FaUserGraduate size={24} color="#0984e3" />
                  </IconContainer>
                  <StyledLink to="/admin/placement">See detail</StyledLink>
                </>
              )}
            </Box>
          )}
        </Boxs>
        {showCompany && (
          <Box>
            <Heading as="h2">Accepted Students Per Departments</Heading>
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

            <StyledLink to="/admin/report"> See Detail</StyledLink>
          </Box>
        )}
      </DashboardContainer>
    </>
  );
}

export default Dashboard;
