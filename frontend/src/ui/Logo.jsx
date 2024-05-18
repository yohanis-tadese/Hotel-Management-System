import { useDarkMode } from "../context/DarkModeContext";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
  border-bottom: 0.5px solid #7dc400;
`;

const Img = styled.img`
  height: 8.6rem;
  width: auto;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();

  const src = isDarkMode ? "/logo-dark.png" : "/logo-light.png";

  return (
    <NavLink>
      <StyledLogo>
        <Img src={src} alt="Logo" />
      </StyledLogo>
    </NavLink>
  );
}

export default Logo;
