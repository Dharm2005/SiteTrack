import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {getExpenseById} from '../../services/expenseService'
import AddExpenseForm from './AddExpenseForm'

function EditExpense() {
  const { id } = useParams();
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
      siteId={expenseData.siteId}
      initialValues = {expenseData}
    />
  )
}

export default EditExpense
