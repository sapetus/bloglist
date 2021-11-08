import React from 'react'

const Message = ({ message, style }) => {
  if (message === null) {
    return null
  }

  return (
    <p id='message' style={style}>
      {message}
    </p>
  )
}

export default Message