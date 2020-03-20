import React, {useState} from 'react'
// @ts-ignore
import usePromise from 'react-promise-suspense'
import Alert from '@material-ui/lab/Alert'
import AddIcon from '@material-ui/icons/PlaylistAdd'
import {Snackbar} from '@material-ui/core'

import {Passage, searchForPassages, TaggedPassage} from '../../../passage-api'
import {usePassageCollection} from '../../firebase-utils'
import PassageList from '../../PassageList'


function useSearch(searchTerm: string): Map<string, Passage> | undefined {
  const results: Passage[] | undefined = usePromise(
    async (searchTerm: string) =>
      searchTerm.length ? await searchForPassages(searchTerm) : undefined,
    [searchTerm]
  )

  return results ? new Map(
    results?.map(result => [result.reference, result])
  ) : undefined
}

interface SearcherProps {
  readonly searchTerm: string
  readonly selectedTags: string[]
}

export default function Searcher({searchTerm, selectedTags}: SearcherProps) {
  const [hoveredOverItemId, setHoveredOverItemId] = useState<string | undefined>()
  const [addedItemId, setAddedItemId] = useState<string | undefined>()
  const [addSuccess, setAddSuccess] = useState<boolean | undefined>()
  const searchResultItems: Map<string, Passage> | undefined = useSearch(searchTerm)

  const itemsWithTags: Map<string, TaggedPassage> | undefined = searchResultItems ? new Map(
    [...searchResultItems].map(
      ([id, passage]) => [id, {...passage, tags: selectedTags}]
    )
  ) : undefined

  const hoveredOverItem: Passage | undefined = hoveredOverItemId ? itemsWithTags?.get(hoveredOverItemId) : undefined
  const addedItem: Passage | undefined = addedItemId ? itemsWithTags?.get(addedItemId) : undefined

  const [passageCollectionRef] = usePassageCollection()

  const handleItemSelect = (id: string, data: TaggedPassage) => {
    passageCollectionRef.add(data).then(
      () => {
        setAddedItemId(id)
        setAddSuccess(true)
      },
      () => setAddSuccess(false)
    )
  }

  const finishNotification = () => {
    setAddedItemId(undefined)
    setAddSuccess(undefined)
  }

  return <>
    {
      hoveredOverItem ?
        <Alert severity='info' style={{justifyContent: 'center'}}>
          Select to add {hoveredOverItem.reference} with {selectedTags.length} tags to your collection.
        </Alert>
        : itemsWithTags?.size ?
        <Alert severity='success' style={{justifyContent: 'center'}}>
          Found {itemsWithTags.size} results for: {searchTerm}…
        </Alert>
        : undefined
    }
    {
      !searchTerm.length ? undefined
        : itemsWithTags?.size ?
        <PassageList items={itemsWithTags}
                     onItemHover={setHoveredOverItemId}
                     onItemUnhover={() => setHoveredOverItemId(undefined)}
                     onItemSelect={handleItemSelect}
                     renderIcon={(id) => id === hoveredOverItemId ? <AddIcon/> : undefined}
                     renderTags={(id, data, defaultElement) => id === hoveredOverItemId ? defaultElement : undefined}/>
        : <Alert severity='warning' style={{justifyContent: 'center'}}>No results found for: {searchTerm}</Alert>
    }
    {
      addSuccess !== undefined ?
        <Snackbar open={true} onClose={finishNotification} autoHideDuration={3000}>
          {
            addSuccess && addedItem ?
              <Alert severity='success' elevation={6} variant='filled'>Added {addedItem.reference} to your
                collection.</Alert>
              : <Alert severity='error' elevation={6} variant='filled'>Error adding verse.</Alert>
          }
        </Snackbar>
        : undefined
    }
  </>
}
