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

  return <Button onClick={handlePrint}>Print</Button>;
};

export default PrintButton;

const printStyles = `
  /* Hide the button when printing */
  button {
    display: none;
  }

  /* Set the font size for headings */
  h1, h2, h3 {
    font-size: 18px;
  }

  /* Adjust table styles for better readability */
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

  /* Adjust margins for better layout */
  body {
    margin: 0;
    padding: 20px;
  }

  /* Adjust page layout */
  @page {
    size: A4;
    margin: 20mm 20mm 20mm 20mm;
  }
`;
