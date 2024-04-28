import styled from "styled-components";
import StudentPlacement from "../../components/Admin/Algorithm/Placement";

const GenerateContainer = styled.div`
  margin-top: -10px;
`;

const Generate = () => {
  return (
    <GenerateContainer>
      <StudentPlacement />
    </GenerateContainer>
  );
};

export default Generate;
