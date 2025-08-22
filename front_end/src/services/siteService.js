import axios from 'axios'

export const getAllSite = async () => {
  const response = await axios.get("http://localhost:3000/")
  return response.data; 
}

export const addSite = async (siteData) => {
  const response = await axios.post("http://localhost:3000/add-site",siteData,{
      headers: { "Content-Type": "multipart/form-data" },
    })
  return response.data;
}

export const getSite = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/site/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch site");
  }
};
