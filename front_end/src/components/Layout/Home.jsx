import React from 'react'
import { useEffect } from 'react';
import { getAllSite } from '../../services/siteService';
import { Sites } from '../../components'
import { useDispatch } from 'react-redux';
import {setSites} from '../../features/siteSlice';
import { getAllManager } from '../../services/managerService';
import { setManagers } from '../../features/managerSlice';
import Loader from './Loader'

function Home() {
  const dispatch =  useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sites, managers] = await Promise.all([
          getAllSite(),
          getAllManager(),
        ]);
        console.log(sites);
        console.log(managers);
        
        dispatch(setSites(sites));
        dispatch(setManagers(managers));
      } catch (err) {
        console.error("Error while fetching data for Home:", err);
      }
    };

    fetchData();
  }, [dispatch]);
  
  return (
    <Sites />
  )
}
export default Home