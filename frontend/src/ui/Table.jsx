import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--color-grey-200);
`;

export const TableHead = styled.thead`
  background-color: var(--color-grey-200);
`;

export const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  border: 1px solid var(--color-grey-300);
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: var(--color-grey-100);
  }
`;

export const TableCell = styled.td`
  padding: 11px;
  border: 1px solid var(--color-grey-200);
`;
