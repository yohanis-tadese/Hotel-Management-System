import SignupForm from "../../components/Admin/AdminUser/User";
import Heading from "../../ui/Heading";

function AdminUser() {
  return (
    <>
      <Heading as="h1">Create a new Admin</Heading>
      <br />
      <SignupForm />
    </>
  );
}

export default AdminUser;
