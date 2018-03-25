// Init
let fxaa, ssao, room, name

if (false) {
  fxaa = parseInt(window.prompt("Turn on anti-alliasing ? 0/1"))
  if (fxaa != 1) {
    fxaa = false
  }
  ssao = parseInt(window.prompt("Turn on ambient ? 0/1"))
  if (ssao != 1) {
    ssao = false
  }
  room = window.prompt("Room name ?")
  if (room == "") {
    room = "1"
  }
  name = window.prompt("Player name ?")
} else {
  fxaa = false
  ssao = false
  room = 'a0ddddqhsd0'
  name = Math.floor(Math.random() * 1000)
  //const name= `${Date.now()}${Math.floor(Math.random() * Date.now())}`
}

const rngColorGen = () => {
  return new THREE.Color(`hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`)
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
socket.on("updatePlayer", (players) => {
  game.socketUpdate(players)
  drawPlayers(players)
})

socket.on("aPlayerPlaySound", (player) => {
  game.updateSound(player)
})