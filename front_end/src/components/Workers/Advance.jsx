import React from 'react'

function Advance({amount, date, note, createdAt}) {
  
  return (
    <div>
      <p>{amount}</p>
      <p>{date}</p>
      <p>{note}</p>
      <p>{createdAt}</p>
    </div>
  )
}

export default Advance
