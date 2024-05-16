import styled from "styled-components";

const Box = styled.div`
  position: relative;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  color: var(--color-grey-600);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-1px);
  }

  h2 {
    font-size: 1.6rem;
    margin-bottom: 10px;
    color: var(--color-grey-600);
  }

  h3 {
    font-size: 2.7rem;
    margin-bottom: 30px;
    color: var(--color-grey-600);
  }
`;

export default Box;
