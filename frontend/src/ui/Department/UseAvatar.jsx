import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import defaultAvatar from "../../../../backend/public/images/department/default.jpg";
import departmentService from "./../../services/department.service";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 4rem; /* Set your desired width */
  height: 4rem; /* Set your desired height */
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

function UserAvatar() {
  const [photoUrl, setPhotoUrl] = useState(null);
  const { userId } = useAuth();

  const fetchDepartmentPhoto = async () => {
    try {
      // Fetch department data including photo URL
      const response = await departmentService.getDepartments(userId);

      if (response.ok) {
        const department = await response.json();

        if (department.department.photo) {
          const adjustedPhotoUrl = department.department.photo.replace(
            "/public",
            ""
          );

          setPhotoUrl(adjustedPhotoUrl);
        } else {
          // If photo URL is not available, set default photo URL
          setPhotoUrl(defaultAvatar);
        }
      } else {
        throw new Error("Failed to fetch department data");
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      // If error occurs, set default photo URL
      setPhotoUrl(defaultAvatar);
    }
  };

  useEffect(() => {
    fetchDepartmentPhoto();

    // Fetch student photo every 30 seconds (30000 milliseconds)
    const intervalId = setInterval(fetchDepartmentPhoto, 3000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [userId]);

  return (
    <>
      <StyledUserAvatar>
        <Avatar
          src={
            `http://localhost:8080/images/department/` + photoUrl ||
            defaultAvatar
          }
          alt="department Avatar"
        />
      </StyledUserAvatar>
    </>
  );
}

export default UserAvatar;
