// Import from the env
const api_url = "http://localhost:8080";

// A function to send post request to create a new company
const createCompany = async (formData) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/company`, requestOptions);
  return response;
};

// A function to send get request to get all companies
const getAllCompanies = async () => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(`${api_url}/api/company`, requestOptions);
  return response;
};

// A function to send put request to update a company
const updateCompany = async (companyId, formData) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  };
  const response = await fetch(
    `${api_url}/api/company/${companyId}`,
    requestOptions
  );
  return response;
};

// A function to send delete request to delete a company
const deleteCompany = async (companyId) => {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch(
    `${api_url}/api/company/${companyId}`,
    requestOptions
  );
  return response;
};

// Export all the functions
const companyService = {
  createCompany,
  getAllCompanies,
  updateCompany,
  deleteCompany,
};

export default companyService;
