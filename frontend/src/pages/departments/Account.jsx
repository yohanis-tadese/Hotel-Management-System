import UpdatePassword from "../../components/department/UpdateProfile/UpdatePassword";
import UpdateProfile from "../../components/department/UpdateProfile/UpdateProfile";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";

function CompanyAccount() {
  return (
    <>
      <Row>
        <Heading as="h3">Update your profile</Heading>
        <UpdateProfile />
      </Row>

      <Row>
        <Heading as="h3">Update password</Heading>
        <UpdatePassword />
      </Row>
    </>
  );
}

export default CompanyAccount;
