import React from 'react'

const ErrorMessage = ({errors, message}) => {
  return (
    <div className={`${errors ? "flex" : "hidden"} text-primary-800 font-[Inter-Regular] text-base`}>
        <p>{message}</p>
    </div>
  )
}

export default ErrorMessage