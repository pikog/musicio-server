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

        // Form handler
        this.joinForm()

        // Load assets
        this.assetsLoader()

        // Render first screen
        this._composer.render()

      } else { // If no webgl
        this._$output.innerHTML = `Sorry you browser doesn't support webGL D:<br>
        <a href="https://www.mozilla.org/fr/firefox/" target="_blank" rel="noopener">Download Firefox here.</a>`
      }
    }
  }

  // Create default context
  initContext () {

    // Game state
    this._playing = false
    this._loaded = false
    this._loading = {
      done: 0,
      total: 0
    }

    // Socket
    this._socket = io() // localhost:8080

    // General DOM
    this._$output = this._$output
    this._$canvas = this._$output.querySelector("canvas")
    this._$ = {
      // Home
      home: this._$output.querySelector(".home"),
      joinForm: this._$output.querySelector(".joinForm"),
      join: this._$output.querySelector(".joinForm .join"),
      radio: this._$output.querySelectorAll(".joinForm [type='radio']"),
      auto: this._$output.querySelector(".joinForm #auto"),
      manual: this._$output.querySelector(".joinForm #manual"),
      optional: this._$output.querySelector(".joinForm .optional"),
      pseudo: this._$output.querySelector(".joinForm #pseudo"),
      room: this._$output.querySelector(".joinForm #room"),
      // HUD
      hud: this._$output.querySelector(".hud"),
      energy: this._$output.querySelector(".hud .energy"),
      energyCap: this._$output.querySelector(".hud .energyCap"),
      energyPoolState: this._$output.querySelector(".hud .energyPoolState"),
      energyPool: this._$output.querySelector(".hud .energyPool"),
      instrument: this._$output.querySelector(".hud .instrument"),
      upgrade: this._$output.querySelector(".hud .upgrade"),
      newInstrument: this._$output.querySelector(".hud .newInstrument"),
      higherEnergyCap: this._$output.querySelector(".hud .higherEnergyCap")
    }

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
    this._player = new MusicIOUserPlayer({ctx: this, color: this._playerColor, speed: 2}) // Player
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
      vignette: this._shader,
      outline: this._shader
    })
    this._terrain.mesh.createBorder()

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
    this._binding = ["KeyQ", "KeyW", "KeyE", "KeyR"]// Stand for "a, z, e, r" or "q, w, e, r"
    this._playerPlayed = false
    this._orchestor = new Orchestor(this, 4000, 200) // movInterval, playInterval

    // Fonts
    this._font = undefined

    // Energies node
    this._energies = new MusicIOEnergies(this, 0.001) // density

    // Form
    this._joinData = {
      room: Math.floor(Math.random() * 5 + 1),
      pseudo: `John Doe ${Date.now() % 10000}`
    }
  }

  // Join form handler
  joinForm () {
    const hash = window.location.hash.slice(1)

    if (hash) {
      this._$.auto.checked = false
      this._$.manual.checked = true
      this._$.room.value = hash
    }

    // Radio choice
    const checkSignup = () => {
      this._$.auto.checked ? this._$.optional.classList.remove("active") : this._$.optional.classList.add("active")
    }
    for (let i = 0; i < this._$.radio.length; i++) {
      this._$.radio[i].addEventListener("change", checkSignup)
    }
    checkSignup()

    // Join
    this._$.join.addEventListener("mouseup", () => {
      // Launching session if loaded
      if (this._loaded) {
        this.launchSession()
      }
    })
  }

  // Load all assets for musicIO
  assetsLoader () {
    this._loading.total = 0
    this._loading.done = 0
    this._orchestor.loadSound(this.loadedCallback.bind(this))

    const fontLoader = new THREE.FontLoader()
    this._loading.total++
    fontLoader.load("assets/fonts/ibm_plex_medium.json", (font) => {
      this._font = font
      this.loadedCallback()
    })
  }

  // Callback fired once an asset is loaded
  loadedCallback () {
    this._loading.done++
    if (this._loading.total && this._loading.done / this._loading.total == 1) {
      this._loaded = true
      this._$.join.innerHTML = "Join"
      return true
    } else {
      this._$.join.innerHTML = `<span>Loading (${this._loading.done}/${this._loading.total})</span>`
      return false
    }
  }

  launchSession () {
    if (!this._playing) {
      this._playing = true

      // Dom modification
      this._$.home.classList.remove("active")
      setTimeout(() => {this._$.home.classList.add("hidden")}, 500)

      // Handling form
      if (!this._$.auto.checked && this._$.room.value) {
        this._joinData.room = this._$.room.value
      }
      if (this._$.pseudo.value) {
        this._joinData.pseudo = this._$.pseudo.value
      }

      // Set player name
      this._player.setName(this._joinData.pseudo)

      // Set window hash
      window.location.hash = this._joinData.room

      // Events listener
      this.initListener()

      // Init sockets events
      this.initSocket()

      // Fps meter (require stats.min.js)
      this._stats = new Stats()
      this._$output.appendChild(this._stats.dom)

      // Start main loop
      this.loop()
    }
  }

  // Init events listener
  initListener () {
    // Resize handling
    this.updateSize()
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
      this._input[e.code] = true
      this.playNote(e.code)
      this._player.upgrade(e.code)
    })
    document.addEventListener("keyup", (e) => { this._input[e.code] = false })

    this._$.newInstrument.addEventListener("mouseup", () => {
      this._player.upgrade("instrument")
    })

    this._$.higherEnergyCap.addEventListener("mouseup", () => {
      this._player.upgrade("energy")
    })
  }

  // Init socket event
  initSocket () {
    console.info(`Connecting to room ${this._joinData.room}`)
    this._socket.emit("join", this._joinData.room, this._joinData.pseudo, this._playerColor)

    this._socket.emit("setInstrument", this._player._instruments[this._player._instrumentIndex])

    this._socket.on("updatePlayer", (players) => {
      this.updatePlayers(players)
    })

    this._socket.on("aPlayerPlayNote", (data) => {
      this.updateSound(data)
    })
  }

  // When user play a note
  playNote (key) {
    for (let i = 0; i < this._binding.length; i++) {
      if (this._binding[i] === key) {
        if (this._player._energy.pool >= 1) {
          this._playerPlayed = true
          this._orchestor.addSound(this._player._instruments[this._player._instrumentIndex], i)
          this._socket.emit("playNote", i)
        }
        break
      }
    }
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
          if (this._otherPlayers[j].energy != players[i].energy) {
            this._otherPlayers[j].energy = players[i].energy
            this._otherPlayers[j].render.updateSize(this._otherPlayers[j].energy)
          }
          found = true
          break
        }
      }

      // If not, then create it
      if (!found) {
        this._otherPlayers.push(players[i])
        this._otherPlayers[this._otherPlayers.length - 1].render = new MusicIOSimplePlayer({
          ctx: this,
          color: players[i].color,
          name: players[i].name,
          defaultEnergy: players[i].energy
        })
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
    this._energies.checkCollision()
    this._stats.update() // Stats
  }
}
