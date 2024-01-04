'use strict'

function createBoard(ROWS, COLS) {
  const mat = []
  for (var i = 0; i < ROWS; i++) {
    const row = []
    for (var j = 0; j < COLS; j++) {
      row.push(createCell())
      row[j].type = i < ROWS - 1 ? SKY : EARTH
    }
    mat.push(row)
  }
  createHero(mat)
  createAliens(mat)
  return mat
}

function BlowUpNeighborsCells(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[0].length) continue
      var currCell = board[i][j]
      if (currCell.gameObject === ALIEN) {
        handleAlienHit({ i: i, j: j })
        console.log('from blowing up')
      }
    }
  }
}

function getRandEmptyCell() {
  var emptyCells = []
  for (var j = 0; j < gBoard[0].length; j++) {
    const currCell = gBoard[0][j]
    if (!currCell.gameObject) {
      emptyCells.push({ i: 0, j })
    }
  }

  if (!emptyCells.length) return null
  const randIdx = getRandomInt(0, emptyCells.length)
  return emptyCells[randIdx]
}

function playSound(file) {
  var audio = new Audio(file)
  audio.play()
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}
