import axios from "axios";

export const getWorkersBySite = async (id) => {
  try {
  const response = await axios.get(`http://localhost:3000/worker/${id}`);
  return response.data;
  }catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch workers");
  }
}

export const addWorker = async (workerData) => {
  try{
    const response = await axios.post("http://localhost:3000/add-worker",workerData,  {
      headers: { "Content-Type": "multipart/form-data" },
    })
    console.log(response.data);
    
    return response.data;
  }catch (err) {
    console.log("error to add worker" , err);   
  }
}
