/** @format */

const staircase = (num: number) => {
  for (let i = 0; i < num; i++) {
    console.log(`${' '.repeat(num - i - 1)}${'#'.repeat(i + 1)}`)
  }
}

staircase(4)
