import React, { useState } from 'react'
import { useEffect } from 'react';
import {getDeletedManagers} from '../../services/recycleService'

function DeletedManagers() {

  const [deletedManagers , setDeletedManagers] = useState()

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const deletedManagers = await getDeletedManagers();
        console.log(deletedManagers);
        setDeletedManagers(deletedManagers)
      } catch (error) {
        console.error("Error while fetching deleted sites", error);
      }
    }
    fetchManagers()
  }, [])

  return (
    <div>
      managers
    </div>
  )
}

export default DeletedManagers
