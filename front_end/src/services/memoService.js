import axios from 'axios'

export const getMemosBySite = async (id) => {
  try{
    const response = await axios.get(`http://localhost:3000/memo/${id}`)
    return response.data; 
  }catch (error){
    console.error("Eerror while fetching memos",error);
  }
}

export const addMemo = async (memoData) => {

  try{
    const response = await axios.post("http://localhost:3000/add-memo",memoData,{
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data;
  } catch(error){
    console.error("Error while adding memo",error);
  }
}

export const deleteMemoFromDB = async (memoId) => {
  try {
    const response = await axios.delete(`http://localhost:3000/memo/${memoId}`);
    return response.data
  } catch (error) {
    console.error("Error while deleting memo from DB" , error);
  }
}