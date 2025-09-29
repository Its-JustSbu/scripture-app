const coustomFetch = async (url: any, options: any = {}) => {
  const modifiedOptions = { ...options };

  modifiedOptions.headers = {
    ...modifiedOptions.headers,
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
  };

  try {
    const response = await fetch(url, modifiedOptions);

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Unauthorized! Refreshing token...");
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export default coustomFetch;
