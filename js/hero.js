'use strict'

const LASER_SPEED = 200
const SUPER_LASER_SPEED = 100
var gIntervalLaser

var gHero = {
  pos: { i: 12, j: 5 },
  isShoot: false,
  isSuper: false,
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
      if (!gHero.isShoot) return
      countNeighborsCells(gBoard, gHero.laserPos.i, gHero.laserPos.j)
      break
    case 'x':
      if (gHero.isShoot) return
      // gHero.isSuper = true
      gHero.isSuper = !gHero.isSuper
      break
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
  gHero.laserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }

  var speed = !gHero.isSuper ? LASER_SPEED : SUPER_LASER_SPEED
  gIntervalLaser = setInterval(blinkLaser, speed, gHero.laserPos)
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

  var laser = gHero.isSuper ? SUPER_LASER : LASER

  updateCell(pos, laser)
  setTimeout(() => {
    updateCell(pos)
    pos.i--
  }, 80)
}
