"use strict"

//const
const BOMB = "*"
const FLAG = "🚩"
const EMPTY = " "
const BO = "💣"

//global variable
var gTimerInterval
var elGameOverModal = document.querySelector(".container")
var elLose = document.querySelector("p")
var elWin = document.querySelector("h2")
var elTimer = document.querySelector(".timer")
var gMine

var gLevel = {
  SIZE: 4,
  MINES: 2,
  LIFE: 1,
}

var gBoard
var board = []
var life = gLevel.LIFE
var gClickCounter = 0

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}

initGame()

function initGame() {
  gGame.isOn = true
  board = []
  console.log("start")
  createBoard()
  renderBoard(gBoard)
  createMine()
  negsMinesAroundCount()
  elTimer.innerHTML = "0:000"
  elGameOverModal.style.display = "none"
  elLose.style.display = "none"
  elWin.style.display = "none"
  life = gLevel.LIFE
  gClickCounter = 0
}

function createBoard() {
  var board = []

  for (var i = 0; i < gLevel.SIZE; i++) {
    board.push([])
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        pos: { i: i, j: j },
        mineAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        symbol: EMPTY,
        value: EMPTY,
      }
    }
  }
  gBoard = board
  return gBoard
}

function negsMinesAroundCount() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].value === BOMB) {
        break
      } else if (setMinesNegsCount(i, j, gBoard) > 0) {
        gBoard[i][j].mineAroundCount = setMinesNegsCount(i, j, gBoard)
        gBoard[i][j].symbol = gBoard[i][j].mineAroundCount
      }
    }
  }
}

function setMinesNegsCount(cellI, cellJ, gBoard) {
  // console.log(gBoard);
  var bombsAround = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (gBoard[cellI][cellJ].isMine) continue
      if (j < 0 || j >= gBoard[i].length) continue
      if (i === cellI && j === cellJ) continue
      if (gBoard[i][j].isMine) {
        bombsAround++
      }
    }
  }
  return bombsAround
}

function renderBoard() {
  negsMinesAroundCount()

  var strHTML = ""

  for (var i = 0; i < gBoard.length; i++) {
    strHTML += "\n<tr>\n"
    for (var j = 0; j < gBoard[i].length; j++) {
      var classStr
      if (gBoard[i][j].isShown) {
        classStr = " shown"
      } else {
        classStr = " hide"
      }

      var dataAttribStr = `data-i="${i}" data-j="${j}"`
      strHTML += `\t<td ${dataAttribStr}
                    onclick="cellClicked(this, ${i}, ${j})"
                    oncontextmenu="cellMarked(event ,this ,${i}, ${j})"
                    class="${classStr}">${gBoard[i][j].symbol}</td>\n`
    }
    strHTML += "\n</tr>"
  }
  var elBoard = document.querySelector(".board")
  elBoard.innerHTML = strHTML
  // console.log(strHTML);
}

function cellClicked(elCell, i, j) {
  if (gGame.isOn === true && !elCell.isMarked) {
    if (gClickCounter === 0) {
      showTimer()
    }

    if (gBoard[i][j].isShown === true) {
      return
    }
    if (elCell.innerHTML === "*") {
      gBoard[i][j].isShown = true
      gBoard[i][j].symbol = "💥"
      life--
      checkGameOver()
      renderBoard(gBoard)
      gClickCounter++
      return
    }
    if (elCell.innerHTML > 0) {
      gBoard[i][j].isShown = true
      gClickCounter++
      checkGameOver()
    } else {
      gBoard[i][j].isShown = true
      blowupNegs(i, j)
    }
    checkGameOver()
    renderBoard(gBoard)
    gClickCounter++
    console.log(gClickCounter)
  }
}

function cellMarked(event, elCell, i, j) {
  if (!gGame.isOn) return
  if (!elCell.isShown) {
    if (elCell.isMarked === true) {
      elCell.isMarked = false
      event.preventDefault()
      elCell.innerHTML = " "
      console.log("unmarked")
      renderBoard(gBoard)
      gGame.markedCount--
    } else {
      event.preventDefault()
      elCell.innerHTML = "🚩"
      gBoard[i][j].symbol = "🚩"
      elCell.isMarked = true
      console.log("marked")
      gGame.markedCount--
      //   renderBoard(gBoard)
    }
  }
}

function checkGameOver() {
  if (winningCheck() - gLevel.MINES <= 0) {
    clearInterval(gTimerInterval)
    console.log("you win!")
    gGame.isOn = false
    gClickCounter = 0
    elGameOverModal.style.display = "block"
    elWin.style.display = "block"
  }
  if (life === 0) {
    clearInterval(gTimerInterval)
    console.log("you lose!")
    gGame.isOn = false
    gClickCounter = 0
    elGameOverModal.style.display = "block"
    elLose.style.display = "block"
  }
}

function expandShown(board, elCell, i, j) {}

function createMine() {
  var emptyCells = getEmptyCell()
  for (var i = 0; i < gLevel.MINES; i++) {
    gMine = {
      location: {
        i: emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)].i,
        j: emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)].j,
      },
    }
    gBoard[gMine.location.i][gMine.location.j].isMine = true
    gBoard[gMine.location.i][gMine.location.j].symbol = "*"

    renderBoard(gBoard)
  }
}

function getEmptyCell() {
  var emptyCell = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].value === EMPTY) {
        emptyCell.push({ i: i, j: j })
      }
    }
  }
  return emptyCell
}

function blowupNegs(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      if (i === cellI && j === cellJ) continue
      if (gBoard[i][j].symbol === "🚩") {
        return
      }
      if (gBoard[i][j].isMarked === true) {
        return
      }
      if (gBoard[i][j].symbol === EMPTY) {
        gBoard[i][j].isShown = true
      }
      if (gBoard[i][j].symbol > 0) {
        gBoard[i][j].isShown = true
      }
      if (gBoard[i][j] === BOMB) {
        return
      }
    }
  }
}

function showTimer() {
  var timer = document.querySelector(".timer")
  var start = Date.now()

  gTimerInterval = setInterval(function () {
    var currTs = Date.now()

    var secs = parseInt((currTs - start) / 1000)
    var ms = currTs - start - secs * 1000
    ms = "000" + ms
    // 00034 // 0001
    ms = ms.substring(ms.length - 3, ms.length)

    timer.innerHTML = `\n ${secs}:${ms}`
  }, 31)
}

function levelChoice(num) {
  if (num === 1) {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gLevel.LIFE = 1
  }

  if (num === 2) {
    gLevel.SIZE = 8
    gLevel.MINES = 14
    gLevel.LIFE = 2
  }

  if (num === 3) {
    gLevel.SIZE = 12
    gLevel.MINES = 32
    gLevel.LIFE = 3
  }
  return
}

function winningCheck() {
  var availableCell = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].isShown === false) {
        availableCell++
      }
    }
  }
  return availableCell
}
