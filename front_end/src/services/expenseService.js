import axios from "axios";

export const getExpensesBySite = async (id) => {
  try {
  const response = await axios.get(`http://localhost:3000/expense/${id}`);
  return response.data;
  }catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch expenses");
  }
}

export const getLastFewExpenses = async (id) => {
  try{
    const response = await axios.get(`http://localhost:3000/expense/${id}/filter?limit=5`);
    return response.data;
  }catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch last expenses");
  }
}

export const getFilteredExpenses = async (id , startDate , endDate) => {
  try{
    const response = await axios.get(`http://localhost:3000/expense/${id}/filter?from=${startDate}&to=${endDate}`);
    return response.data;
  }catch(err){
    throw new Error(err.response?.data?.message || "Failed to fetch filtered expenses");
  }
}

export const addExpens = async (materialData) => {
  try{
    const response = await axios.post("http://localhost:3000/add-expense",materialData,  {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data;
  }catch (err) {
    console.log("error to add expense" , err);   
  }
}
