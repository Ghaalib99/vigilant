const baseUrl = "http://24.199.107.202";

export const fetchIncidents = async (authToken) => {
  try {
    const response = await fetch(
      `${baseUrl}/admin/dashboard/index?query=66bhassd`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching incidents:", error.message);
    throw error;
  }
};
