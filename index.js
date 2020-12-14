const fs = require('fs')
const clear = require('clear')

const random = () => Math.round(Math.random())
const randomArray = (len) => {
  let arr = []
  for (let i = 0; i < len; i++ ) {
    arr.push(random())
  }
  return arr
}

const extractStateFromFile = () => {
  try {
    let rawdata = fs.readFileSync(filePath)
    return JSON.parse(rawdata)
  } catch (error) {
    if (error.code == 'ENOENT') {
      console.log('Неверно указан файл!')
      return
    }
  }
}

const generateState = () => {
  let state = []
  for (let i = 0; i < M; i++) {
    state.push(randomArray(N))
  }
  return state
}

const M = 10
const N = 10

const filePath = process.argv[2]

let isChanged = false

let desk = filePath ? extractStateFromFile() : generateState()
if (!desk) return

const step = () => {
  isChanged = false
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      let countOfLiving = 0

      // Проверка верхней тройки соседей
      i > 0 && desk[i-1][j] === 1 && countOfLiving++
      i > 0 && j > 0 && desk[i-1][j-1] === 1 && countOfLiving++
      i > 0 && j < N-1 && desk[i-1][j+1] === 1 && countOfLiving++
      
      // Проверка нижней тройки соседей
      i < M-1 && desk[i+1][j] === 1 && countOfLiving++
      i < M-1 && j > 0 && desk[i+1][j-1] === 1 && countOfLiving++
      i < M-1 && j < N-1 && desk[i+1][j+1] === 1 && countOfLiving++
      
      // Проверка соседей справа и слева
      j > 0 && desk[i][j-1] === 1 && countOfLiving++
      j < N-1 && desk[i][j+1] === 1 && countOfLiving++

      if (desk[i][j] === 1 && countOfLiving < 2) {
        desk[i][j] = 0
        isChanged = true
      }
      if (desk[i][j] === 0 && countOfLiving === 3) {
        desk[i][j] = 1
        isChanged = true
      }
      if (desk[i][j] === 1 && countOfLiving > 3) {
        desk[i][j] = 0
        isChanged = true
      }
    }
  }

}

clear()
console.table(desk)

let timer = setInterval(() => {
  step()
  if (isChanged) {
    clear()
    console.table(desk)
  } else clearInterval(timer)
}, 1000)

