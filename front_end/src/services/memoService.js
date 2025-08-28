import axios from 'axios'

export const getMemosBySite = async (id) => {
  const response = await axios.get(`http://localhost:3000/memo/${id}`)
  return response.data; 
}

export const addMemo = async (memoData) => {
  const response = await axios.post("http://localhost:3000/add-memo",memoData,{
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data;
}