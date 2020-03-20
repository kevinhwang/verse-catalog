import React from 'react'
import {CircularProgress, Grid} from '@material-ui/core'

export default function LoadingPage() {
  return <Grid container alignItems={'center'} justify={'center'} style={{height: '100vh'}}>
    <Grid item>
      <CircularProgress/>
    </Grid>
  </Grid>
}
