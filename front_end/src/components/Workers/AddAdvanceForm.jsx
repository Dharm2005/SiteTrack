import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

function AddAdvanceForm({workerId}) {
  const [form, setFrom] = useState({
    worker: '',
    amount : 0,
    date : '',
    note : '',
  })

  const dispatch = useDispatch()

  const handleSubmit = (e)  => {
    e.preventDefault();
    try{
      const formData = new FormData();
      formData.append("amount",formData.amount);
      formData.append("date",formData.date);
      formData.append("note",formData.note);
    }catch(error){
      console.log("Error while adding new advance");
      
    }
  }

  return (
    <div>
      
    </div>
  )
}

export default AddAdvanceForm
