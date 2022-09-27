"use strict"

//const
const BOMB = "💣"
const FLAG = "🚩"
const EMPTY = " "

//global variable
var gTimerInterval
var elGameOverModal = document.querySelector(".container")
var elLose = document.querySelector("p")
var elGame = document.querySelector(".game")
var elTimer = document.querySelector(".timer")
var elLife = document.querySelector(".life")
var elHint = document.querySelector(".hint")
var elSafeClicks = document.querySelector("h3 button h5 p")
var elBody = document.querySelector("body")

var gMine
var isHint = false
var hintCredit
var hintAmount = 3
var safeClick
var safeClickAmount = 3
var mineAmount
var isManuallyPos
var isLose

var gLevel = {
  LEVEL: 1,
  SIZE: 4,
  MINES: 2,
  LIFE: 3,
}

var gBoard
var board = []
var life = gLevel.LIFE
var gClickCounter = 0
var strHTML
localStorage.time1 = Infinity
localStorage.time2 = Infinity
localStorage.time3 = Infinity

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}
levelChoice(1)

initGame()

function initGame() {
  gGame.isOn = true
  board = []
  createBoard()
  renderBoard(gBoard)
  elTimer.innerHTML = "0:000"
  elGameOverModal.style.display = "none"
  elGame.innerText = "😋"
  life = gLevel.LIFE
  isLose = false
  gClickCounter = 0
  safeClickAmount = 3
  elSafeClicks.innerText = safeClickAmount
  clearInterval(gTimerInterval)
}

function createBoard() {
  var board = []

  for (var i = 0; i < gLevel.SIZE; i++) {
    board.push([])
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        pos: { i: i, j: j },
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

function renderBoard() {
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
      if (gBoard[i][j].isSafe === true) {
        classStr = " safe"
      }
      if (gBoard[i][j].isMarked === true) {
        classStr = " marked"
      }
      if (isLose === true && gBoard[i][j].isMine) {
        classStr = " shown"
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
}

function cellClicked(elCell, i, j) {
  if (gGame.isOn === true && !gBoard[i][j].isMarked) {
    if (isHint === true) {
      hint(i, j)
      renderBoard(gBoard)
      setTimeout(() => {
        hintCredit--
        hint(i, j)
        renderBoard(gBoard)
        isHint = false
      }, "1000")
      return
    }
    // if (isManuallyPos === true) {
    //   gBoard[i][j].isMine = true
    //   gBoard[i][j].symbol = BOMB
    //   console.log(gBoard[i][j])
    //   mineAmount--
    //   if (mineAmount <= 0) {
    //     isManuallyPos = false
    //   }
    //   gClickCounter++
    //   renderBoard()
    //   return
    // }

    if (gClickCounter === 0) {
      showTimer()
      gBoard[i][j].isShown = true
      createMine()
      gClickCounter++
      if (gBoard[i][j].symbol === EMPTY) {
        gBoard[i][j].isShown = true
        blowupNegs(i, j)
      }
      renderBoard()
    }

    if (gBoard[i][j].isShown === true) {
      return
    }
    if (gBoard[i][j].symbol === BOMB) {
      console.log("boom")
      gBoard[i][j].isShown = true
      gBoard[i][j].symbol = "💥"
      life--
      elBody.style.color = "red"

      setTimeout(() => {
        elBody.style.color = "black"
      }, "600")

      if (life === 2) {
        elLife.innerText = "💙💙"
      }
      if (life === 1) {
        elLife.innerText = "💙"
      }
      if (life === 0) {
        elLife.innerText = ""
      }
      checkGameOver()
      renderBoard(gBoard)
      gClickCounter++
      return
    }
    if (elCell.innerText > 0) {
      gBoard[i][j].isShown = true
      gClickCounter++
      checkGameOver()
    } else if (gBoard[i][j].symbol === EMPTY) {
      gBoard[i][j].isShown = true
      blowupNegs(i, j)
    } else {
      gBoard[i][j].isShown = true
    }
    checkGameOver()
    renderBoard(gBoard)
    gClickCounter++
  }
}

function cellMarked(event, elCell, i, j) {
  if (!gGame.isOn) return
  if (!gBoard[i][j].isShown) {
    if (gBoard[i][j].isMarked) {
      event.preventDefault()
      gBoard[i][j].symbol = gBoard[i][j].value
      gGame.markedCount--
      gBoard[i][j].isMarked = false
      renderBoard(gBoard)
      checkGameOver()
    } else {
      event.preventDefault()
      gBoard[i][j].symbol = "🚩"
      gGame.markedCount--
      gBoard[i][j].isMarked = true
      renderBoard(gBoard)
      checkGameOver()
    }
  }
}

function checkGameOver() {
  if (coverCells() - markedCells() <= 0 || life === 0) {
    clearInterval(gTimerInterval)
    gGame.isOn = false
    gClickCounter = 0
    elGameOverModal.style.display = "block"
    elGame.style.display = "block"
    if (coverCells() - markedCells() <= 0) {
      elGame.innerText = "😎"
      recordBoard()
    }
    if (life === 0) {
      elGame.innerText = "🤯"
      isLose = true
    }
  }
}

function createMine() {
  var emptyCells = getEmptyCell()

  for (var i = 0; i < gLevel.MINES; i++) {
    var currRandomNum =
      emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)]
    gMine = {
      location: {
        i: currRandomNum.i,
        j: currRandomNum.j,
      },
    }
    gBoard[gMine.location.i][gMine.location.j].isMine = true
    gBoard[gMine.location.i][gMine.location.j].symbol = BOMB
    gBoard[gMine.location.i][gMine.location.j].value = BOMB

    negsMinesAroundCount()
    renderBoard(gBoard)
  }
}

function getEmptyCell() {
  var emptyCell = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].isShown === true) {
        continue
      }
      if (gBoard[i][j].value !== BOMB) {
        emptyCell.push({ i: i, j: j })
      } else {
        continue
      }
    }
  }
  return emptyCell
}

