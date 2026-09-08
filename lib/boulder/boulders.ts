export type BoulderProblemMeta = {
  id: string
  number: number
  level: string
  image: string
  setters?: string
}

export type BoulderMeta = {
  id: `BLDR${string}`
  number: number
  image: string
  problems: BoulderProblemMeta[]
}

export const BOULDERS: BoulderMeta[] = [
  {
    id: "BLDR01",
    number: 1,
    image: "/media/Boulders/Boulder1.jpg",
    problems: [
      {
        id: "PP01",
        number: 1,
        level: "V0",
        image: "/media/Boulders/Img21.jpg",
      },
      {
        id: "PP02",
        number: 2,
        level: "V0",
        image: "/media/Boulders/Img22.jpg",
      },
    ],
  },
  {
    id: "BLDR02",
    number: 2,
    image: "/media/Boulders/Img17.jpg",
    problems: [
      {
        id: "AUH01",
        number: 1,
        level: "V3",
        image: "/media/Boulders/Img24.jpg",
      },
      {
        id: "AUH02",
        number: 2,
        level: "V5",
        image: "/media/Boulders/Img25.jpg",
      },
    ],
  },
  {
    id: "BLDR03",
    number: 3,
    image: "/media/Boulders/Img18.jpg",
    problems: [
      {
        id: "EP01",
        number: 1,
        level: "V6",
        image: "/media/Boulders/Img26.jpg",
      },
    ],
  },
  {
    id: "BLDR04",
    number: 4,
    image: "/media/Boulders/Boulder2.jpg",
    problems: [
      {
        id: "ED01",
        number: 1,
        level: "V4",
        image: "/media/Boulders/Img27.jpg",
      },
      {
        id: "ED02",
        number: 2,
        level: "V6",
        image: "/media/Boulders/Img31.jpg",
      },
      {
        id: "ED03",
        number: 3,
        level: "V8",
        image: "/media/Boulders/IMG_20250225_134043618_HDR.jpg",
      },
    ],
  },
]

export function getBoulder(id: string): BoulderMeta | undefined {
  return BOULDERS.find((b) => b.id === id)
}

export function padBoulderId(number: number): string {
  return `BLDR${String(number).padStart(2, "0")}`
}

/** Every selectable problem value (e.g. "BLDR01-PP01"), one per problem across
 *  all 4 boulders. `problemIndex` is the position within that boulder's
 *  `problems` array, needed to look up the matching translated name (the
 *  translations store problem names as an array, not keyed by problem id —
 *  see `BoulderRoute.<boulderId>.problems`). Shared by the problem selector
 *  in BoulderPostForm and by the boulder filter in the aggregated /boulder
 *  publications view. */
export function getBoulderProblemOptions(): {
  value: string
  baseId: BoulderMeta["id"]
  problemId: string
  problemIndex: number
}[] {
  return BOULDERS.flatMap((boulder) =>
    boulder.problems.map((problem, problemIndex) => ({
      value: `${boulder.id}-${problem.id}`,
      baseId: boulder.id,
      problemId: problem.id,
      problemIndex,
    }))
  )
}

/** Strips the "-<problemId>" suffix from a stored problem value, e.g.
 *  "BLDR01-PP01" → "BLDR01". Used to link back to the boulder's page and to
 *  look up its metadata/translations, which are keyed by the boulder id. */
export function getBoulderBaseId(value: string): string {
  const dashIdx = value.indexOf("-")
  return dashIdx === -1 ? value : value.slice(0, dashIdx)
}

/** The problem id part of a stored value, e.g. "BLDR01-PP01" → "PP01". */
export function getBoulderProblemId(value: string): string | null {
  const dashIdx = value.indexOf("-")
  return dashIdx === -1 ? null : value.slice(dashIdx + 1)
}
