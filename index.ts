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

export default {
  fetch(request: Request) {
    const projectedWeight = calculateWeight(
      Number(request.headers.get('calculator_rpe')),
      Number(request.headers.get('calculator_reps')),
      Number(request.headers.get('calculator_weight')),
      Number(request.headers.get('calculator_projected')),
    )

    return new Response(projectedWeight.toString())
  },
}
