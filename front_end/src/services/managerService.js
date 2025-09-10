import axios from 'axios'

export const getAllManager = async () => {
  try{
    const response = await axios.get("http://localhost:3000/managers")
    return response.data; 
  }
  catch(err){
    console.error("Error while getting managers" , err);
  }
}

export const addManager = async (managerData) => {
  try {
    const response = await axios.post("http://localhost:3000/add-manager",managerData,{
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data;
  } catch (error) {
    if(error.response){
      return{
        success: false,
        status: error.response.status,
        errors: error.response.data.errors || [],
        message: error.response.data.message || "Validation failed",
      };
    }
    return{
      success: false,
      status: null,
      errors: [],
      message:"Network error",
    };
  }
}

export const deleteManagerFromDB = async (managerId) => {
  try {
    const response = await axios.delete(`http://localhost:3000/manager/${managerId}`)
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete manager");
  }
}

export const updateManagerToDB = async (managerId ,managerData) => {
  try {
    const response = await axios.put(`http://localhost:3000/manager/${managerId}`,
      managerData,
      {headers : {"Content-Type" : "multipart/form-data"}}
    )
    return response.data
  } catch (error) {
    if(error.response){
      return{
        success: false,
        status: error.response.status,
        errors: error.response.data.errors || [],
        message: error.response.data.message || "Validation failed",
      };
    }
    return{
      success: false,
      status: null,
      errors: [],
      message:"Network error",
    };
  }
}

export const getManagerById = async (managerId) => {
  try {
    const response = await axios.get(`http://localhost:3000/manager/${managerId}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching manager" , error);
  }
}