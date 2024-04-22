import { Outlet } from "react-router-dom";
import Header from "./Header";
import styled from "styled-components";
import CompnySidebar from "./CompnySidebar";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 24rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
`;

function CompanyAppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <CompnySidebar />
      <Main>
        <Outlet />
      </Main>
    </StyledAppLayout>
  );
}

export default CompanyAppLayout;
