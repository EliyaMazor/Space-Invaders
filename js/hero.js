'use strict'

const LASER_SPEED = 80
var gIntervalLaser

var gHero = { 
  pos: { i: 12, j: 5 }, 
  score: 0,
  isShoot: false, 
 }


function createHero(board) {
  board[gHero.pos.i][gHero.pos.j] = createCell(HERO)
}

function onKeyDown(ev) {
  if (!gGame.isOn) return

  switch (ev.key) {
    case 'ArrowLeft':
      moveHero(-1)
      break
    case 'ArrowRight':
      moveHero(1)
      break
    case ' ':
      shoot()
      break
      case 'n':

  }
}

function moveHero(dir) {
  const nextCell = gHero.pos.j + dir
  if (0 > nextCell || nextCell >= BOARD_SIZE)
    return console.error('Out of Range')

  updateCell(gHero.pos)
  gHero.pos.j = nextCell
  updateCell(gHero.pos, HERO)
}

function shoot() {
  if (gHero.isShoot) return
  gHero.isShoot = true
  const laserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }
  gIntervalLaser = setInterval(blinkLaser, 200, laserPos)
}

function blinkLaser(pos) {
  if (gBoard[pos.i][pos.j].gameObject === ALIEN || pos.i <= 0) {
    if (gBoard[pos.i][pos.j].gameObject === ALIEN) {
        handleAlienHit(pos)
    }

    clearInterval(gIntervalLaser)
    gHero.isShoot = false
    return
  }

  updateCell(pos, LASER)

  setTimeout(() => {
    updateCell(pos)
    pos.i--
  }, LASER_SPEED)
}
