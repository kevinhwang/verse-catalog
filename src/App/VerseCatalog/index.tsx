import React, {useMemo, useState} from 'react'
import {comparePassages, TaggedPassage} from '../../passage-api'
import firebase from 'firebase'
import PassageList from '../PassageList'
import HeaderBar from '../HeaderBar'
import {Fab, Snackbar, Theme} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import {makeStyles} from '@material-ui/core/styles'
import Fuse, {FuseResultWithMatches} from 'fuse.js'
import {Link} from 'react-router-dom'
import {usePassageCollection} from '../firebase-utils'
import EditDialog from './EditDialog'
import TagEditor from '../TagEditor'
import Alert from '@material-ui/lab/Alert'


const fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  tokenize: true,
  threshold: .1,
  distance: 2048,
  minMatchCharLength: 1,
  keys: [
    '1.reference',
    '1.segments.verses.text'
  ]
}


const useStyles = makeStyles(
  (theme: Theme) => ({
    addButton: {
      position: 'fixed',
      bottom: theme.spacing(4),
      right: theme.spacing(4)
    }
  })
)

export default function App() {
  const [searchTerm, setSearchTerm] = useState<string>()
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [editing, setEditing] = useState<string | undefined>()
  const [deleteSuccess, setDeleteSuccess] = useState<boolean | undefined>()

  const [, querySnapshot] = usePassageCollection()

  const allItems: Map<string, TaggedPassage> = useMemo(() => {
      const queryDocumentSnapshots: firebase.firestore.QueryDocumentSnapshot<TaggedPassage>[] = querySnapshot.docs

      return new Map(
        queryDocumentSnapshots
          .map((queryDocumentSnapshot: firebase.firestore.QueryDocumentSnapshot<TaggedPassage>): [string, TaggedPassage] => [queryDocumentSnapshot.id, queryDocumentSnapshot.data()])
          .sort(([, a], [, b]) => comparePassages(a, b))
      )
    },
    [querySnapshot]
  )

  const tagFilteredItems: Map<string, TaggedPassage> = new Map(
    [...allItems].filter(
      ([, {tags = new Set<string>()}]: [string, TaggedPassage]) => !selectedTags.size || [...tags].filter(tag => selectedTags.has(tag)).length)
  )

  const fuse: Fuse<[string, TaggedPassage], typeof fuseOptions> = new Fuse([...tagFilteredItems], fuseOptions)
  const searchResults: FuseResultWithMatches<[string, TaggedPassage]>[] | undefined = searchTerm ? fuse.search<[string, TaggedPassage], boolean, true>(searchTerm) : undefined

  const searchTermFilteredItems: Map<string, TaggedPassage> = searchResults ? new Map(searchResults.map(match => match.item)) : tagFilteredItems

  const tagOptions: Set<string> = new Set([...allItems.values()].flatMap(({tags = new Set()}: TaggedPassage): string[] => [...tags]).sort())

  const classes = useStyles()

  const handleDelete = (ref: firebase.firestore.DocumentReference) => {
    setEditing(undefined)
    ref.delete()
      .then(
        () => {
          setDeleteSuccess(true)
        },
        () => setDeleteSuccess(false)
      )

  }

  return <>
    <HeaderBar title='Verse Catalog' onSearch={setSearchTerm}>
      <TagEditor tagOptions={tagOptions} selectedTags={selectedTags} onSelectedTagsChange={setSelectedTags}/>
    </HeaderBar>
    <PassageList
      items={searchTermFilteredItems}
      onItemSelect={setEditing}
    />
    {
      editing ?
        <EditDialog id={editing} open={true} onClose={() => setEditing(undefined)} onDeleteRequest={handleDelete}
                    tagOptions={tagOptions}/>
        : undefined
    }
    <Fab component={Link} to='/add' color='secondary' className={classes.addButton} aria-label='add'>
      <AddIcon/>
    </Fab>
    {
      deleteSuccess !== undefined ?
        <Snackbar open={true} onClose={() => setDeleteSuccess(undefined)} autoHideDuration={3000}>
          {
            deleteSuccess ?
              <Alert severity='success' elevation={6} variant='filled'>Verse deleted.</Alert>
              : <Alert severity='error' elevation={6} variant='filled'>Error deleting verse!</Alert>
          }
        </Snackbar>
        : undefined
    }
  </>
}
