import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./../DarkModeToggle";
import { useAuth } from "../../context/AuthContext";
import loginService from "../../services/login.service";
import { FaSignOutAlt } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";

// import Heading from "./Heading";

const StyledHeaderMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
`;

const WelcomeMessage = styled.span`
  font-weight: bold;
  font-size: 14px;
  text-transform: capitalize;
  letter-spacing: 1px;
`;

const StyledButton = styled.button`
  background-color: #08b3c1;
  border: none;
  border-radius: 20px;
  color: #ffffff;
  padding: 5px 10px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #087aa4;
    border-radius: 20px;
    color: #ffffff;
  }
`;

function HeaderMenu() {
  const navigate = useNavigate();
  const { setIsLogged, secondName } = useAuth();

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "logoutEvent") {
        logOut();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logOut = () => {
    // Call the logout function from the login service
    loginService.logOut();
    // Set the isLogged state to false
    setIsLogged(false);

    // Navigate to the login page
    navigate("/login");
  };

  return (
    <StyledHeaderMenu>
      <WelcomeMessage>Wellcome, {secondName}</WelcomeMessage>

      <DarkModeToggle />

      <StyledButton onClick={logOut}>
        <FaSignOutAlt /> Logout
      </StyledButton>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
