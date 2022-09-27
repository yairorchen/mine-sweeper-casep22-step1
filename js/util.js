"use strict"

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
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
