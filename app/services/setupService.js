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

export const createUser = async (authToken, payload) => {
  try {
    const response = await fetch(`${baseUrl}/admin/auth/register-admin`, {
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
    console.error("Error creating user:", error.message);
    throw error;
  }
};

export const fetchPendingActions = async (authToken) => {
  try {
    const response = await fetch(
      `${baseUrl}/admin/admin-members/pending-actions`,
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
    console.error("Error fetching pending actions:", error.message);
    throw error;
  }
};

export const fetchDeclinedActions = async (authToken) => {
  try {
    const response = await fetch(
      `${baseUrl}/admin/admin-members/declined-actions`,
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
    console.error("Error declined actions:", error.message);
    throw error;
  }
};

export const fetchApprovedActions = async (authToken) => {
  try {
    const response = await fetch(
      `${baseUrl}/admin/admin-members/approved-actions`,
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
    console.error("Error declined actions:", error.message);
    throw error;
  }
};

export const approveAction = async (authToken, payload) => {
  try {
    const response = await fetch(
      `${baseUrl}/admin/admin-members/approve-action`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

export const declineAction = async (authToken, payload) => {
  try {
    const response = await fetch(
      `${baseUrl}/admin/admin-members/decline-action`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};
