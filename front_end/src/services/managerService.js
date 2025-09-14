import api from "./api";


export const getAllManager = async () => {
  try {
    const response = await api.get("http://localhost:3000/managers/managers")
    return response.data;
  }
  catch (err) {
    console.error("Error while getting managers", err);
  }
}

export const addManager = async (managerData) => {
  try {
    const response = await api.post("http://localhost:3000/managers/add-manager", managerData, {
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

export const deleteManagerFromDB = async (managerId) => {
  try {
    const response = await api.delete(`http://localhost:3000/managers/manager/${managerId}`)
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete manager");
  }
}

export const updateManagerToDB = async (managerId, managerData) => {
  try {
    const response = await api.put(`http://localhost:3000/managers/manager/${managerId}`,
      managerData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
    return response.data
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

export const getManagerById = async (managerId) => {
  try {
    const response = await api.get(`http://localhost:3000/managers/manager/${managerId}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching manager", error);
  }
}

export const generatePDF = async (startDate, endDate, siteId) => {
  try {
    const response = await api.post(
      "http://localhost:3000/managers/reports",
      { startDate, endDate, siteId },
      { 
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      }
    );
    
    // Verify that we received a PDF
    if (response.data.type !== 'application/pdf') {
      throw new Error('Received invalid file format');
    }
    
    return response.data;
  } catch (error) {
    console.error("Error while generating PDF", error);
    throw error;
  }
};
