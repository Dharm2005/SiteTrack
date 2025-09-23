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