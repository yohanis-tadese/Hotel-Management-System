// Import from the env
const api_url = "http://localhost:8080";

async function saveResults(formData) {
  try {
    const response = await fetch(`${api_url}/api/send-results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Check if the response is successful (status code 200-299)
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle errors if the response is not successful
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save results");
    }
  } catch (error) {
    // Handle errors if the request fails
    console.error("Error saving results:", error);
    throw error;
  }
}

async function getResultsByDepartmentId(departmentId) {
  try {
    const response = await fetch(`${api_url}/api/results/${departmentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is successful (status code 200-299)
    if (response.ok) {
      const data = await response.json();
      return data.results;
    } else {
      // Handle errors if the response is not successful
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch results");
    }
  } catch (error) {
    // Handle errors if the request fails
    console.error("Error fetching results:", error);
    throw error;
  }
}

async function getResultsByStudentId(studentId) {
  try {
    const response = await fetch(
      `${api_url}/api/results/student/${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is successful (status code 200-299)
    if (response.ok) {
      const data = await response.json();
      return data.results;
    } else {
      // Handle errors if the response is not successful
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch results");
    }
  } catch (error) {
    // Handle errors if the request fails
    console.error("Error fetching results:", error);
    throw error;
  }
}

async function updateResultsByStudentId(studentId, updateData) {
  try {
    const response = await fetch(`${api_url}/api/results/update/${studentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    // Check if the response is successful (status code 200-299)
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle errors if the response is not successful
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update results");
    }
  } catch (error) {
    // Handle errors if the request fails
    console.error("Error updating results:", error);
    throw error;
  }
}

const resultService = {
  saveResults,
  getResultsByDepartmentId,
  getResultsByStudentId,
  updateResultsByStudentId,
};

export default resultService;
