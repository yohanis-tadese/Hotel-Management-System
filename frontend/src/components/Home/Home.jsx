import { NavLink } from "react-router-dom";
import banner from "/interships.png";
import styled from "styled-components";

const Container = styled.section`
  background-color: var(--color-grey-100);
  padding: 8rem 0 9.8rem 0;
  width: 100%;
  height: 100vh;
`;

const HeroWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 9.8rem;
  max-width: 130rem;
  margin: 0 auto;
  padding: 0 3.2rem;
`;

const HeroText = styled.div``;

const HeadingPrimary = styled.h1`
  font-size: 3.2rem;
  line-height: 1.4;
  letter-spacing: -0.5px;
  margin-bottom: 3.2rem;
  font-weight: 700;
`;

const HeroDescription = styled.p`
  font-size: 2rem;
  line-height: 1.6;
  margin-bottom: 4.8rem;
`;

const NavLinkButton = styled(NavLink)`
  display: inline-block;
  font-size: 2rem;
  text-decoration: none;
  padding: 1.2rem 3.2rem;
  border-radius: 1rem;
  transition: background-color 0.6s;

  &.btn-full {
    background-color: #e67e22;
    color: white;

    &:hover,
    &:active {
      background-color: #d69124;
    }
  }

  &.btn-outline {
    background-color: #1a4440;
    color: #fff;

    &:hover,
    &:active {
      background-color: #1a5550;
    }
  }

  &.margin-right-sm {
    margin-right: 1.7rem;
  }
`;

const HeroImage = styled.div``;

const Main = () => {
  return (
    <Container>
      <HeroWrapper>
        <HeroText>
          <HeadingPrimary>Internship Placement Portal.</HeadingPrimary>
          <HeroDescription>
            Explore tailored placement opportunities generated by algorithms to
            match your unique strengths and ambitions. Our mission is to ensure
            accessible and impactful career advancement for all.
          </HeroDescription>
          <NavLinkButton to="/login" className="btn btn-full margin-right-sm">
            Login
          </NavLinkButton>
          <NavLinkButton to="/FAQ" className="btn btn-outline">
            For more
          </NavLinkButton>
        </HeroText>
        <HeroImage>
          <img src={banner} className="hero-img" alt="internship logo" />
        </HeroImage>
      </HeroWrapper>
    </Container>
  );
};

export default Main;
