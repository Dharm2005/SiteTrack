import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getManagerById } from '../../services/managerService';
import AddManager from './AddManager'

function EditManager() {
  const {id} = useParams();
  const [managerData , setManagerData] = useState(null);

  useEffect(() => {
    const fetchManager = async () => {
      try{
        const data = await getManagerById(id);
        setManagerData(data);
      } catch (error) {
        console.error("Error while fetching manager for edit",error);
      }
    }
    fetchManager();
  } , [id])

  if(!managerData) return <p>Loading...</p>

  return (
    <AddManager
      initialValues = {managerData}
    />
  )
}

export default EditManager
