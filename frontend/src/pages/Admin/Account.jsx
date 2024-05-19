import UpdatePassword from "../../components/Admin/UpdateProfile/UpdatePassword";
import UpdateProfile from "../../components/Admin/UpdateProfile/UpdateProfile";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";

function Account() {
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

export default Account;
