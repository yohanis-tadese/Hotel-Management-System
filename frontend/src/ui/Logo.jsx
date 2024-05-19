import { useDarkMode } from "../context/DarkModeContext";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
  border-bottom: 1px solid var(--color-grey-300);
  margin-left: -10px;
  margin-right: -7px;
`;

const Img = styled.img`
  height: 5.4rem;
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
