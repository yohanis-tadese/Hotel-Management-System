import UpdatePassword from "../../components/student/Profile/ChnagePassword"; // Import the updated password change component
import UpdateProfile from "../../components/student/Profile/UpdateProfile";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import styled from "styled-components"; // Import styled-components for custom styling

const AccountContainer = styled.div`
  margin-top: 60px;
  background-color: var(--color-grey-100);
  padding: 30px;
`;

const UpdateSection = styled.div`
  margin-bottom: 20px;
`;

function StudentAccount() {
  return (
    <AccountContainer>
      <UpdateSection>
        <Heading as="h2">Update Your Data</Heading>
        <br />
        <UpdateProfile />
      </UpdateSection>

      <UpdateSection>
        <Heading as="h2">Update Password</Heading>
        <br />
        <UpdatePassword />
      </UpdateSection>
    </AccountContainer>
  );
}

export default StudentAccount;
