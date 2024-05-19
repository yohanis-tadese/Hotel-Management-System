import React from "react";
import Button from "./Button";

const PrintButton = ({ printableElementId }) => {
  const handlePrint = () => {
    const printableElement = document.getElementById(printableElementId);
    if (printableElement) {
      const html = printableElement.outerHTML;
      const newWindow = window.open("", "_blank");
      newWindow.document.head.innerHTML = `
        <style>
          ${printStyles}
        </style>
      `;
      newWindow.document.body.innerHTML = html;
      newWindow.print();
      newWindow.close();
    } else {
      console.error("Printable element not found");
    }
  };

  return (
    <Button style={{ padding: "11px 32px " }} onClick={handlePrint}>
      Print
    </Button>
  );
};

export default PrintButton;

const printStyles = `
 
  button {
    display: none;
  }

  h1, h2, h3 {
    font-size: 18px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    padding: 8px;
    border: 1px solid #ddd;
  }

  thead {
    background-color: #f2f2f2;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  body {
    margin: 0;
    padding: 20px;
  }

   @page {
    size: A4;
    margin: 20mm 20mm 20mm 20mm;
  }
`;
