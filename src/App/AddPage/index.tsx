import React, {Suspense, useEffect, useState} from 'react'
import HeaderBar from '../HeaderBar'
import Alert from '@material-ui/lab/Alert'
import LoadingPage from '../LoadingPage'
import TagEditor from '../TagEditor'
import Searcher from './Searcher'

// https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay]
  )

  return debouncedValue
}


export default function AddPage() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  const debouncedSearchTerm: string = useDebounce(searchTerm, 750)

  return <>
    <HeaderBar title='Add Verses' onSearch={setSearchTerm}>
      <TagEditor freeSearch selectedTags={selectedTags} onSelectedTagsChange={setSelectedTags}/>
    </HeaderBar>
    {
      !debouncedSearchTerm.length ?
        <Alert severity='info' style={{justifyContent: 'center'}}>Enter a query to start searching for
          verses…</Alert> : undefined
    }
    <Suspense fallback={<>
      <Alert severity='info' style={{justifyContent: 'center'}}>
        Searching for: {debouncedSearchTerm}…
      </Alert>
      <LoadingPage/>
    </>
    }>
      <Searcher searchTerm={debouncedSearchTerm} selectedTags={[...selectedTags]}/>
    </Suspense>
  </>
}
