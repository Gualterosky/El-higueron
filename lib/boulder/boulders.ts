export type BoulderProblemMeta = {
  id: string
  number: number
  level: string
  image: string
  setters?: string
}

export type BoulderMeta = {
  id: `HIG${string}`
  number: number
  image: string
  problems: BoulderProblemMeta[]
}

export const BOULDERS: BoulderMeta[] = [
  {
    id: "HIG01",
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
    id: "HIG02",
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
    id: "HIG03",
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
    id: "HIG04",
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
  return `HIG${String(number).padStart(2, "0")}`
}
