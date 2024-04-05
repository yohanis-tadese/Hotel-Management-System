import React from "react";
import styled from "styled-components";

// Styled component for the main container
const MainContainer = styled.div`
  padding: 20px;
`;

// Styled component for the section title
const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: var(--color-grey-600);
  margin-bottom: 20px;
  text-align: center; /* Center align the text */
  margin-top: 100px;
`;

// Styled component for the content container
const ContentContainer = styled.div`
  background-color: var(--color-grey-100);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Main = () => {
  return (
    <MainContainer>
      <SectionTitle>Welcome to Internship Placement System</SectionTitle>
      <ContentContainer>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis hic
        molestias ea inventore enim odit itaque, cumque soluta necessitatibus
        quisquam ducimus saepe architecto odio? Esse exercitationem fugit
        provident natus sapiente.
      </ContentContainer>
    </MainContainer>
  );
};

export default Main;
