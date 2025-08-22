import React from 'react'
import { useState , useEffect } from 'react';
import { getAllSite } from '../../services/siteService';
import { Sites } from '../../components'
import { useDispatch } from 'react-redux';
import {setSites} from '../../features/siteSlice';


function Home() {
  const dispatch =  useDispatch();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllSite()
    .then(sites => {
      dispatch(setSites(sites))
      setLoading(false)
    })
    .catch(err => {
      console.error("Error while fetching home from DB :" , err)
      setLoading(false)
    })
  }, [dispatch])

  if (loading) return <p className="text-center py-10">Loading...</p>;
  
  return (
    <Sites />
  )
}

export default Home
