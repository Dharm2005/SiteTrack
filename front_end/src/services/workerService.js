import axios from "axios";

export const getWorkersBySite = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/worker/${id}`);
    return response.data;
  }catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch workers");
  }
}

export const getWorkerById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/worker/data/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching worker by id" , error);
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

export const addAdvanceOfWorker = async (advanceData) => {
  try {
    const response = await axios.post("http://localhost:3000/worker/add-advance",advanceData,{
      headers: {"Content-Type": "multipart/form-data"},
    })
    return response.data;
  } catch (error) {
    console.error("Error while adding advance ",error);
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

export const deleteWorkerFromDB = async (workerId) => {
  try{
    const response = await axios.delete(`http://localhost:3000/worker/${workerId}`)
    return response.data;
  }catch (err){
    throw new Error(err.response?.data?.message || "Failed to delete worker");
  }
}

export const updateWorkerToDB = async (workerId , workerData) => {
  try {
    const response = await axios.put(`http://localhost:3000/worker/${workerId}`,
      workerData,
      {headers : {"Content-Type" : "multipart/form-data"}}
    )
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update worker");
  }
}

export const updateAdvanceToDB = async (advanceId , advanceData) => {
  try{
    const response = await axios.put(`http://localhost:3000/worker/advance/${advanceId}`,
      advanceData,
      {headers : {"Content-Type" : "multipart/form-data"}}
    )
    return response.data;
    
  } catch (error) {
    console.error("Error while editing advance",error);
  }
}