import React, {Suspense} from 'react'
import {AuthCheck, FirebaseAppProvider} from 'reactfire'
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'

import LoginPage from './LoginPage'
import LoadingPage from './LoadingPage'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import {CssBaseline} from '@material-ui/core'
import {ThemeProvider} from '@material-ui/core/styles'
import VerseCatalog from './VerseCatalog'
import Logout from './Logout'
import AddPage from './AddPage'


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'verse-catalog.firebaseapp.com',
  databaseURL: 'https://verse-catalog.firebaseio.com',
  projectId: 'verse-catalog',
  storageBucket: 'verse-catalog.appspot.com',
  messagingSenderId: '830612595314',
  appId: '1:830612595314:web:1d86e66206b37c8dc818eb'
}

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

export default function App() {
  return <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Suspense fallback={<LoadingPage/>}>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Switch>
              <Route exact path='/login'>
                <AuthCheck fallback={<LoginPage/>}>
                  <Redirect to='/'/>
                </AuthCheck>
              </Route>
              <Route exact path='/logout'>
                <Logout/>
              </Route>
              <AuthCheck fallback={<Redirect to='/login'/>}>
                <Route exact path='/'>
                  <VerseCatalog/>
                </Route>
                <Route exact path='/add'>
                  <AddPage/>
                </Route>
              </AuthCheck>
            </Switch>
          </BrowserRouter>
        </Suspense>
      </CssBaseline>
    </ThemeProvider>
  </FirebaseAppProvider>
}
