const api_url = "http://localhost:8080";

async function saveResults(formData) {
  try {
    const response = await fetch(`${api_url}/api/dept/send-results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save results");
    }
  } catch (error) {
    console.error("Error saving results:", error);
    throw error;
  }
}

async function getResultsByDepartmentId(departmentId) {
  try {
    const response = await fetch(
      `${api_url}/api/dept/results/${departmentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.results;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch results");
    }
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
}

async function getResultsByStudentId(studentId) {
  try {
    const response = await fetch(
      `${api_url}/api/dept/results/student/${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.results;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch results");
    }
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
}

async function updateResultsByStudentId(studentId, updateData) {
  try {
    const response = await fetch(
      `${api_url}/api/results/dept/update/${studentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update results");
    }
  } catch (error) {
    console.error("Error updating results:", error);
    throw error;
  }
}

const depResultService = {
  saveResults,
  getResultsByDepartmentId,
  getResultsByStudentId,
  updateResultsByStudentId,
};

export default depResultService;
