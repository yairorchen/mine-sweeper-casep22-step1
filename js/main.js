'use strict'

//const
const BOMB = '*'
const NUMBER_ONE = '1️⃣'
const NUMBER_TWO = '2️⃣'
const NUMBER_THREE = '3️⃣'
const NUMBER_FOUR = '4️⃣'
const FLAG = '🚩'
const GRASS = '🟩'
const EMPTY = ''
const MINE = '*'


//global variable
var gMine

var gLevel ={
    SIZE: 8 ,
    MINES:4,
} 
var gBoard = createBoard()

// gGame = {
//     isOn: false,
//     shownCount: 0,
//     markedCount: 0,
//     secsPassed: 0
//    }


//function activation
negsMinesAroundCount()
createMine()
renderBoard(gBoard)

console.log(getEmptyCell()); 

//function

function initGame(){

}

function createBoard() {
    var board = []
   
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
        
            board[i][j]={pos:{i:i ,j:j} ,
             mineAroundCount:0 , isShown:false ,
              isMine:false , isMarked:false ,
               symbol:EMPTY , value:EMPTY }
            
            if(board[i][j].symbole==='*')
                {
                board[i][j].symbol = '*'
                board[i][j].value = BOMB
                board[i][j].isMine =true 
            }else{
                board[i][j].isMine =false
            }
        }
    }
    return board;
}



function negsMinesAroundCount(){
for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
        if(gBoard[i][j].value===BOMB){break}
        else if(setMinesNegsCount(i,j,gBoard)>0){
        gBoard[i][j].mineAroundCount= setMinesNegsCount(i,j,gBoard)
        gBoard[i][j].symbol=gBoard[i][j].mineAroundCount
        //  setMinesNegsCount(i,j,gBoard)
    
    }
}}

}


function negsInfoOnSymbol(){
for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
        if(gBoard[i][j].value===BOMB)continue
        if(setMinesNegsCount(i,j,gBoard)>0)
        if(setMinesNegsCount(i,j,gBoard)===1){gBoard[i][j].symbol=NUMBER_ONE}
        if(setMinesNegsCount(i,j,gBoard)===2){gBoard[i][j].symbol=NUMBER_TWO}
        if(setMinesNegsCount(i,j,gBoard)===3){gBoard[i][j].symbol=NUMBER_THREE}
        if(setMinesNegsCount(i,j,gBoard)===4){gBoard[i][j].symbol=NUMBER_FOUR}
    }
}
}



function setMinesNegsCount(cellI,cellJ,gBoard){
    // console.log(gBoard);
var bombsAround = 0
for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        if (j < 0 || j >= gBoard[i].length) continue;
        if (i === cellI && j === cellJ) continue;
        if (gBoard[i][j].symbol === '*') {bombsAround++};
    }
} 
return bombsAround;

}



function renderBoard() {
    negsMinesAroundCount()

    var strHTML = ''
    
    for(var i = 0; i < gBoard.length; i++){
        strHTML += '\n<tr>\n'
        for(var j = 0; j < gBoard[i].length; j++){
            
            var classStr = gBoard[i][j].isMine ? 'mine' : EMPTY

            if(gBoard[i][j].isShown) {classStr = ' shown'}
            else{classStr = ' hide'}
               
            var dataAttribStr = `data-i="${i}" data-j="${j}"`
            strHTML += `\t<td ${dataAttribStr}
                    onclick="cellClicked(this, ${i}, ${j})" 
                    class="${classStr}">${gBoard[i][j].symbol}</td>\n`
        }
        strHTML += '\n</tr>'
    } 
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    // console.log(strHTML);
}



function cellClicked(elCell , i ,j){
    console.log(elCell);
    if(elCell.innerHTML==='*'){console.log('game over');
    gBoard[i][j].isShown=true
    }
    if(elCell.innerHTML>0){console.log('its number');
    gBoard[i][j].isShown=true
    }
    else{gBoard[i][j].isShown=true}

    renderBoard(gBoard)
}


function cellMarked(elCell){

}

function checkGameOver(){

}

function expandShown(board , elCell, i,j){

}



function randomMineLocation(){

}


// WORKING AREA!! HERE IS ALL OF THE MESS!

  function getEmptyCell(){
    var emptyCell = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if(gBoard[i][j].value===EMPTY){
                emptyCell.push({i:i,j:j})
            }
        } 
    }return emptyCell
}

    function createMine() {
        console.log('MINE')
        var emptyCells = getEmptyCell()
        for (var i = 0 ; i<gLevel.MINES; i++){
        var emptyCells = getEmptyCell()  
            gMine = {
                location: {
                    i: emptyCells[getRandomIntInclusive(0, emptyCells.length-1)].i,
                    j: emptyCells[getRandomIntInclusive(0, emptyCells.length-1)].j,
                }
            } 
            console.log(gMine); 
            gBoard[gMine.location.i][gMine.location.j].isMine = true
            gBoard[gMine.location.i][gMine.location.j].symbol ='*'
  
        }renderBoard(gBoard)
        console.log(gBoard);
     }