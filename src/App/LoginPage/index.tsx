import React from 'react'
import {useAuth} from 'reactfire'
import firebase from 'firebase'
import {Grid} from '@material-ui/core'
import GoogleButton from 'react-google-button'

export default function LoginPage() {
  const auth = useAuth()
  const signIn = () => auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
  return <Grid container alignItems={'center'} justify={'center'} style={{height: '100vh'}}>
    <Grid item>
      <GoogleButton type={'dark'} onClick={signIn}/>
    </Grid>
  </Grid>
}
