import React from 'react'
import { useState , useEffect } from 'react';
import { getAllSite } from '../../services/siteService';
import { Sites } from '../../components'
import { useDispatch } from 'react-redux';
import {setSites} from '../../features/siteSlice';
import { getAllManager } from '../../services/managerService';
import { setManagers } from '../../features/managerSlice';


function Home() {
  const dispatch =  useDispatch();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sites, managers] = await Promise.all([
          getAllSite(),
          getAllManager()
        ]);

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


  if (loading) return <p className="text-center py-10">Loading...</p>;
  
  return (
    <Sites />
  )
}

export default Home
