export interface Verse {
  readonly verseNumber: number
  readonly text: string
}

export interface PassageSegment {
  readonly start: number
  readonly end: number
  readonly verses: Verse[]
}

export interface Passage {
  readonly reference: string
  readonly segments: PassageSegment[]
}

export interface TaggedPassage extends Passage {
  readonly tags?: Set<string> | string[]
}

interface GetPassageTextResponseJson {
  readonly canonical: string
  readonly parsed: [number, number][]
  readonly passages: string[]
}

interface SearchPassageMatch {
  readonly reference: string
}

interface SearchPassageResponseJson {
  readonly results: SearchPassageMatch[]
}

const HEADERS: Record<string, string> = {
  Authorization: `Token ${process.env.REACT_APP_ESV_ORG_API_KEY}`,
  Accept: 'application/json'
}

const TEXT_API_ENDPOINT: string = 'https://api.esv.org/v3/passage/text'

const TEXT_REQUEST_PARAMS: Map<string, any> = new Map<string, any>([
  ['include-passage-references', false],
  ['include-verse-numbers', true],
  ['include-footnotes', false],
  ['include-headings', false],
  ['include-short-copyright', false],
  ['indent-paragraphs', 0],
  ['indent-poetry', false],
  ['indent-poetry-lines', 0],
  ['indent-declares', 0],
  ['indent-psalm-doxology', 0]
])

const SEARCH_API_ENDPOINT: string = 'https://api.esv.org/v3/passage/search'

const searchRequestParams = (pageSize: number): Map<string, any> => new Map([
  ['page-size', pageSize]
])

export async function fetchPassage(query: string): Promise<Passage | null> {
  const additionalParamsString: string = [...TEXT_REQUEST_PARAMS].map(([k, v]) => `${k}=${v}`).join('&')
  const response = await fetch(
    `${TEXT_API_ENDPOINT}/?q=${query}&${additionalParamsString}`,
    {headers: HEADERS})
  const {canonical, parsed, passages}: GetPassageTextResponseJson = await response.json()

  if (parsed.length !== passages.length) {
    throw Error(`Unexpected response for query ${query}: .parsed and .passages differ in length`)
  }

  const segments: PassageSegment[] = parsed.map(
    ([start, end], i) => ({
      start,
      end,
      verses: passages[i]
        .split(/\[(\d+)]/)
        .map(
          s => s.replace(/\n+/g, ' ').trim())
        .reduce(
          ({i, result}: {i?: string, result: Verse[]}, x: string): {i?: string, result: Verse[]} => i ? {
            result: [
              ...result,
              {verseNumber: parseInt(i), text: x}
            ]
          } : {i: /^(\d+)$/.exec(x)?.[1], result},
          {result: []})
        .result
    })
  )

  return canonical && segments?.length > 0 ? {
    reference: canonical,
    segments
  } : null
}

export async function searchForPassages(query: string, count: number = 10): Promise<Passage[]> {
  // Try searching for a direct reference
  const directReferenceResult: Passage | null = await fetchPassage(query)
  const first: Passage[] = directReferenceResult ? [directReferenceResult] : []
  return [...first, ...await searchForPassagesByText(query, count - first.length)]
}

export async function searchForPassagesByText(query: string, count: number = 10): Promise<Passage[]> {
  const additionalParamsString: string = [...searchRequestParams(count)].map(([k, v]) => `${k}=${v}`).join('&')
  const response = await fetch(
    `${SEARCH_API_ENDPOINT}/?q=${query}&${additionalParamsString}`,
    {headers: HEADERS})

  const result: SearchPassageResponseJson = await response.json()
  const matches: string[] = result.results.map(match => match.reference)

  const results: Array<Passage | null> = await matches.reduce(async (promise: Promise<Array<Passage | null>>, reference) => [...await promise, await fetchPassage(reference) as Passage], Promise.resolve<Array<Passage | null>>([]))

  return results.filter(Boolean) as Passage[]
}

export function comparePassages(a: Passage, b: Passage): number {
  const aOrdinals: number[] = a.segments.flatMap(({start, end}: PassageSegment): [number, number] => [start, end])
  const bOrdinals: number[] = b.segments.flatMap(({start, end}: PassageSegment): [number, number] => [start, end])

  return [...new Array(Math.min(aOrdinals.length, bOrdinals.length)).keys()]
    .reduce(
      (result: number, i: number): number => result || aOrdinals[i] - bOrdinals[i],
      0
    ) || aOrdinals.length - bOrdinals.length
}
