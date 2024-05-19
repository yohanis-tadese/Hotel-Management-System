import React, { useState, useEffect } from "react";
import styled from "styled-components";
import studentService from "../../../services/student.service";
import PrintButton from "./../../../ui/PrintButton";
import Spinner from "../../../ui/Spinner";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #7dc400;
`;

const TableHead = styled.thead`
  background-color: var(--color-grey-200);
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  border: 1px solid var(--color-grey-400);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: var(--color-grey-100);
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid var(--color-grey-200);
  border: 1px solid var(--color-grey-200);
`;

const Report = () => {
  const [showCompany, setShowCompany] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedShowCompany = localStorage.getItem("showCompany");
    if (storedShowCompany) {
      setShowCompany(JSON.parse(storedShowCompany));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [showCompany]);

  const fetchData = async () => {
    try {
      const response = await studentService.getAllApplyStudents();
      if (response) {
        setData(response.students);
      } else {
        console.error("Failed to fetch student data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <PrintButton printableElementId="printableTable" />
      <br />
      <br />
      <Table id="printableTable">
        <TableHead>
          <TableRow style={{ background: "#0062", color: "black" }}>
            <TableHeader>ID</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Disability</TableHeader>
            <TableHeader>Gender</TableHeader>
            <TableHeader>GPA</TableHeader>
            {showCompany && <TableHeader>Company Name</TableHeader>}
          </TableRow>
        </TableHead>
        <tbody>
          {data.map((item) => (
            <TableRow key={item.student_id}>
              <TableCell>{item.student_id}</TableCell>
              <TableCell>{item.name || item.student_name}</TableCell>
              <TableCell>{item.disability ? "Yes" : "No"}</TableCell>
              <TableCell>{item.gender}</TableCell>
              <TableCell>{item.gpa}</TableCell>
              {showCompany && <TableCell>{item.company_name}</TableCell>}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Report;
