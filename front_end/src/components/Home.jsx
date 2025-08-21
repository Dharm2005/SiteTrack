import React from 'react'
import { useState , useEffect } from 'react';
import { getAllSite } from '../services/siteService';
import { Sites } from '../components'

function Home() {
  const [site , setSite] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllSite()
    .then(sites => {
      setSite(sites)
      setLoading(false)
    })
    .catch(err => {
      console.error("Error while fetching home from DB :" , err)
      setLoading(false)
    })
  }, [])

  if (loading) return <p className="text-center py-10">Loading...</p>;
  
  return (
    <>
      <Sites
        allSites = {site}
      />
    </>
  )
}

export default Home
