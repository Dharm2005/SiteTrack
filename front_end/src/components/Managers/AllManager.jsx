import React, { useEffect } from 'react'
import Managers from './Managers';
import { useDispatch } from 'react-redux';
import { getAllManager } from '../../services/managerService';
import { setManagers } from '../../features/managerSlice';
import {Loader} from '../index'

function AllManager() {
  // Read managers from Redux
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

  return <Managers />;
}

export default AllManager;
