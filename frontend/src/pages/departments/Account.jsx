import UpdatePassword from "../../components/company/UpdateProfile/UpdatePassword";
import UpdateProfile from "../../components/company/UpdateProfile/UpdateProfile";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";

function CompanyAccount() {
  return (
    <>
      <Heading as="h1">Update your Account</Heading>

      <Row>
        <Heading as="h3">Update user data</Heading>
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
