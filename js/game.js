'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3

const HERO = '<img src="img/hero.png">'
const ALIEN = '<img src="img/alien.png">'
const CANDY = '<img src="img/candy.png">'
const LASER = '<img src="img/laser.png">'
const SUPER_LASER = '<img src="img/super-laser.png">'
const EXPLOSION = '<img src="img/explosion.png">'
const SKY = 'sky'
const EARTH = 'earth'

var gBoard
var gGame = {
  isOn: false,
}

function init() {
  gBoard = createBoard(BOARD_SIZE, BOARD_SIZE)
  renderBoard(gBoard)
}

function startGame(elBtn) {
  if (elBtn.innerText === 'Restart') init()
  
  playSound('sound/space-music.mp3')
  toggle()
  gGame.alienCount = ALIEN_ROW_COUNT * ALIEN_ROW_LENGTH
  gHero.score = 0
  gGame.isOn = true
  gHero.isSuper = false
  gHero.superCount = 3
  
  updatePanel()
  gIntervalCandy = setInterval(addCandy, 10000)
  gIntervalAliens = setInterval(moveAliens, 1000)
}

function toggle() {
  document.querySelector('.start-btn').classList.toggle('hide')
  document.querySelector('.game-result').classList.toggle('hide')
}

function renderBoard(board) {
  var strHTML = `<table>`

  for (var i = 0; i < BOARD_SIZE; i++) {
    strHTML += `<tr>`

    for (var j = 0; j < BOARD_SIZE; j++) {
      const currCell = board[i][j]

      strHTML += `<td
        class="${currCell.type}"
        data-i="${i}" data-j="${j}">
        ${currCell.gameObject}
        </td>`
    }
    strHTML += `</tr>`
  }

  strHTML += `</table>`
  const elContainer = document.querySelector('.board-container')
  elContainer.innerHTML = strHTML
}

function createCell(gameObject = '') {
  return {
    type: SKY,
    gameObject: gameObject,
  }
}

function updateCell(pos, gameObject = null) {
  gBoard[pos.i][pos.j].gameObject = gameObject
  var elCell = getElCell(pos)
  elCell.innerHTML = gameObject || ''
}

function getElCell(pos) {
  return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`)
}

function updatePanel(){
  document.querySelector('.aliens-left').innerText = gGame.alienCount
  document.querySelector('.score').innerText = gHero.score
  document.querySelector('.super-attack').innerText = gHero.superCount
}

function endGame(result) {
  clearInterval(gIntervalAliens)
  clearInterval(gIntervalCandy)
  gGame.isOn = false
  document.querySelector('.start-btn').innerText = 'Restart'
  if(result === 'win'){
    document.querySelector('.game-result').innerText = 'VICTORY!!!'
    playSound('sound/win.mp4')
  }else{
    document.querySelector('.game-result').innerText = 'You Lost'
    playSound('sound/game-over.mp3')
  }
  toggle()
}
