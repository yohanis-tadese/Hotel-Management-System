import Header from "../Home/Header";
import Footer from "../Home/Footer";
import styled from "styled-components";
import Heading from "./../../ui/Heading";
import Form from "../../ui/Form";

const ForgotLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 2.2rem;
  background-color: var(--color-grey-100);
`;

function ResetInstruction() {
  return (
    <>
      <Header />
      <ForgotLayout>
        <Form style={{ backgroundColor: "var(--color-grey-0)" }}>
          <Heading as="h2" style={{ color: "#1D9400" }}>
            Reset instruction is sent to your email
          </Heading>
          <p>Please check your email to reset your password.</p>
        </Form>
      </ForgotLayout>
      <Footer />
    </>
  );
}

export default ResetInstruction;
