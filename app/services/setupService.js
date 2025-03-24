const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchSetupBanks = async (authToken) => {
  try {
    const response = await fetch(`${baseUrl}/admin/banks`, {
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

export const fetchSetupEntities = async (authToken) => {
  try {
    const response = await fetch(`${baseUrl}/admin/entities`, {
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

export const fetchSetupRoles = async (authToken) => {
  try {
    const response = await fetch(`${baseUrl}/admin/the-roles`, {
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
