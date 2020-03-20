import React, {useState} from 'react'
import {usePassage} from '../../firebase-utils'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar} from '@material-ui/core'
import {TaggedPassage} from '../../../passage-api'
import PassageText from '../../PassageList/PassageText'
import TagEditor from '../../TagEditor'
import Alert from '@material-ui/lab/Alert'
import firebase from 'firebase'

interface EditPageProps {
  readonly id: string
  readonly open: boolean
  readonly onClose: {(): void}
  readonly onDeleteRequest: {(ref: firebase.firestore.DocumentReference): void}
  readonly tagOptions?: Set<string>
}

export default function EditDialog({id, open, onClose, onDeleteRequest, tagOptions = new Set()}: EditPageProps) {
  const [passageRef, passageSnapshot] = usePassage(id)
  const [editSuccess, setEditSuccess] = useState<boolean | undefined>()

  const {reference, segments, tags}: TaggedPassage = passageSnapshot.data()

  function selectedTagsChangeHandler(selectedTags: Set<string>) {
    passageRef.set({
      reference,
      segments,
      tags: [...selectedTags]
    }).then(
      () => setEditSuccess(true),
      () => setEditSuccess(false)
    )
  }

  return <>
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{reference}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <PassageText segments={segments}/>
        </DialogContentText>
        <TagEditor tagOptions={tagOptions} selectedTags={tags} onSelectedTagsChange={selectedTagsChangeHandler}
                   freeSearch/>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onDeleteRequest(passageRef)} color='secondary'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    {
      editSuccess !== undefined ?
        <Snackbar open={true} onClose={() => setEditSuccess(undefined)} autoHideDuration={3000}>
          {
            editSuccess ?
              <Alert severity='success' elevation={6} variant='filled'>Edit saved.</Alert>
              : <Alert severity='error' elevation={6} variant='filled'>Error saving changes!</Alert>
          }
        </Snackbar>
        : undefined
    }
  </>
}
