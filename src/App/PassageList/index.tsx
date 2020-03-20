import React, {ReactNode} from 'react'
import {Chip, Grid, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core'

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'

import PassageText from './PassageText'
import {TaggedPassage} from '../../passage-api'

const useStyles = makeStyles(
  (theme: Theme) => createStyles({
    root: {
      backgroundColor: theme.palette.background.paper
    },
    tagContainer: {
      width: 'auto'
    }
  })
)

interface PassageListProps {
  readonly items: Map<string, TaggedPassage>
  readonly onItemHover?: {(id: string, data: TaggedPassage): void}
  readonly onItemUnhover?: {(id: string, data: TaggedPassage): void}
  readonly onItemSelect?: {(id: string, data: TaggedPassage): void}
  readonly renderIcon?: {(id: string, data: TaggedPassage): ReactNode}
  readonly renderTags?: {(id: string, data: TaggedPassage, defaultElement: ReactNode): ReactNode}
}

export default function PassageList({
                                      items,
                                      onItemHover = () => undefined,
                                      onItemUnhover = () => undefined,
                                      onItemSelect = () => undefined,
                                      renderIcon = () => undefined,
                                      renderTags = (id, data, defaultElement) => defaultElement
                                    }: PassageListProps) {
  const classes = useStyles()
  return <List className={classes.root}>
    {
      [...items]
        .map(
          ([id, data]: [string, TaggedPassage]): ReactNode => {
            const icon: ReactNode = renderIcon(id, data)

            return <ListItem button
                             onMouseOver={() => onItemHover(id, data)}
                             onMouseLeave={() => onItemUnhover(id, data)}
                             onClick={() => onItemSelect(id, data)}
                             key={id}>
              {
                icon ?
                  <ListItemIcon>
                    <>{icon}</>
                  </ListItemIcon>
                  : undefined
              }
              <ListItemText primary={data.reference} secondary={<PassageText segments={data.segments}/>}
                            secondaryTypographyProps={{noWrap: true}}/>
              {
                renderTags(
                  id,
                  data,
                  <Grid container wrap='nowrap' spacing={1} className={classes.tagContainer}>
                    {
                      [...(data.tags ?? [])].map(
                        (tag: string): ReactNode => <Grid item key={tag}>
                          <Chip label={tag}/>
                        </Grid>
                      )
                    }
                  </Grid>
                )
              }
            </ListItem>
          }
        )
    }
  </List>
}
