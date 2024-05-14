import Header from "../../components/Home/Header";
import Footer from "../../components/Home/Footer";
import styled from "styled-components";
import LoginForm from "../../components/Login/LoginForm";
import Heading from "../../ui/Heading";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-100);
`;

function Login() {
  return (
    <>
      <LoginLayout>
        <Header />
        <br />
        <LoginForm />
      </LoginLayout>
      <Footer />
    </>
  );
}

export default Login;
