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
    console.error("Error while adding manager ", error);
  }
}