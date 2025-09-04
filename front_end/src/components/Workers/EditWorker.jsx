import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getWorkerById } from '../../services/workerService';
import AddWorkerForm from './AddWorkerForm'

function EditWorker() {
  const {id} = useParams();
  console.log(id);
  
  const [workerData , setWorkerData] = useState(null);

  useEffect(() => {
    const fetchWorker = async () => {
      try{
        const data = await getWorkerById(id);
        setWorkerData(data);
      }catch(error){
        console.error("Error while fetching worker for edit" , error);
      }
    }
    fetchWorker();
  },[id])

  if(!workerData) return <p>Loading...</p>

  return (
    <AddWorkerForm
      initialValues = {workerData}
    />
  )
}

export default EditWorker
