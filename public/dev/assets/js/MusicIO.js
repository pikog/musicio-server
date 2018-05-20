/**
 * Main controller for the game MusicIO
 */
class MusicIO {
  constructor (output) {
    // Try to get output element
    this._$output = document.querySelector(output)
    if (!this._$output) { // Handle error
      console.error(`Room: Can't find ${output}, please check that value`)
    } else { // Success
      if (Modernizr.webgl) { // If webgl
        // Create context
        this.initContext()

        // Events listener
        this.initListener()

        // Init sockets events
        this.initSocket()

        // Fps meter (require stats.min.js)
        this._stats = new Stats()
        this._$output.appendChild(this._stats.dom)

        // Start main loop
        this.loop()

        // Load medias
        this.load()
      } else { // If no webgl
        this._$output.innerHTML = `Sorry you browser doesn't support webGL D:<br>
        <a href="https://www.mozilla.org/fr/firefox/" target="_blank" rel="noopener">Download Firefox here.</a>`
      }
    }
  }

  // Load ressources before game start
  load () {

  }

  // Create default context
  initContext () {

    // Game state
    this._playing = false
    this._loaded = false

    // Socket
    this._socket = io()

    // General DOM
    this._$output = this._$output
    this._$canvas = this._$output.querySelector("canvas")

    // Global
    this._w = this._$output.offsetWidth
    this._h = this._$output.offsetHeight

    // THREE.js
    this._scene = new THREE.Scene() // Init scene
    this._terrain = {
      width: 500,
      height: 500
    }
    this._terrain.mesh = new MusicIOTerrain(this) // Terrain
    this._playerColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
    this._player = new MusicIOUserPlayer(this, this._playerColor, 2) // Player
    this._otherPlayers = []

    this._camera = new Utils3.Camera( // Init camera
      this._player._holder,
      70, // Camera angle
      this._w,
      this._h,
      80
    )
    this._renderer = new Utils3.Renderer({ // Init renderer
      canvas: this._$canvas,
      width: this._w,
      height: this._h,
      scene: this._scene,
      camera: this._camera
    })
    this._shader = true
    this._composer = new Utils3.Composer({ // Init composer
      renderer: this._renderer,
      scene: this._scene,
      camera: this._camera,
      bloom: this._shader,
      vignette: this._shader
    })

    // Mouse
    this._mouse = {
      x: 0,
      y: 0,
      clicked: false,
      moved: false
    }
    // Key memory
    this._input = {}

    // Sounds
    this._binding = "azer"
    this._instr = [ // All possible instrument
      "cello",
      "clarinet",
      "harp",
      "string",
      "string2"
    ]
    this._playerInstr = this._instr[Math.floor(Math.random() * this._instr.length)] // Define player instrument
    this._orchestor = new Orchestor(4000, 200) // movInterval, playInterval
  }

  // Init events listener
  initListener () {
    // Resize handling
    window.addEventListener("resize", this.updateSize.bind(this))

    // Mouse info
    this._$output.addEventListener("mousemove", (e) => {
      this._mouse.x = Math.round((e.clientX / this._w - 0.5) * 100) / 100
      this._mouse.y = Math.round((e.clientY / this._h - 0.5) * 100) / -100
      this._mouse.moved = true
    })
    this._$output.addEventListener("mousedown", () => { this._mouse.clicked = true })
    this._$output.addEventListener("mouseup", () => { this._mouse.clicked = false })

    // Key info
    document.addEventListener("keydown", (e) => {
      this._input[e.key] = true
      for (let i = 0; i < this._binding.length; i++) {
        if (this._binding.charAt(i) === e.key) {
          this._orchestor.addSound(this._playerInstr, i)
          this._socket.emit("playNote", i)
          break
        }
      }
    })
    document.addEventListener("keyup", (e) => { this._input[e.key] = false })

    document.addEventListener("mouseup", () => {
      Math.floor(Math.random() * 2) ? this._camera.set("pos", {x: 0, y: 80, z: 0}) : this._camera.set("pos", {x: 0, y: 300, z: 0})
    })
  }

  // Init socket event
  initSocket () {
    this._socket.emit("join", "3", `${Math.random()}`, this._playerColor)

    this._socket.emit("setInstrument", this._playerInstr)

    this._socket.on("updatePlayer", (players) => {
      this.updatePlayers(players)
    })

    this._socket.on("aPlayerPlayNote", (data) => {
      this.updateSound(data)
    })
  }

  // Update all players
  updatePlayers (players) {
    // Update our player
    this._player.move(...players.splice(0, 1))
    // Then update others

    // Looking in otherPlayers
    for (let i = 0; i < this._otherPlayers.length; i++) {
      let dead = true
      // For dead one
      for (let j = 0; j < players.length; j++) {
        if (players[j].id && this._otherPlayers[i].id && players[j].id == this._otherPlayers[i].id) {
          dead = false
          break
        }
      }
      // If dead then die and delete from array
      if (dead) {
        this._otherPlayers[i].render.die()
        this._otherPlayers.splice(i, 1)
      }
    }

    // Looking in players
    for (let i = 0; i < players.length; i++) {
      let found = false
      // For the same one in otherPlayers
      for (let j = 0; j < this._otherPlayers.length; j++) {
        // If found, then update
        if (this._otherPlayers[j].id == players[i].id) {
          this._otherPlayers[j].render.move(players[i])
          this._otherPlayers[j].musicInfo = players[i].musicInfo
          found = true
          break
        }
      }
      // If not, then create it
      if (!found) {
        this._otherPlayers.push(players[i])
        this._otherPlayers[this._otherPlayers.length - 1].render = new MusicIOSimplePlayer(this, players[i].color)
      }
    }

  }

  // Add sounds when a player play a sound
  updateSound(data) {
    for (const player of this._otherPlayers) {
      if (player.id = data.id) {
        this._orchestor.addSound(player.musicInfo.instrument, data.note)
        break
      }
    }
  }

  // Handle resize
  updateSize () {
    this._w = this._$output.offsetWidth
    this._h = this._$output.offsetHeight

    this._camera.updateSize(this._w, this._h)
    this._renderer.updateSize(this._w, this._h)
    this._composer.updateSize(this._w, this._h)
  }

  // Main loop
  loop () {
    window.requestAnimationFrame(this.loop.bind(this))
    this._composer.render()
    this._orchestor.loop()
    this._player.update()
    this._stats.update() // Stats
  }
}
