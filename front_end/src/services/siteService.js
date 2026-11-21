import api from "./api";
import API_BASE_URL from "../config";

export const getAllSite = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/sites/`)
    return response.data;
  } catch (error) {
    console.error("Error while fetching all sites", error)
  }
}

export const addSite = async (siteData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/sites/add-site`, siteData, {
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
    const response = await api.get(`${API_BASE_URL}/sites/site/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch site");
  }
};

export const markSiteCompleted = async (id) => {
  try {
    const response = await api.patch(`${API_BASE_URL}/sites/site/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to complete site");
  }
}

export const deleteSiteFromDB = async (id) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/sites/site/${id}`);
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
    
    const response = await api.put(`${API_BASE_URL}/sites/site/${siteId}`,
      siteData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
    console.error(response.data);
    
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
