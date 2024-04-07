import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import departmentService from "../../../services/department.service";
import { FaEdit } from "react-icons/fa";
import { FaRegTrashAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import styled from "styled-components";
import EditDepartment from "./EditDepartment";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const TableContainer = styled.div`
  width: 100%;
  height: 400px;
  font-size: 1.6rem;
`;

const SearchInput = styled.input`
  width: 15%;
  margin-bottom: 10px;
  margin-left: 1px;
  padding: 7px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1.4rem;
  color: var(--color-grey-900);
`;

const CustomDataGrid = styled(DataGrid)`
  & .MuiDataGrid-root {
    border-radius: 5px;
    border: 1px solid #ccc;
    overflow: hidden;
  }

  & .MuiDataGrid-columnsContainer {
    background-color: var(--color-grey-300);
    border-bottom: 1px solid #ccc;
    font-weight: bold;
  }

  & .MuiDataGrid-columnHeader {
    border-right: 1px solid #ccc;
    background-color: var(--color-grey-100);
    color: var(--color-grey-900);
    padding: 12px;
    font-size: 15px;
    font-weight: 600;
  }

  & .MuiDataGrid-row {
    transition: background-color 0.2s;
    border-bottom: 1px solid #ccc;
    color: var(--color-grey-900);
    height: 50px;
    font-size: 13px;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const EditIcon = styled(FaEdit)`
  color: #007bff;
  font-size: 18px;
`;

const DeleteIcon = styled(FaRegTrashAlt)`
  color: #dc3545;
  font-size: 18px;
`;

const ConfirmationContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 460px;
  background-color: #ff9966;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 400px;
`;

const ConfirmationMessage = styled.p`
  font-size: 16px;
  color: #333333;
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.2rem;
`;

const ConfirmButton = styled.button`
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled.button`
  background-color: #e0e0e0;
  color: #333333;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #bdbdbd;
  }
`;

const IconWrapper = styled.span`
  margin-right: 10px;
`;

const ConfirmIcon = styled(FaCheckCircle)`
  color: #28a745;
`;

const CancelIcon = styled(FaTimesCircle)`
  color: #dc3545;
`;

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <ConfirmationContainer>
      <ConfirmationMessage>{message}</ConfirmationMessage>
      <ButtonWrapper>
        <ConfirmButton onClick={onConfirm}>
          <IconWrapper>
            <ConfirmIcon />
          </IconWrapper>
          Confirm
        </ConfirmButton>
        <CancelButton onClick={onCancel}>
          <IconWrapper>
            <CancelIcon />
          </IconWrapper>
          Cancel
        </CancelButton>
      </ButtonWrapper>
    </ConfirmationContainer>
  );
};

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deletedDepartmentId, setDeletedDepartmentId] = useState(null);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      if (response.ok) {
        const responseData = await response.json();

        console.log("Hooo", Array.isArray(responseData.department));

        const departmentsData = responseData.department.map(
          (department, index) => ({
            ...department,
            id: index + 1,
          })
        );
        setDepartments(departmentsData);
      } else {
        console.error("Failed to fetch departments:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    // Fetch departments initially
    fetchDepartments();

    // Set up interval to fetch departments every 10 seconds
    const intervalId = setInterval(fetchDepartments, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleEdit = (departmentId) => {
    setEditingDepartmentId(departmentId);
  };

  const handleCancelEdit = () => {
    setEditingDepartmentId(null);
  };

  const filteredDepartments = searchText
    ? departments.filter((department) =>
        department.department_name
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    : departments;

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "department_name", headerName: "Name", width: 100 },
    { field: "username", headerName: "Username", width: 130 },
    { field: "phone_number", headerName: "Phone Number", width: 130 },
    { field: "contact_email", headerName: "Contact Email", width: 150 },
    { field: "department_type", headerName: "Type", width: 100 },
    { field: "office_location", headerName: "Office Location", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 125,
      renderCell: (params) => (
        <ActionsWrapper>
          <IconButton
            aria-label="edit"
            onClick={() => handleEdit(params.row.department_id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(params.row.department_id)}
          >
            <DeleteIcon />
          </IconButton>
        </ActionsWrapper>
      ),
    },
  ];

  const handleDelete = (departmentId) => {
    setDeletedDepartmentId(departmentId);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async (departmentId) => {
    try {
      const response = await departmentService.deleteDepartment(
        deletedDepartmentId
      );
      if (response.ok) {
        // Remove deleted department from the list
        setDepartments(
          departments.filter((department) => department.id !== departmentId)
        );
        toast.success("Department deleted successfully.", {
          autoClose: 1000,
        });
      } else {
        console.error("Failed to delete department:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting department:", error);
    }
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this Department?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <TableContainer>
        <SearchInput
          type="text"
          value={searchText}
          onChange={handleSearchTextChange}
          placeholder="Search by name..."
        />
        <CustomDataGrid
          rows={filteredDepartments}
          columns={columns}
          autoHeight
          pagination={true}
        />
        {editingDepartmentId && (
          <EditDepartment
            departmentId={editingDepartmentId}
            initialData={departments.find(
              (dept) => dept.id === editingDepartmentId
            )}
            onCancel={handleCancelEdit}
          />
        )}
      </TableContainer>
    </>
  );
};

export default DepartmentList;
