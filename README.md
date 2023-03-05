# Weight Calculator for One Rep Max Sets (Using Rate of Perceived Exhaustion).

## What is this?

This is a program that automates the process we follow at my gym to calculate the weight we should lift in our sets based on our RPE, one rep max, and set count.

## What is RPE?

RPE stands for Rate of Perceived Exertion. It is a subjective measure used to gauge the intensity of exercise or physical activity, based on an individual's personal perception of how hard they feel they are working.

The RPE scale usually ranges from 1 to 10, where 1 represents a very light activity, and 10 represents an all-out maximal effort.

## Source Material

![From the shelves of Bay Strength](https://user-images.githubusercontent.com/316711/222936830-4f8e3b03-2abd-4873-bda4-5355fa054273.png "The Original Chart")

# The Tech

This project was made with TypeScript, Deno and Denoflare. Setup was a breeze, try them!

## Denoflare Server

Boot up the denoflare server by running the following command:

```sh
denoflare serve calculator
```

Test your server by performing an HTTP request. Pass your params in the headers of the request.
Passing the parameters makes this program easier to use with Apple Shortcuts.

Example request:

```sh
## Get Weight
curl "http://localhost:3030/" \
     -H 'calculator_rpe: 8' \
     -H 'calculator_reps: 4' \
     -H 'calculator_weight: 155' \
     -H 'calculator_projected: 75'
```
