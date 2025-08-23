import axios from "axios";

export const getMaterialsBySite = async (id) => {
  try {
  const response = await axios.get(`http://localhost:3000/material/${id}`);
  return response.data;
  }catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch materials");
  }
}

export const addMaterial = async (materialData) => {
  try{
    const response = await axios.post("http://localhost:3000/add-material",materialData,  {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data;
  }catch (err) {
    console.log("error to add material" , err);   
  }
}
