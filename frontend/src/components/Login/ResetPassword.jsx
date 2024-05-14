import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import FormRowVertical from "./../../ui/FormRowVertical";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "../../ui/Form";
import Heading from "../../ui/Heading";
import styled from "styled-components";
import Footer from "../Home/Footer";
import Header from "../Home/Header";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

const ResetLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-100);
`;

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sucess, setSucess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  console.log("Password:", password);
  console.log("Token:", token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    if (!password) {
      setError("Password cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.patch(
        `http://localhost:8080/api/reset-password/${token}`,
        {
          newPassword: password,
        }
      );

      console.log("Response:", res.status);

      if (res.status === 200) {
        setSucess("Password reset successfully");

        setTimeout(() => {
          if (navigate) {
            navigate("/login");
          }
        }, 2000);
      } else {
        setError("Failed to reset password");
      }
    } catch (err) {
      setError("Failed to reset password");
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <ResetLayout>
        <Form onSubmit={handleSubmit}>
          {error && (
            <p
              style={{
                color: "red",
                textAlign: "center",
                marginBottom: "-5px",
              }}
            >
              {error}
            </p>
          )}
          {sucess && (
            <p
              style={{
                color: "#1BA345",
                textAlign: "center",
                borderRadius: "7px",
              }}
            >
              {sucess}
            </p>
          )}

          <br />

          <Heading as="h2" style={{ color: "#1D9400" }}>
            Enter New password
          </Heading>
          <p>Please enter the password you want to use</p>
          <FormRowVertical>
            <Input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormRowVertical>
          <FormRowVertical>
            <Button type="submit" size="large" disabled={loading}>
              {loading ? "Loading..." : "Save new password"}
            </Button>
          </FormRowVertical>
        </Form>
        <ToastContainer />
      </ResetLayout>
      <Footer />
    </>
  );
}

export default ResetPassword;
