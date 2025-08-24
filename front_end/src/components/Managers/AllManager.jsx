import React from 'react'
import Managers from './Managers';
import { useSelector } from 'react-redux';

function AllManager() {
  // Read managers from Redux
  const managers = useSelector((state) => state.manager.managers);
  console.log(managers);


  // If managers are not loaded yet
  if (!managers || managers.length === 0) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return <Managers />;
}

export default AllManager;
