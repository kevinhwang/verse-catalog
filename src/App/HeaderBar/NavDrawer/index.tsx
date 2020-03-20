import React from 'react'
import {Divider, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer} from '@material-ui/core'
import BookIcon from '@material-ui/icons/Book'
import LogoutIcon from '@material-ui/icons/ExitToApp'
import HomeIcon from '@material-ui/icons/Home'
import AddIcon from '@material-ui/icons/PostAdd'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {Link} from 'react-router-dom'

export interface NavDrawerProps {
  readonly open: boolean
  readonly onOpen: React.ReactEventHandler
  readonly onClose: React.ReactEventHandler
}

const useStyles = makeStyles(
  (theme: Theme) => createStyles({
    drawer: {
      width: 250
    },
    drawerHeader: theme.mixins.toolbar
  })
)

export default function NavDrawer({open, onOpen, onClose}: NavDrawerProps) {
  const classes = useStyles()
  return <SwipeableDrawer open={open} onOpen={onOpen} onClose={onClose}>
    <div className={classes.drawer} role='presentation'>
      <div className={classes.drawerHeader}>
        <List>
          <ListItem>
            <ListItemIcon>
              <BookIcon/>
            </ListItemIcon>
            <ListItemText primary='Verse Catalog'/>
          </ListItem>
        </List>
      </div>
      <Divider/>
      <List component='nav' onClick={onClose}>
        <ListItem button component={Link} to='/'>
          <ListItemIcon>
            <HomeIcon/>
          </ListItemIcon>
          <ListItemText primary='Home'/>
        </ListItem>
        <ListItem button component={Link} to='/add'>
          <ListItemIcon>
            <AddIcon/>
          </ListItemIcon>
          <ListItemText primary='Add Verses'/>
        </ListItem>
        <ListItem button component={Link} to='/logout'>
          <ListItemIcon>
            <LogoutIcon/>
          </ListItemIcon>
          <ListItemText primary='Log Out'/>
        </ListItem>
      </List>
    </div>
  </SwipeableDrawer>
}
