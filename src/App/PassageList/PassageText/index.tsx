import React, {Fragment, ReactNode} from 'react'
import {PassageSegment, Verse} from '../../../passage-api'

interface PassageTextProps {
  readonly segments: PassageSegment[]
}

export default function PassageText({segments}: PassageTextProps) {
  return <>
    {
      segments.flatMap(
        ({verses, start}: PassageSegment): ReactNode[] => verses.map(
          ({verseNumber, text}: Verse): ReactNode => <Fragment key={start + verseNumber}>
            <sup style={{fontSize: 'xx-small', marginRight: '.35em', userSelect: 'none'}}>{verseNumber}</sup>
            {text}
          </Fragment>
        ).reduce(
          (list: ReactNode[], node: ReactNode): ReactNode[] => [
            ...list,
            ' ',
            node
          ],
          []
        )
      )
    }
  </>
}
