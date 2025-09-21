import React from 'react'
import { useState , useEffect } from 'react';
import { getAllSite } from '../../services/siteService';
import { Sites } from '../../components'
import { useDispatch } from 'react-redux';
import {setSites} from '../../features/siteSlice';
import { getAllManager } from '../../services/managerService';
import { setManagers } from '../../features/managerSlice';
import Loader from './Loader'

function Home() {
  const dispatch =  useDispatch();
  const [loading, setLoading] = useState(true)

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full -mt-12">
        <Loader message={"Loading sites..."} />
      </div>
    );
  }
  
  return (
    <Sites />
  )
}
export default Home