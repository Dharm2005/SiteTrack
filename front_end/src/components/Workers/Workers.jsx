import React from 'react'
import AddWorkerForm from './AddWorkerForm'
import { useSelector } from 'react-redux'
import { Worker } from '../index'

function Workers({siteId}) {
  const allWorkers = useSelector((state) => state.worker.workers)
  console.log("allWorkers in Workers component:", allWorkers);

  return (
    <>
      <AddWorkerForm 
        siteId = {siteId}
      />

      {allWorkers && allWorkers.length > 0 ? (
          <div>
            {allWorkers.map(worker => (
              <div key={worker._id}>
                <Worker
                  key={worker._id}
                  id={worker._id}
                  name={worker.workerName}
                  image={worker.workerImage}
                  mobile = {worker.workerMobile}
                  advance={worker.workerAdvance}
                  perDiem={worker.workerPerDiem}
                  createdAt={worker.createdAt}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div>
          </div>
        )}

    </>
  )
}

export default Workers
