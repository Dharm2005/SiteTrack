import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSite } from '../../services/siteService';
import AddSite from './AddSite';
function EditSite() {
  const {id} = useParams();
  const [siteData , setSiteData] = useState(null);

  useEffect(() => {
    const fetchSite = async () => {
      try{
        const data = await getSite(id);
        setSiteData(data);
      }catch (error) {
        console.error("Error while fetching site for update" , error);
      }
    }
    fetchSite()
  } , [id]);

  if(!siteData) return <p>Loading...</p>

  return (
    <AddSite
      initialValues = {siteData}
    />
  )
}

export default EditSite
