import React, { useEffect } from 'react'
import Managers from './Managers';
import { useDispatch, useSelector } from 'react-redux';
import { getAllManager } from '../../services/managerService';
import { setManagers } from '../../features/managerSlice';

function AllManager() {
  // Read managers from Redux
  const managers = useSelector(state => state.manager.managers)
  const dispatch = useDispatch();
  
  useEffect(() => {
    getAllManager()
    .then(managers => {
      dispatch(setManagers(managers))
    })
    .catch((err) => {
      console.error("Error while fetching managers" , err);
    })
  })

  // If managers are not loaded yet
  if (!managers || managers.length === 0) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return <Managers />;
}

export default AllManager;
