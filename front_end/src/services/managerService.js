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
  } catch (error) {
     if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message || "Validation failed",
      };
    }
    return {
      success: false,
      status: null,
      message: "Network error",
    };
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
  } catch (err) {
    console.error("Error while generating report", err);
    console.log(err.response);

    if (err.response) {
      let errorMessage = "Validation failed";

      try {
        // Try to parse blob into JSON
        const text = await err.response.data.text();
        const json = JSON.parse(text);
        errorMessage = json.errors || json.message || errorMessage;
      } catch (parseErr) {
        console.error("Failed to parse error response:", parseErr);
      }

      return {
        success: false,
        errors: errorMessage,
      };
    }

  }
};
