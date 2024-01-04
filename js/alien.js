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
  updateCell(pos, EXPLOSION)
  playSound('sound/explosion.mp3')
  setTimeout(() => updateCell(pos), 80)

  gGame.alienCount--
  gHero.score += 10
  updatePanel()
  console.log(
    'aliens left: ',
    gGame.alienCount,
    ' score: ',
    gHero.score,
    'pos: ',
    pos
  )
  if (!gGame.alienCount) return endGame('win')

  if (
    pos.i === gAliens.bottomRowIdx &&
    gAliens.bottomRowIdx !== gAliens.topRowIdx
  ) {
    updateAliensBottomRowIdx(pos.i)
  }
}

function updateAliensBottomRowIdx(row) {
  for (var j = gAliens.leftColIdx; j <= gAliens.rightColIdx; j++) {
    if (gBoard[row][j].gameObject === ALIEN) return
  }
  gAliens.bottomRowIdx--
}

function shiftBoardRight(board) {
  for (var i = gAliens.topRowIdx; i <= gAliens.bottomRowIdx; i++) {
    for (var j = gAliens.rightColIdx; j >= gAliens.leftColIdx; j--) {
      const currCell = board[i][j]
      const nextCell = board[i][j + 1]
      if (
        currCell.gameObject === LASER ||
        currCell.gameObject === SUPER_LASER ||
        currCell.gameObject === EXPLOSION
      )
        continue
      if (
        nextCell.gameObject === LASER ||
        nextCell.gameObject === SUPER_LASER
      ) {
        handleAlienHit({ i: i, j: j + 1 })
        console.log('from movement')
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
      if (
        currCell.gameObject === LASER ||
        currCell.gameObject === SUPER_LASER ||
        currCell.gameObject === EXPLOSION
      )
        continue
      if (
        nextCell.gameObject === LASER ||
        nextCell.gameObject === SUPER_LASER
      ) {
        handleAlienHit({ i: i, j: j - 1 })
        console.log('from movement')
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
      if (
        currCell.gameObject === LASER ||
        currCell.gameObject === SUPER_LASER ||
        currCell.gameObject === EXPLOSION
      )
        continue
      if (
        nextCell.gameObject === LASER ||
        nextCell.gameObject === SUPER_LASER
      ) {
        handleAlienHit({ i: i + 1, j: j })
        console.log('from movement')
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
  if (gAliens.bottomRowIdx === gHero.pos.i) return endGame('loss')

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
