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