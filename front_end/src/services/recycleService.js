import api from "./api";

export const getDeletedSites = async () => {
  try {
    const response = await api.get("http://localhost:3000/recycle/getDeletedSites")
    return response.data;
  } catch (error) {
    console.error("Error while fetching all sites", error)
  }
}