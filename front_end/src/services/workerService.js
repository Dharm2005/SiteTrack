import api from "./api";

export const addWorker = async (workerData) => {
  try {
    const response = await api.post("http://localhost:3000/workers/add-worker", workerData, {
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

export const getWorkersBySite = async (id) => {
  try {
    const response = await api.get(`http://localhost:3000/workers/worker/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch workers");
  }
}

export const getWorkerById = async (id) => {
  try {
    const response = await api.get(`http://localhost:3000/workers/worker/data/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching worker by id", error);
  }
}

export const deleteWorkerFromDB = async (workerId, siteId) => {
  try {
    const response = await api.delete(`http://localhost:3000/workers/${siteId}/worker/${workerId}`)
    return response.data;
  } catch (error) {
    console.error("Error while deleting worker" , error);
    
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

export const updateWorkerToDB = async (workerId, workerData) => {
  try {
    const response = await api.put(`http://localhost:3000/workers/worker/${workerId}`,
      workerData,
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
    };
  }
}

export const getAdvancesByWorker = async (workerId) => {
  try {
    const response = await api.get(`http://localhost:3000/workers/worker/${workerId}/advance`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch advances");
  }
}

export const addAdvanceOfWorker = async (advanceData) => {
  try {
    const response = await api.post(`http://localhost:3000/workers/worker/add-advance`, 
      advanceData, 
      {headers: { "Content-Type": "multipart/form-data" },}
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
    };
  }
}

export const updateAdvanceToDB = async (advanceId, siteId, advanceData) => {
  try {
    const response = await api.put(`http://localhost:3000/workers/${siteId}/worker/advance/${advanceId}`,
      advanceData,
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
    };
  }
}

export const getEarnByWorker = async (workerId) => {
  try {
    const response = await api.get(`http://localhost:3000/workers/worker/${workerId}/earn`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch earn");
  }
}

export const addEarnOfWorker = async (earnData) => {
  try {
    const response = await api.post("http://localhost:3000/workers/worker/add-earn", earnData, {
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

export const updateEarnToDB = async (earnId, siteId, earnData) => {
  try {
    const response = await api.put(`http://localhost:3000/workers/${siteId}/worker/earn/${earnId}`,
      earnData,
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
    };
  }
}

export const settledWorkerInDB = async (workerId, workerData) => {
  try {
    const response = await api.put(`http://localhost:3000/workers/worker/${workerId}/settle`,
      workerData,
      { headers: { "Content-Type": "application/json" } }
    )
    return response.data;
  } catch (error) {
    console.error("Error while settling worker", error)
  }
}