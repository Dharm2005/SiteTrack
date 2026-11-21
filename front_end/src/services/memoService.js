import api from "./api";
import API_BASE_URL from "../config";

export const getMemosBySite = async (id) => {
  try {
    const response = await api.get(`${API_BASE_URL}/memos/memo/${id}`)
    return response.data;
  } catch (error) {
    console.error("Eerror while fetching memos", error);
  }
}

export const addMemo = async (memoData) => {

  try {
    const response = await api.post(`${API_BASE_URL}/memos/add-memo`, memoData, {
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
      message: "Network error"
    }
  }
}

export const deleteMemoFromDB = async (memoId, siteId) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/memos/${siteId}/memo/${memoId}`);
    return response.data
  } catch (error) {
    console.error("Error while deleting memo from DB", error);
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        errors: error.response.data.errors || [],
        message: error.response.data.message || "Validation failed"
      }
    }
    return {
      success: false,
      status: null,
      errors: [],
      message: "Network error"
    }
  }
}

export const completeMemoInDB = async (memoId, siteId, memoData) => {
  try {
    const response = await api.put(`${API_BASE_URL}/memos/${siteId}/memo/${memoId}`,
      memoData,
      { headers: { "Content-Type": "application/json" } }
    )
    return response.data;
  } catch (error) {
    console.error("Error while copmleting memo", error)
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        errors: error.response.data.errors || [],
        message: error.response.data.message || "Validation failed"
      }
    }
    return {
      success: false,
      status: null,
      errors: [],
      message: "Network error"
    }
  }
}