function negsMinesAroundCount() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].value === BOMB) {
        continue
      } else if (setMinesNegsCount(i, j, gBoard) > 0) {
        gBoard[i][j].symbol = setMinesNegsCount(i, j, gBoard)
        gBoard[i][j].value = setMinesNegsCount(i, j, gBoard)
      }
    }
  }
}

function setMinesNegsCount(cellI, cellJ, gBoard) {
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

function blowupNegs(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      if (i === cellI && j === cellJ) continue
      if (gBoard[i][j].isMarked === true) continue
      if (gBoard[i][j] === BOMB) continue
      if (gBoard[i][j].isShown === true) continue
      gBoard[i][j].isShown = true
      if (gBoard[i][j].symbol === EMPTY) {
        blowupNegs(i, j)
      }
    }
  }
}

function levelChoice(num) {
  if (num === 1) {
    gLevel.LEVEL = 1
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gLevel.LIFE = 1
    elLife.innerText = "💙"
  }

  if (num === 2) {
    gLevel.LEVEL = 2
    gLevel.SIZE = 8
    gLevel.MINES = 14
    gLevel.LIFE = 2
    elLife.innerText = "💙💙"
  }

  if (num === 3) {
    gLevel.LEVEL = 3
    gLevel.SIZE = 12
    gLevel.MINES = 32
    gLevel.LIFE = 3
    elLife.innerText = "💙💙💙"
  }
  return
}

function coverCells() {
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
function markedCells() {
  var markedCell = 0
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].isMarked === true) {
        markedCell++
      }
    }
  }
  return markedCell
}

function toggleHint() {
  hintCredit = 1
  hintAmount--
  if (hintAmount === 2) elHint.innerText = "💡💡"
  if (hintAmount === 1) elHint.innerText = "💡"
  if (hintAmount === 0) elHint.innerText = ""
  if (hintAmount < 0) return

  if (isHint === false) {
    isHint = true
  } else if (isHint === true) {
    isHint = false
  }
}

function storage() {
  localStorage.setItem("nickname", nickname.value)
  welcome.innerHTML = "welcome " + localStorage.nickname + " !"
}

function recordBoard() {
  var elRecord1 = document.getElementById("lev1")
  var elRecord2 = document.getElementById("lev2")
  var elRecord3 = document.getElementById("lev3")

  if (elTimer.innerText <= localStorage.time1 && gLevel.LEVEL === 1) {
    strHTML = ""
    strHTML += "level : " + gLevel.LEVEL + "" + "  "
    strHTML += "time : " + elTimer.innerText + ""

    elRecord1.innerText = strHTML
    localStorage.setItem("time1", elTimer.innerText)
  }
  if (elTimer.innerText <= localStorage.time2 && gLevel.LEVEL === 2) {
    strHTML = ""
    strHTML += "level : " + gLevel.LEVEL + "" + "  "
    strHTML += "time : " + elTimer.innerText + ""

    elRecord2.innerText = strHTML
    localStorage.setItem("time2", elTimer.innerText)
  }
  if (elTimer.innerText <= localStorage.time3 && gLevel.LEVEL === 3) {
    strHTML = ""
    strHTML += "level : " + gLevel.LEVEL + "" + "  "
    strHTML += "time : " + elTimer.innerText + ""

    elRecord3.innerText = strHTML
    localStorage.setItem("time3", elTimer.innerText)
  }
}

function hint(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      if (gBoard[i][j].isMarked === true) continue

      if (hintCredit === 1) {
        if (gBoard[i][j].isShown === true) continue
        gBoard[i][j].isShown = true
        gBoard[i][j].isHint = true
      }
      if (hintCredit === 0) {
        if (gBoard[i][j].isHint === true) {
          gBoard[i][j].isShown = false
          gBoard[i][j].isHint = false
        }
      }
    }
  }
}

function safeClick() {
  if (safeClickAmount === 0) return

  var emptyCells = getEmptyCell()
  var currRandomNum =
    emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)]
  var safeClick = {
    location: {
      i: currRandomNum.i,
      j: currRandomNum.j,
    },
  }
  gBoard[safeClick.location.i][safeClick.location.j].isSafe = true

  console.log(gBoard[safeClick.location.i][safeClick.location.j])

  setTimeout(() => {
    gBoard[safeClick.location.i][safeClick.location.j].isSafe = false
    renderBoard(gBoard)
  }, "5000")

  renderBoard(gBoard)
  safeClickAmount--
  elSafeClicks.innerText = safeClickAmount
}

// function manuallyMine() {
//   mineAmount = gLevel.MINES
//   console.log(mineAmount)
//   isManuallyPos = true
// }
