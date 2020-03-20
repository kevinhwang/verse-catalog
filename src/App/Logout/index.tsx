import React from 'react'
import {useAuth} from 'reactfire'
import {Redirect} from 'react-router-dom'
// @ts-ignore
import usePromise from 'react-promise-suspense'

export default function Logout() {
  const auth = useAuth()
  usePromise(() => auth.signOut(), [])
  return <Redirect to='/'/>
}
