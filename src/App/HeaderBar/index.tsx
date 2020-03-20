import React, {ChangeEvent, ReactNode, useState} from 'react'
import {AppBar, IconButton, InputBase, Toolbar, Typography} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import {createStyles, fade, makeStyles, Theme} from '@material-ui/core/styles'
import NavDrawer from './NavDrawer'

interface HeaderBarProps {
  readonly title?: string
  readonly onSearch: {(searchTerm: string): void}
  readonly children: ReactNode
}

const useStyles = makeStyles(
  (theme: Theme) => createStyles({
    drawer: {
      width: 250
    },
    drawerHeader: theme.mixins.toolbar,
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block'
      }
    },
    search: {
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      borderRadius: theme.shape.borderRadius,
      marginRight: theme.spacing(2),
      position: 'relative',
      marginLeft: theme.spacing(3)
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'grid',
      alignItems: 'center',
      justifyContent: 'center'
    },
    searchInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width')
    },
    root: {
      backgroundColor: theme.palette.background.paper
    },
    tagContainer: {
      width: 'auto'
    }
  })
)

export default function HeaderBar({title, onSearch, children}: HeaderBarProps) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const classes = useStyles()
  return <AppBar position='sticky'>
    <NavDrawer open={drawerOpen} onOpen={() => setDrawerOpen(true)} onClose={() => setDrawerOpen(false)}/>
    <Toolbar>
      <IconButton
        onClick={() => setDrawerOpen(true)}
        edge='start'
        color='inherit'
        aria-label='open drawer'>
        <MenuIcon/>
      </IconButton>
      <Typography variant='h6' className={classes.title} noWrap>
        {title}
      </Typography>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon/>
        </div>
        <InputBase
          placeholder='Search…'
          inputProps={{'aria-label': 'search'}}
          classes={{input: classes.searchInput}}
          onChange={({currentTarget: {value}}: ChangeEvent<HTMLInputElement>) => onSearch(value)}
        />
      </div>
      {children}
    </Toolbar>
  </AppBar>
}
