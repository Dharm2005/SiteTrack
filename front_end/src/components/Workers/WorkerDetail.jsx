import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { getAdvancesByWorker } from '../../services/workerService';
import { setAdvances } from '../../features/workerAdvanceSlice';
import Advance from './Advance';
import AddAdvanceForm from './AddAdvanceForm';

function WorkerDetail() {
  const { workerId } = useParams();
  const allAdvance = useSelector(state => state.advance.advances);
  const dispatch = useDispatch()

  console.log("all", allAdvance);

  useEffect(() => {
    const fetchAdvance = async () => {
      try {
        const advance = await getAdvancesByWorker(workerId);
        dispatch(setAdvances(advance))
      } catch (error) {
        console.error("Error while fetching advance", error);

      }
    }
    fetchAdvance()
  }, [dispatch, workerId])

  return (
    <div>
      <div>
        <AddAdvanceForm
          workerId = {workerId}
        />
      </div>
      <div>
        {allAdvance && allAdvance.length > 0 ?
          allAdvance.map(advance => (
            <Advance
              key={advance._id}
              amount={advance.amount}
              date={advance.date}
              note={advance.note}
              createdAt={advance.createdAt}
            />
          )) : (
            <div>
              no advance found
            </div>
          )
        }
      </div>
    </div>
  )
}

export default WorkerDetail
