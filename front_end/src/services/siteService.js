import axios from 'axios'

export const getAllSite = async () => {
  try {
    const response = await axios.get("http://localhost:3000/")
    return response.data;
  } catch (error) {
    console.error("Error while fetching all sites", error)
  }
}

export const addSite = async (siteData) => {
  try {
    const response = await axios.post("http://localhost:3000/add-site", siteData, {
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
    const response = await axios.get(`http://localhost:3000/site/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch site");
  }
};

export const deleteSiteFromDB = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:3000/site/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete site");
  }
}

export const updateSiteToDB = async (siteId, siteData) => {
  try {
    const response = await axios.put(`http://localhost:3000/site/${siteId}`,
      siteData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
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
    }
  }
}
