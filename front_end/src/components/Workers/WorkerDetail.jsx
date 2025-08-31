import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { getAdvancesByWorker } from '../../services/workerService';
import { setAdvances } from '../../features/workerAdvanceSlice';

function WorkerDetail() {
  const {workerId} = useParams();
  const allAdvance = useSelector(state => state.advance.advances);
  const dispatch = useDispatch()

  console.log("all",allAdvance);
  
  useEffect(() => {
    const fetchAdvance = async () => {
      try{
        const advance = await getAdvancesByWorker(workerId);
        dispatch(setAdvances(advance))
      }catch(error){
        console.error("Error while fetching advance" , error);
        
      }
    }
    fetchAdvance()
  },[])

  return (
    <div>
      Worker detail page
    </div>
  )
}

export default WorkerDetail
