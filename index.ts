// deno-fmt-ignore
const RPE_TABLE: { [key: string]: Array<number> } = {
  '10':     [100, 96, 92, 89, 86, 84, 81, 79, 76, 74],
  '9.5':    [98, 94, 91, 88, 85, 82, 80, 77, 75, 72],
  '9':      [96, 92, 89, 86, 84, 81, 79, 76, 74, 71],
  '8.5':    [94, 91, 88, 85, 82, 80, 77, 75, 72, 69],
  '8':      [92, 89, 86, 84, 81, 79, 76, 74, 71, 68],
  '7.5':    [91, 88, 85, 82, 80, 77, 75, 72, 69, 67],
  '7':      [89, 86, 84, 81, 79, 76, 74, 71, 68, 65],
  '6.5':    [88, 85, 82, 80, 77, 75, 72, 69, 67, 64],
}

const TABLE_OFFSET = 1

// 1. Look up Rep/RPE combo in the RPE chart and find the percentage.
// 2. Divide the weight you used by the percentage you got from step one. This is your estimated one rep max.
// 3. Multiply your one rep max for the percentage of it that you wish to lift.

export const getOneRepMax = (
  oneRepMaxPercentage: number,
  weight: number,
): number => {
  return weight / oneRepMaxPercentage
}

export const getOneRepMaxPercentage = (rpe: number, reps: number): number => {
  const rpeKey = rpe.toString()
  const validRPEKeys = Object.keys(RPE_TABLE)
  if (!validRPEKeys.includes(rpeKey)) {
    throw Error('Unsopported RPE value. Supported values are ' + validRPEKeys)
  }

  if (reps > 10) {
    throw Error('Rep number must be < 10')
  }

  return RPE_TABLE[rpeKey][reps - TABLE_OFFSET]
}

export const calculateWeight = (
  rpe: number,
  reps: number,
  weight: number,
  projectedWeightPercentage: number,
): number => {
  const oneRepMaxPercentage = getOneRepMaxPercentage(rpe, reps)
  const oneRepMax = getOneRepMax(oneRepMaxPercentage, weight)
  return Number((projectedWeightPercentage * oneRepMax).toFixed(2))
}

const buildQueryStringMap = (kvs: Array<string>): { [key: string]: string } => {
  const qs: { [key: string]: string } = {}
  for (const entry of kvs) {
    const spl = entry.split('=')
    qs[spl[0]] = spl[1]
  }

  return qs
}

// DenoFlare
const BACKGROUND_COLORS = [
  '#F9968B',
  '#F27348',
  '#76CDCD',
  '#2CCED2',
  '#DC828F',
  '#F7CE76',
  '#E8D6CF',
  '#8C7386',
  '#9C9359',
  '#8EA4C8',
  '#C3B8AA',
  '#DEDCE4',
  '#DB93A5',
  '#C7CDC5',
]

const getRandomIndex = (min: number, max: number): number => {
  return Math.floor(Math.random() * max + min)
}

const getRandomBackgroundColor = (): string => {
  return BACKGROUND_COLORS[getRandomIndex(0, BACKGROUND_COLORS.length)]
}

export default {
  fetch(request: Request) {
    let qs: { [key: string]: string } = {}

    try {
      qs = buildQueryStringMap(request.url.split('?')[1].split('&'))
    } catch {
      return new Response(
        'Oops! I can\'t make sense of what you are trying to do!',
      )
    }

    // deno-fmt-ignore
    const style = `
        body {
          background-color: ${getRandomBackgroundColor()};
          display: flex;
          justify-content: center;
          padding-top: 145px;
        }

      .results {
        align-items: center;
        display: flex;
        flex-flow: column wrap;
        font-size: 110px;
        gap: 20px;
        justify-content: center;
      } `

    // deno-fmt-ignore
    const html = `
    <html lang="en">
      <title>Weight Calculator -- By Marín Alcaraz</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        ${style}
      </style>
      <body>
        <div class="results">
          ${calculateWeight(Number(qs['rpe']), Number(qs['reps']), Number(qs['weight']), Number(qs['projected']))}lb
        </div>
      </body>
    </html>`

    return new Response(html, { headers: { 'Content-Type': 'text/html' } })
  },
}
