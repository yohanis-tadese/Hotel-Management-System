import styled from "styled-components";
import Logo from "../Logo";
import DepMainNav from "./DepartmentMainNav";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 1rem 0.7rem;
  border-right: 1px solid var(--color-grey-200);

  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
`;

function DepSidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <DepMainNav />
    </StyledSidebar>
  );
}

export default DepSidebar;
