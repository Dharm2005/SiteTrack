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
  }
}