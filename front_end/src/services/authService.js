import axios from "axios";
import api from "./api"

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
      console.log(err);
      
      return {
        success : false,
        errors : err.response.data.errors || [],
        message : err.response.data.message || null
      }
    }
    return{
      success : false,
      errors : [],
      message : "Network Error"
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
      console.log(err);

      return {
        success : false,
        errors : err.response.data.errors || [],
        message : err.response.data.message || null
      }
    }
    return{
      success : false,
      errors : [],
      message : "Network Error"
    }
  }
}

export const changePassword = async (data) => {
  try {
    const response = await api.post("http://localhost:3000/auth/change-password",
      data,
      {headers : {"Content-Type" : "application/json"}}
    )
    
    return response.data
  } catch (err) {
    console.error("Error while changing password" , err);

    if(err.response){   
      return {
        success : false,
        errors : err.response.data.errors || ['Validation Error'],
        message : err.response.data.message || null
      }
    }
    return{
      success : false,
      message : "Network Error"
    }
  }
}