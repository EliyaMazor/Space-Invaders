'use strict'

const LASER_SPEED = 200
const SUPER_LASER_SPEED = 100
var gIntervalLaser
var gIntervalCandy

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
      BlowUpNeighborsCells(gBoard, gHero.laserPos.i, gHero.laserPos.j)
      break
    case 'x':
      if (gHero.isShoot || gHero.isSuper || !gHero.superCount) return
      superLaser()
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

function superLaser() {
  const elH3 = document.querySelector('h3')
  elH3.classList.add('animation')
  gHero.isSuper = true
  gHero.superCount--
  updatePanel()
  setTimeout(() => {
    gHero.isSuper = false
    elH3.classList.remove('animation')
  }, 4000)
}

function shoot() {
  if (gHero.isShoot) return

  gHero.isShoot = true
  gHero.laserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }

  if (gHero.isSuper) {
    var speed = SUPER_LASER_SPEED
    playSound('sound/super-laser.mp3')
  } else {
    var speed = LASER_SPEED
    playSound('sound/laser.mp3')
  }

  gIntervalLaser = setInterval(blinkLaser, speed, gHero.laserPos)
}

function addCandy(){
  const randCell = getRandEmptyCell()
  console.log(randCell);
  updateCell(randCell, CANDY)
  setTimeout(() => updateCell(randCell), 5000)
}

function blinkLaser(pos) {
  if (gBoard[pos.i][pos.j].gameObject) {
    if (gBoard[pos.i][pos.j].gameObject === ALIEN) {
      handleAlienHit(pos)
      console.log('from laser')
    }else if(gBoard[pos.i][pos.j].gameObject === CANDY){
      playSound('sound/candy.mp3')
      gHero.score += 50
      updatePanel()
      updateCell(pos)
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
    if (pos.i < 0){
      clearInterval(gIntervalLaser)
      gHero.isShoot = false
      return
    }
  }, 80)
}

