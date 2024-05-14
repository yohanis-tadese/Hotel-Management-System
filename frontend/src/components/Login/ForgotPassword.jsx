import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Home/Header";
import Footer from "../Home/Footer";
import FormRowVertical from "./../../ui/FormRowVertical";
import Input from "../../ui/Input";
import styled from "styled-components";
import Heading from "./../../ui/Heading";
import Button from "../../ui/Button";
import Form from "../../ui/Form";

const ForgotLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-100);
`;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/forgot-password",
        { email }
      );
      if (res.data.message === "Password reset instructions sent") {
        navigate("/goto-email");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <>
      <Header />
      <ForgotLayout>
        <Form onSubmit={handleSubmit}>
          <Heading style={{ color: "#1D9400" }} as="h2">
            Reset your password
          </Heading>
          <p>
            Fill in your e-mail address below and we will send you an email with
            further instructions.
          </p>
          <FormRowVertical>
            <Input
              type="email"
              autoComplete="on"
              name="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormRowVertical>
          <FormRowVertical>
            <Button type="submit" size="large">
              Reset Your Password
            </Button>
            <Link style={{ color: "#FE8402", fontSize: "16px" }} to="/login">
              Back to Login?
            </Link>
          </FormRowVertical>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </Form>
      </ForgotLayout>
      <Footer />
    </>
  );
}

export default ForgotPassword;
