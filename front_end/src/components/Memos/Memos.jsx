import React, { useEffect } from 'react'
import { useState } from 'react';
import {getMemosBySite} from '../../services/memoService'
import Memo from './Memo'

function Memos({siteId}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [allMemos, setAllMemos] = useState([]);

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleShowForm = () => {
    setShowAddForm(true);
  };

  useEffect(() => {
    const fetchMomos = async () => {
      try{
        const allMemos = await getMemosBySite(siteId);
        setAllMemos(allMemos);
      } catch (error) {
        console.error("Error fetching memos:", error);
      }
    }
    fetchMomos()
  }
  ,[siteId , allMemos])

  return (
    <div>
      {allMemos && allMemos.length() > 0 ? (
        allMemos.map((memo) => (
          <div key = {memo._id}>
            <Memo
              key={memo._id}
              id={memo._id}
              memoType={memo.memoType}
              text={memo.text}
              dueDate={memo.dueDate}
              createdAt={memo.createdAt}
            />
          </div>
        ))
      ) : ()}
    </div>
  )
}

export default Memos
