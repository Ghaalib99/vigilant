// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const baseUrl = "https://api.npfvigilant.ng";

export const fetchAllIncidents = async (authToken, page = 1, perPage = 4) => {
  try {
    const response = await fetch(
      `${baseUrl}/admin/dashboard/incidents?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
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

export const fetchIncidents = async (authToken) => {
  try {
    const response = await fetch(`${baseUrl}/admin/dashboard/index`, {
      method: "GET",
      headers: {
        Accept: "application/json",
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
        Accept: "application/json",
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
          Accept: "application/json",

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

export const declineIncident = async (authToken, id) => {
  try {
    const response = await fetch(
      `${baseUrl}/admin/incidents/respond/${id}/decline`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",

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

export const addComment = async (authToken, payload) => {
  try {
    const response = await fetch(`${baseUrl}/admin/comment/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding comment:", error.message);
    throw error;
  }
};

export const assignIncident = async (authToken, payload) => {
  try {
    const response = await fetch(`${baseUrl}/admin/incidents/make-assignment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: payload,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding comment:", error.message);
    throw error;
  }
};

export const fetchBanks = async (authToken) => {
  try {
    const response = await fetch(`${baseUrl}/admin/banks/get`, {
      method: "GET",
      headers: {
        Accept: "application/json",
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
    console.error("Error fetching banks:", error.message);
    throw error;
  }
};

export const fetchEntities = async (authToken) => {
  try {
    const response = await fetch(`${baseUrl}/admin/entities/get`, {
      method: "GET",
      headers: {
        Accept: "application/json",
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
    console.error("Error fetching banks:", error.message);
    throw error;
  }
};

export const fetchSegments = async (authToken, payload) => {
  try {
    const response = await fetch(`${baseUrl}/admin/incidents/segment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchIncidentComments = async (authToken, incidentId) => {
  try {
    const response = await fetch(`${baseUrl}/admin/comment/all/${incidentId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
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
    console.error("Error fetching banks:", error.message);
    throw error;
  }
};

export const fetchIncidentlogs = async (
  authToken,
  incidentId,
  page = 1,
  perPage = 4
) => {
  try {
    const response = await fetch(
      `${baseUrl}/admin/dashboard/incident/${incidentId}/logs?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
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
    console.error("Error fetching incident logs:", error.message);
    throw error;
  }
};
