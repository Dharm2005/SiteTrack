import axios from "axios";

export const login = async (data) => {
  try{
    const response = await axios.post("http://localhost:3000/auth/login" , 
      data ,
      {headers : { "Content-Type": "application/json" }}
    )
    return response.data;
    
  }catch(err){
    console.error("Error while login" , err);
    if(err.response){
      return {
        success : false,
        error : err.response.data.message || "Something went wrong"
      }
    }
    return{
      success : false,
      error : "Network Error"
    }
  }
}

export const signup = async (data) => {
  try {
    const response = await axios.post("http://localhost:3000/auth/signup",
      data,
      {headers : {"Content-Type" : "application/json"}}
    )
    return response.data
  } catch (err) {
    console.error("Error while registration" , err);
    if(err.response){
      return {
        success : false,
        error : err.response.data.message || "Something went wrong"
      }
    }
    return{
      success : false,
      error : "Network Error"
    }
  }
}