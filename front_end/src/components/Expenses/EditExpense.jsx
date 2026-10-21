import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {getExpenseById} from '../../services/expenseService'
import AddExpenseForm from './AddExpenseForm'

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expenseData, setExpenseData] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const data = await getExpenseById(id);
        
        setExpenseData(data);
      } catch (error) {
        console.error("Error while fetching manager for edit", error);
      }
    }
    fetchExpense();
  }, [id])

  

  if (!expenseData) return <p>Loading...</p>
  return (
    <AddExpenseForm
      siteId = {expenseData.siteId}
      initialValues = {expenseData}
      onClose = {() => navigate(`/site/${expenseData.siteId}/expenses`)}
    />
  )
}

export default EditExpense
