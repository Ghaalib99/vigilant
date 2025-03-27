const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchAllNotifications = async (authToken) => {
  try {
    const response = await fetch(`${baseUrl}/notifications`, {
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
    console.error("Error fetching notifications:", error.message);
    throw error;
  }
};

export const fetchReadNotifications = async (authToken) => {
  try {
    const response = await fetch(`${baseUrl}/notifications/read`, {
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
    console.error("Error fetching notifications:", error.message);
    throw error;
  }
};

export const fetchUnreadNotifications = async (authToken) => {
  try {
    const response = await fetch(`${baseUrl}/notifications/unread`, {
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
    console.error("Error fetching notifications:", error.message);
    throw error;
  }
};

export const fetchNotificationDetails = async (authToken, id) => {
  try {
    const response = await fetch(`${baseUrl}/notifications/${id}/details`, {
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
    console.error("Error fetching notifications:", error.message);
    throw error;
  }
};

export const markNotificationAsRead = async (authToken, id) => {
  try {
    const response = await fetch(`${baseUrl}/notifications/${id}/read`, {
      method: "POST",
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
    console.error("Error fetching notifications:", error.message);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (authToken, id) => {
  try {
    const response = await fetch(`${baseUrl}/notifications/read/all`, {
      method: "POST",
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
    console.error("Error fetching notifications:", error.message);
    throw error;
  }
};
