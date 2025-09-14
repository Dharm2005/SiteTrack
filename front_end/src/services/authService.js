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