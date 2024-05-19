// Import from the env
const api_url = "http://localhost:8080";

// Function to send a PATCH request to update time entry
const updateTime = async (id, formdata) => {
  try {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formdata),
    };
    const response = await fetch(
      `${api_url}/api/time/update/${id}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Failed to update time entry");
    }
    return response.json();
  } catch (error) {
    console.error("Error updating time entry:", error.message);
    throw new Error("Failed to update time entry");
  }
};

// Function to send a GET request to fetch time entry by ID
const getTimeById = async (timeId) => {
  try {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(
      `${api_url}/api/time/${timeId}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Failed to fetch time entry");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching time entry by ID:", error.message);
    throw new Error("Failed to fetch time entry by ID");
  }
};

// Export all the functions
const timeService = {
  getTimeById,
  updateTime,
};

export default timeService;
