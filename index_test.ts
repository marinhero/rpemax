import {
  assertEquals,
  assertThrows,
} from 'https://deno.land/std@0.178.0/testing/asserts.ts'
import {
  calculateWeight,
  getOneRepMax,
  getOneRepMaxPercentage,
} from './index.ts'

Deno.test('getOneRepMaxPercentage -- throws when RPE Key is invalid', () => {
  assertThrows(() => {
    getOneRepMaxPercentage(5, 5)
  })
})

Deno.test('getOneRepMaxPercentage -- throws when rep count is invalid', () => {
  assertThrows(() => {
    getOneRepMaxPercentage(5, 15)
  })
})

Deno.test('getOneRepMaxPercentage -- returns valid RPE percentage', () => {
  assertEquals(getOneRepMaxPercentage(10, 1), 100)
  assertEquals(getOneRepMaxPercentage(6.5, 10), 64)
  assertEquals(getOneRepMaxPercentage(10, 5), 86)
})

Deno.test('getOneRepMax -- returns a valid one rep max estimate', () => {
  assertEquals(getOneRepMax(getOneRepMaxPercentage(10, 1), 100), 1)
  assertEquals(getOneRepMax(getOneRepMaxPercentage(6.5, 10), 100), 1.5625)
  assertEquals(
    getOneRepMax(getOneRepMaxPercentage(10, 5), 100),
    1.1627906976744187,
  )
})

Deno.test('calculateWeight', () => {
  assertEquals(calculateWeight(10, 1, 100, 100), 100)
  assertEquals(calculateWeight(8, 4, 155, 75), 138.39)
  assertEquals(calculateWeight(7, 7, 135, 80), 145.95)
})
