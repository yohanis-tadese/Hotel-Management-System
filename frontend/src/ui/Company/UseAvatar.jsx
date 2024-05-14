import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import defaultAvatar from "../../../../backend/public/images/admin/default.jpg";
import companyService from "../../services/company.service";

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

  const fetchCompanyPhoto = async () => {
    try {
      // Fetch company data including photo URL
      const response = await companyService.getCompany(userId);

      if (response.ok) {
        const company = await response.json();
        if (company.company.photo) {
          // Adjust the photo URL by removing '/public' if present
          const adjustedPhotoUrl = company.company.photo.replace("/public", "");
          // Set the adjusted photo URL in state
          setPhotoUrl(adjustedPhotoUrl);
        } else {
          // If photo URL is not available, set default photo URL
          setPhotoUrl(defaultAvatar);
        }
      } else {
        throw new Error("Failed to fetch company data");
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      // If error occurs, set default photo URL
      setPhotoUrl(defaultAvatar);
    }
  };

  useEffect(() => {
    fetchCompanyPhoto();

    // Fetch student photo every 30 seconds (30000 milliseconds)
    const intervalId = setInterval(fetchCompanyPhoto, 3000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [userId]);

  return (
    <>
      <StyledUserAvatar>
        <Avatar
          src={
            `http://localhost:8080/images/company/` + photoUrl || defaultAvatar
          }
          alt="Admin Avatar"
        />
      </StyledUserAvatar>
    </>
  );
}

export default UserAvatar;
