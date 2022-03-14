import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Spinner from './Spinner'
import { useAuthStatus } from './useAuthStatus'

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus()

  if (checkingStatus) {
    return <Spinner />
  }

  return loggedIn ? <Outlet /> : <Navigate to='sign-in' />
}

export default PrivateRoute
