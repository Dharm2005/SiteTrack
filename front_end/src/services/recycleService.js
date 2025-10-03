import api from "./api";

export const getDeletedSites = async () => {
  try {
    const response = await api.get("http://localhost:3000/recycle/getDeletedSites")
    return response.data;
  } catch (error) {
    console.error("Error while fetching all sites", error)
  }
}

export const getDeletedManagers = async () => {
  try {
    const response = await api.get("http://localhost:3000/recycle/getDeletedManagers")
    return response.data;
  } catch (error) {
    console.error("Error while fetching all managers", error)
  }
}

export const getDeletedWorkers = async (siteId) => {
  try {
    const response = await api.get(`http://localhost:3000/recycle/getDeletedWorkers/${siteId}`)
    return response.data;
  } catch (error) {
    console.error("Error while fetching all workers", error)
  }
}

export const getDeletedMemos = async (siteId) => {
  try {
    const response = await api.get(`http://localhost:3000/recycle/getDeletedMemos/${siteId}`)
    return response.data;
  } catch (error) {
    console.error("Error while fetching all memos", error)
  }
}

export const getDeletedExpenses = async (siteId) => {
  try {
    const response = await api.get(`http://localhost:3000/recycle/getDeletedExpenses/${siteId}`)
    return response.data;
  } catch (error) {
    console.error("Error while fetching all expenses", error)
  }
}

export const deleteSitePer = async (siteId) => {
  try {
    const response = await api.delete(`http://localhost:3000/recycle/site/delete/${siteId}`)
    return response.data;
  } catch (error) {
    console.error("Error while deleting site permanently", error)
  }
}

export const restoreSite = async (siteId) => {
  try {
    const response = await api.patch(`http://localhost:3000/recycle/site/restore/${siteId}`)
    return response.data;
  } catch (error) {
    console.error("Error while restoring deleted site", error)
  }
}

export const deleteManagerPer = async (managerId) => {
  try {
    const response = await api.delete(`http://localhost:3000/recycle/manager/delete/${managerId}`)
    return response.data;
  } catch (error) {
    console.error("Error while deleting manager permanently", error)
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        sites: error.response.data.sites,
        message: error.response.data.message,
      };
    }
    return {
      success: false,
      status: null,
      sites: error.response.data.sites || [],
      message: error.response.data.message || "Network error",
    }
  }
}

export const restoreManager = async (managerId) => {
  try {
    const response = await api.patch(`http://localhost:3000/recycle/manager/restore/${managerId}`)
    return response.data;
  } catch (error) {
    console.error("Error while restoring deleted manager", error)
  }
}

export const deleteExpensePer = async (expenseId) => {
  try {
    const response = await api.delete(`http://localhost:3000/recycle/expense/delete/${expenseId}`)
    return response.data;
  } catch (error) {
    console.error("Error while deleting manager permanently", error)
  }
}

export const restoreExpense = async (expenseId) => {
  try {
    const response = await api.patch(`http://localhost:3000/recycle/expense/restore/${expenseId}`)
    return response.data;
  } catch (error) {
    console.error("Error while restoring deleted manager", error)
  }
}

export const deleteWorkerPer = async (workerId) => {
  try {
    const response = await api.delete(`http://localhost:3000/recycle/worker/delete/${workerId}`)
    return response.data;
  } catch (error) {
    console.error("Error while deleting worker permanently", error)
  }
}

export const restoreWorker = async (workerId) => {
  try {
    const response = await api.patch(`http://localhost:3000/recycle/worker/restore/${workerId}`)
    return response.data;
  } catch (error) {
    console.error("Error while restoring deleted worker", error)
  }
}

export const deleteMemoPer = async (memoId) => {
  try {
    const response = await api.delete(`http://localhost:3000/recycle/memo/delete/${memoId}`)
    return response.data;
  } catch (error) {
    console.error("Error while deleting memo permanently", error)
  }
}

export const restoreMemo = async (memoId) => {
  try {
    const response = await api.patch(`http://localhost:3000/recycle/memo/restore/${memoId}`)
    return response.data;
  } catch (error) {
    console.error("Error while restoring deleted memo", error)
  }
}