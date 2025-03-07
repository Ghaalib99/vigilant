const baseUrl = "http://24.199.107.202";

export const fetchIncidents = async (authToken) => {
  try {
    const response = await fetch(`${baseUrl}/admin/dashboard/index`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching incidents:", error.message);
    throw error;
  }
};

export const fetchIncident = async (authToken, id) => {
  try {
    const response = await fetch(`${baseUrl}/admin/dashboard/incident/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching incident:", error.message);
    throw error;
  }
};

export const acceptIncident = async (authToken, id) => {
  try {
    const response = await fetch(
      `${baseUrl}/admin/incidents/respond/${id}/accept`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching incident:", error.message);
    throw error;
  }
};
