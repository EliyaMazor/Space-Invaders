'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens

var gAliensTopRowIdx
var gAliensBottomRowIdx
var gAliensRightColIdx
var gAliensLeftColIdx

var gIsAlienFreeze = false
var gIsAlienMoveRight = true

function createAliens(board) {
  for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
    for (var j = 0; j < ALIEN_ROW_LENGTH; j++) {
      board[i][j] = createCell(ALIEN)
    }
  }
  gAliensTopRowIdx = 0
  gAliensBottomRowIdx = ALIEN_ROW_COUNT - 1
  gAliensRightColIdx = 7
  gAliensLeftColIdx = 0
}

function handleAlienHit(pos) {
  clearInterval(gLaserInterval)
  updateCell(pos)
  gHero.isShoot = false
  gGame.alienCount--
  gHero.score += 10
  console.log('aliens left: ', gGame.alienCount, ' score: ', gHero.score)
  if (!gGame.alienCount) return endGame()
  if (
    pos.i === gAliensBottomRowIdx &&
    gAliensBottomRowIdx !== gAliensTopRowIdx
  ) {
    updateAliensBottomRowIdx(pos.i)
  }
}

function updateAliensBottomRowIdx(i) {
  for (var j = gAliensLeftColIdx; j <= gAliensRightColIdx; j++) {
    if (gBoard[i][j].gameObject === ALIEN) return
  }
  gAliensBottomRowIdx--
}

function shiftBoardRight(board) {
  for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
    for (var j = gAliensRightColIdx; j >= gAliensLeftColIdx; j--) {
      const currCell = board[i][j]
      const nextCell = board[i][j + 1]
      if (currCell.gameObject === LASER) continue
      if (nextCell.gameObject === LASER) {
        handleAlienHit({ i: i, j: j + 1 })
        // clearInterval(gLaserInterval)
        // nextCell.gameObject = ''
        updateCell({ i: i, j: j + 1 })
      } else {
        nextCell.gameObject = currCell.gameObject
        updateCell({ i: i, j: j + 1 }, currCell.gameObject)
      }
      currCell.gameObject = ''
      updateCell({ i: i, j: j })
    }
  }

  gAliensRightColIdx++
  gAliensLeftColIdx++
}

function shiftBoardLeft(board) {
  for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
    for (var j = gAliensLeftColIdx; j <= gAliensRightColIdx; j++) {
      const currCell = board[i][j]
      const nextCell = board[i][j - 1]
      if (currCell.gameObject === LASER) continue
      if (nextCell.gameObject === LASER) {
        handleAlienHit({ i: i, j: j - 1 })
        updateCell({ i: i, j: j - 1 })
      } else {
        nextCell.gameObject = currCell.gameObject
        updateCell({ i: i, j: j - 1 }, currCell.gameObject)
      }
      currCell.gameObject = ''
      updateCell({ i: i, j: j })
    }
  }
  gAliensRightColIdx--
  gAliensLeftColIdx--
}

function shiftBoardDown(board) {
  for (var i = gAliensBottomRowIdx; i >= gAliensTopRowIdx; i--) {
    for (var j = gAliensLeftColIdx; j <= gAliensRightColIdx; j++) {
      const currCell = board[i][j]
      const nextCell = board[i + 1][j]
      if (currCell.gameObject === LASER) continue
      if (nextCell.gameObject === LASER) {
        handleAlienHit({ i: i + 1, j: j })
        updateCell({ i: i + 1, j: j })
      } else {
        nextCell.gameObject = currCell.gameObject
        updateCell({ i: i + 1, j: j }, currCell.gameObject)
      }
      currCell.gameObject = ''
      updateCell({ i: i, j: j })
    }
  }

  gAliensTopRowIdx++
  gAliensBottomRowIdx++
  if (gAliensBottomRowIdx === gHero.pos.i) return endGame()

  gIsAlienMoveRight = !gIsAlienMoveRight
}

function moveAliens() {
  if (gIsAlienFreeze) return

  if (
    (gAliensLeftColIdx === 0 && !gIsAlienMoveRight) ||
    (gAliensRightColIdx === BOARD_SIZE - 1 && gIsAlienMoveRight)
  )
    return shiftBoardDown(gBoard)

  if (gIsAlienMoveRight) shiftBoardRight(gBoard)
  else shiftBoardLeft(gBoard)
}
