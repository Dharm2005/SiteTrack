import React from 'react'
import { getAllManager } from '../../services/managerService';
import { setManagers } from '../../features/managerSlice';
import Managers from './Managers';
import { useState , useEffect } from 'react';
import {useDispatch} from 'react-redux';

function AllManager() {

  const dispatch =  useDispatch();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllManager()
    .then(managers => {
      dispatch(setManagers(managers))
      setLoading(false)
    })
    .catch(err => {
      console.error("Error while fetching managers from DB :" , err)
      setLoading(false)
    })
  }, [dispatch])

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <Managers />
  )
}

export default AllManager