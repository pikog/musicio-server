// Init
let fxaa = parseInt(window.prompt("Turn on anti-alliasing ? 0/1"))
if (fxaa != 1) {
  fxaa = false
}
let ssao = parseInt(window.prompt("Turn on ambient ? 0/1"))
if (ssao != 1) {
  ssao = false
}
let devTools = parseInt(window.prompt("Devtools ? 0/1"))
if (devTools != 0) {
  devTools = true
}
let room = window.prompt("Room name ?")
if (room == "") {
  room = "1"
}
const name = window.prompt("Player name ?")
/* const fxaa = false
const ssao = false
const room = 999
const name = Math.floor(Math.random() * 1000) */
//const name= `${Date.now()}${Math.floor(Math.random() * Date.now())}`

const rngColorGen = () => {
  let s = "0x"
  const c = "0123456789ABCDEF"
  for (let i = 0; i < 6; i++) {
    s += c.charAt(Math.floor(Math.random() * c.length))
  }
  return parseInt(s)
}

const rngColor = rngColorGen()
console.log(rngColor)

// Init socket
const socket = io()
socket.emit("join", room, name, rngColor)

const game = new MusicIO({
  canvas : ".musicIO",
  fxaa: fxaa,
  ssao: ssao,
  color: rngColor
})


// Update pos
socket.on('updatePlayer', (players) => {
  game.socketUpdate(players)
  if (devTools) {
    drawPlayers(players)
  }
})

/* socket.on('aPlayerPlaySound', (player) => {
    aPlayerPlaySound(player)
}) */
