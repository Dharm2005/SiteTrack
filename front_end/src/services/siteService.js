import axios from 'axios'

export const getAllSite = async () => {
  const response = await axios.get("http://localhost:3000/")
  return response.data; 
}