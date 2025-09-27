import api from "./api";

export const getAllSite = async () => {
  try {
    const response = await api.get("http://localhost:3000/sites/")
    return response.data;
  } catch (error) {
    console.error("Error while fetching all sites", error)
  }
}

export const addSite = async (siteData) => {
  try {
    const response = await api.post("http://localhost:3000/sites/add-site", siteData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        errors: error.response.data.errors || [],
        message: error.response.data.message || "Validation failed",
      };
    }
    return {
      success: false,
      status: null,
      errors: [],
      message: "Network error",
    };
  }
}

export const getSite = async (id) => {
  try {
    const response = await api.get(`http://localhost:3000/sites/site/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch site");
  }
};

export const markSiteCompleted = async (id) => {
  try {
    const response = await api.patch(`http://localhost:3000/sites/site/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to complete site");
  }
}

export const deleteSiteFromDB = async (id) => {
  try {
    const response = await api.delete(`http://localhost:3000/sites/site/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while delete site" , error);
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        errors: error.response.data.errors || [],
        message: error.response.data.message || "Validation failed",
      };
    }
    return {
      success: false,
      status: null,
      errors: [],
      message: "Network error",
    }
  }
}

export const updateSiteToDB = async (siteId, siteData) => {
  try {
    const response = await api.put(`http://localhost:3000/sites/site/${siteId}`,
      siteData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        errors: error.response.data.errors,
        message: error.response.data.message,
      };
    }
    return {
      success: false,
      status: null,
      errors: error.response.data.errors || [],
      message: error.response.data.message || "Network error",
    }
  }
}
