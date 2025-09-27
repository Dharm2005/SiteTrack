import api from "./api";

export const getExpensesBySite = async (id) => {
  try {
    const response = await api.get(`http://localhost:3000/expenses/expense/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch expenses");
  }
}

export const getExpenseById = async (id) => {
  try {
    const response = await api.get(`http://localhost:3000/expenses/expense/data/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching expense", error);
  }
}

export const getFilteredExpenses = async (id, startDate, endDate) => {
  try {
    const response = await api.get(`http://localhost:3000/expenses/expense/${id}/filter?from=${startDate}&to=${endDate}`);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch filtered expenses");
  }
}

export const addExpens = async (materialData) => {
  try {
    const response = await api.post("http://localhost:3000/expenses/add-expense", materialData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        errors: error.response.data.errors || [],
        message: error.response.data.message || "Validation failed"
      }
    }
    return {
      success: false,
      status: null,
      errors: [],
      message: "Network error"
    }
  }
}

export const deleteExpenseFromDB = async (expenseId, siteId) => {
  try {
    const response = await api.delete(`http://localhost:3000/expenses/${siteId}/expense/${expenseId}`)
    return response.data
  } catch (error) {
    console.error("Error while deleting expense", error);
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        errors: error.response.data.errors || [],
        message: error.response.data.message || "Validation failed"
      }
    }
    return {
      success: false,
      status: null,
      errors: [],
      message: "Network error"
    }
  }
}

export const updateExpenseToDB = async (expenseId, expenseData) => {
  try {
    const response = await api.put(`http://localhost:3000/expenses/expense/${expenseId}`,
      expenseData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        errors: error.response.data.errors || [],
        message: error.response.data.message || "Validation failed"
      }
    }
    return {
      success: false,
      status: null,
      errors: [],
      message: "Network error"
    }
  }
}