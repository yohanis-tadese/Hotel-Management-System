import { useState, useEffect } from "react";
import styled from "styled-components";
import placementService from "../../../services/placement.service";
import { useAuth } from "../../../context/AuthContext";
import Header from "../Header/Header";
import Spinner from "../../../ui/Spinner";
import avatar from "../../../../../backend/public/images/admin/default.jpg";
import studentService from "../../../services/student.service";
import { fetchRemainingTime } from "../../../utils/timeUtils";

// Styled components
const PlacementContainer = styled.div`
  background-color: var(--color-grey-100);
  min-height: 85vh;
  padding: 20px;
  margin-top: -5px;
`;

const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 10px;
  padding: 10px;
  text-align: center;
  background-color: #0273b6;
  border-top-right-radius: 13px;
  border-top-left-radius: 13px;
  color: white;
`;

const Titles = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
  padding: 4px;
  text-align: center;
  background-color: #7dc400;
`;

const PlacementList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PlacementItem = styled.li`
  margin-bottom: 10px;
  padding: 5px 40px;
`;

const PlacementCard = styled.div`
  display: flex;
  justify-content: space-around;
  width: 60%;
  margin: 20px auto;
  padding: 5px 10px 30px 3px;
  border-radius: 10px;
  box-shadow: -0.2px -0.3px 2px 2px rgba(0, 0, 0, 0.1);
`;

const LeftSide = styled.div`
  background-color: var(--color-grey-100);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 10px;
  margin-left: 50px;
  margin-top: 10px;
`;

const CardHeader = styled.div`
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const CompanyDetails = styled.div`
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
`;

const DetailItem = styled.p`
  margin: 5px 0;
  font-size: 16px;
  padding: 5px;
`;

const DetailLabel = styled.span`
  font-weight: bold;
`;

const DetailValue = styled.span`
  margin-left: 10px;
`;

const ProfileImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 70%;
  padding: 5px;
  margin-left: 30px;
  margin-bottom: 10px;
  border: 2px solid skyblue;
`;

const ResultTRacker = styled.form`
  background-color: var(--color-grey-50);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 80%;
  margin: 15px auto;
  text-align: center;
  padding: 15px;
`;

// Placement Results Component
const PlacementResults = () => {
  const [placementResults, setPlacementResults] = useState([]);
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    // Fetch remaining time separately
    fetchRemainingTime(1).then((remainingTime) => {
      setRemainingTime(remainingTime);
    });
  }, []);

  useEffect(() => {
    const fetchStudentPhoto = async () => {
      try {
        // Fetch student data including photo URL
        const response = await studentService.getStudent(userId);

        if (response) {
          const student = await response.json();

          if (student.students.photo) {
            const adjustedPhotoUrl = student.students.photo.replace(
              "/public",
              ""
            );

            // Set the adjusted photo URL in state
            setPhotoUrl(adjustedPhotoUrl);
          } else {
            // If photo URL is not available, set default photo URL
            setPhotoUrl(defaultAvatar);
          }
        } else {
          throw new Error("Failed to fetch student data");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        // If error occurs, set default photo URL
        setPhotoUrl(defaultAvatar);
      }
    };

    fetchStudentPhoto();

    // Fetch student photo every 30 seconds (30000 milliseconds)
    const intervalId = setInterval(fetchStudentPhoto, 30000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [userId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPlacementResults();
      setLoading(false);
    }, 1000);

    // Clean up function to clear timeout if component unmounts
    return () => clearTimeout(timeout);
  }, [userId]);

  const fetchPlacementResults = async () => {
    try {
      // Assuming studentId is available from props or context
      const results = await placementService.getPlacementResult(userId);

      setPlacementResults(results);
      // console.log("kkkkkkkkkkk", results.placement_id === undefined);
    } catch (error) {
      console.error("Error fetching placement results:", error);
    }
  };

  return (
    <>
      <Header />
      <br /> <br />
      <br />
      <PlacementContainer>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {placementResults[0]?.placement_id === null &&
            remainingTime === 0 ? (
              <ResultTRacker>
                If you haven't applied by the set deadline, you won't be able to
                view any results.
              </ResultTRacker>
            ) : (
              <PlacementList>
                <Title> Wellcome to see your placement Results</Title>
                {placementResults.map((result) => (
                  <PlacementItem key={result.placement_id}>
                    <PlacementCard>
                      <LeftSide>
                        <CardHeader>
                          <div>
                            <ProfileImage
                              src={
                                `http://localhost:8080/images/student/` +
                                  photoUrl || avatar
                              }
                              alt="Student Avatar"
                            />
                          </div>
                          <DetailValue style={{ textTransform: "capitalize" }}>
                            <DetailLabel>Full Name:</DetailLabel>
                            {result?.first_name} {result?.last_name}
                          </DetailValue>
                        </CardHeader>
                      </LeftSide>

                      <CompanyDetails>
                        <DetailItem>
                          <Titles>Placement Results</Titles>
                          <DetailLabel>Company Name:</DetailLabel>
                          <DetailValue>
                            {result?.company_details?.company_name}
                          </DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Location:</DetailLabel>
                          <DetailValue>
                            {result?.company_details?.location}
                          </DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Industry Sector:</DetailLabel>
                          <DetailValue>
                            {result?.company_details?.industry_sector}
                          </DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Website:</DetailLabel>
                          <DetailValue>
                            {result?.company_details?.website}
                          </DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Email:</DetailLabel>
                          <DetailValue>
                            {result?.company_details?.contact_email}
                          </DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Phone Number:</DetailLabel>
                          <DetailValue>
                            {result?.company_details?.phone_number}
                          </DetailValue>
                        </DetailItem>
                      </CompanyDetails>
                    </PlacementCard>
                  </PlacementItem>
                ))}
              </PlacementList>
            )}
          </>
        )}
      </PlacementContainer>
    </>
  );
};

export default PlacementResults;
