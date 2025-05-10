import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className="flex justify-center pt-20">{children}</div>
  )
}

export default AuthLayout

// this authLayout file works for auth won't affect other things for our app