'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens

var gAliens = {}

function createAliens(board) {
  for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
    for (var j = 0; j < ALIEN_ROW_LENGTH; j++) {
      board[i][j] = createCell(ALIEN)
    }
  }
  gAliens.topRowIdx = 0
  gAliens.bottomRowIdx = ALIEN_ROW_COUNT - 1
  gAliens.rightColIdx = ALIEN_ROW_LENGTH - 1
  gAliens.leftColIdx = 0
  gAliens.isFreeze = false
  gAliens.isMoveRight = true
}

function handleAlienHit(pos) {
  clearInterval(gIntervalLaser)
  gHero.isShoot = false
  updateCell(pos)
  gGame.alienCount--
  gHero.score += 10
  updatePanel()
  console.log('aliens left: ', gGame.alienCount, ' score: ', gHero.score)
  if (!gGame.alienCount) return endGame()
  if (
    pos.i === gAliens.bottomRowIdx &&
    gAliens.bottomRowIdx !== gAliens.topRowIdx
  ) {
    updateAliensBottomRowIdx(pos.i)
  }
}

function updateAliensBottomRowIdx(i) {
  for (var j = gAliens.leftColIdx; j <= gAliens.rightColIdx; j++) {
    if (gBoard[i][j].gameObject === ALIEN) return
  }
  gAliens.bottomRowIdx--
}

function shiftBoardRight(board) {
  for (var i = gAliens.topRowIdx; i <= gAliens.bottomRowIdx; i++) {
    for (var j = gAliens.rightColIdx; j >= gAliens.leftColIdx; j--) {
      const currCell = board[i][j]
      const nextCell = board[i][j + 1]
      if (currCell.gameObject === LASER ||
         currCell.gameObject === SUPER_LASER)
        continue
      if (
        nextCell.gameObject === LASER ||
        nextCell.gameObject === SUPER_LASER
      ) {
        handleAlienHit({ i: i, j: j + 1 })
        updateCell({ i: i, j: j + 1 })
      } else {
        nextCell.gameObject = currCell.gameObject
        updateCell({ i: i, j: j + 1 }, currCell.gameObject)
      }
      currCell.gameObject = ''
      updateCell({ i: i, j: j })
    }
  }

  gAliens.rightColIdx++
  gAliens.leftColIdx++
}

function shiftBoardLeft(board) {
  for (var i = gAliens.topRowIdx; i <= gAliens.bottomRowIdx; i++) {
    for (var j = gAliens.leftColIdx; j <= gAliens.rightColIdx; j++) {
      const currCell = board[i][j]
      const nextCell = board[i][j - 1]
      if (currCell.gameObject === LASER ||
         currCell.gameObject === SUPER_LASER)
        continue
      if (
        nextCell.gameObject === LASER ||
        nextCell.gameObject === SUPER_LASER
      ) {
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
  gAliens.rightColIdx--
  gAliens.leftColIdx--
}

function shiftBoardDown(board) {
  for (var i = gAliens.bottomRowIdx; i >= gAliens.topRowIdx; i--) {
    for (var j = gAliens.leftColIdx; j <= gAliens.rightColIdx; j++) {
      const currCell = board[i][j]
      const nextCell = board[i + 1][j]
      if (currCell.gameObject === LASER ||
         currCell.gameObject === SUPER_LASER)
        continue
      if (
        nextCell.gameObject === LASER ||
        nextCell.gameObject === SUPER_LASER
      ) {
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

  gAliens.topRowIdx++
  gAliens.bottomRowIdx++
  if (gAliens.bottomRowIdx === gHero.pos.i) return endGame()

  gAliens.isMoveRight = !gAliens.isMoveRight
}

function moveAliens() {
  if (gAliens.isFreeze) return

  if (
    (gAliens.leftColIdx === 0 && !gAliens.isMoveRight) ||
    (gAliens.rightColIdx === BOARD_SIZE - 1 && gAliens.isMoveRight)
  )
    return shiftBoardDown(gBoard)

  if (gAliens.isMoveRight) shiftBoardRight(gBoard)
  else shiftBoardLeft(gBoard)
}
