'use strict'

// function exampleMat() {
//     var newMat = []
//     for (var i = 0; i < 4; i++) {
//         newMat[i] = [];
//         for (var j = 0; j < 4; j++) {
//            newMat[i][j].push({i:i , j:j})
//         }
//     }
//     return newMat;
// }
// console.log(exampleMat());

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}