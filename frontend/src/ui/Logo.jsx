import { useDarkMode } from "../context/DarkModeContext";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2); /* Add box-shadow */
`;

const Img = styled.img`
  height: 8.6rem;
  width: auto;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();

  const src = isDarkMode ? "/logo-dark.png" : "/logo-light.png";

  return (
    <NavLink to="/admin/dashboard">
      <StyledLogo>
        <Img src={src} alt="Logo" />
      </StyledLogo>
    </NavLink>
  );
}

export default Logo;
