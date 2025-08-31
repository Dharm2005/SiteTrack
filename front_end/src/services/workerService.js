import axios from "axios";

export const getWorkersBySite = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/worker/${id}`);
    return response.data;
  }catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch workers");
  }
}

export const getAdvancesByWorker = async (workerId) => {
  try{
    const response = await axios.get(`http://localhost:3000/worker/${workerId}/advance`);
    return response.data;
  } catch(err) {
    throw new Error(err.response?.data?.message || "Failed to fetch advances");
  }
}

export const addWorker = async (workerData) => {
  try{
    const response = await axios.post("http://localhost:3000/add-worker",workerData,  {
      headers: { "Content-Type": "multipart/form-data" },
    })
    
    return response.data;
  }catch (err) {
    console.log("error to add worker" , err);   
  }
}