import React, {ChangeEvent, ReactNode} from 'react'
import {Checkbox, TextField} from '@material-ui/core'
import Autocomplete, {RenderOptionState} from '@material-ui/lab/Autocomplete'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'

interface TagEditorProps {
  readonly tagOptions?: Set<string> | string[]
  readonly selectedTags?: Set<string> | string []
  readonly disabled?: boolean
  readonly freeSearch?: boolean
  readonly onSelectedTagsChange?: {(values: Set<string>): void}
}


const useStyles = makeStyles(
  (theme: Theme) => createStyles({
    root: {
      minWidth: theme.spacing(25)
    }
  })
)

export default function TagEditor({tagOptions = [], selectedTags = [], disabled = false, freeSearch = false, onSelectedTagsChange = () => undefined}: TagEditorProps) {
  const classes = useStyles()
  return <Autocomplete
    multiple
    disabled={disabled}
    freeSolo={freeSearch}
    options={[...tagOptions]}
    defaultValue={[...selectedTags]}
    renderInput={
      params => <TextField
        {...params}
        variant='outlined'
        label='Tags'
        placeholder='Tags'
        fullWidth
      />
    }
    renderOption={
      (option: string, {selected}: RenderOptionState): ReactNode => <>
        <Checkbox checked={selected}/>
        {option}
      </>
    }
    size='small'
    className={classes.root}
    onChange={((event: ChangeEvent<{}>, value: string[]) => onSelectedTagsChange(new Set(value)))}
  />
}
