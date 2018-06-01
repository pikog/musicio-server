/**
 * Music IO player class
 */
class MusicIOUserPlayer extends MusicIOSimplePlayer {
  constructor ({
    ctx,
    color = "#ffffff",
    radius = 10,
    name = false,
    speed = 2
  } = {}) {
    super({ctx: ctx, color: color, radius: radius, name: name})
    this._speed = speed

    this._instruments = [ // All possible instrument
      "cello",
      "clarinet",
      "harp",
      "string",
      "string2"
    ]

    this._instrumentsText = [
      "Cello",
      "Clarinet",
      "Harp",
      "String",
      "String II"
    ]

    this._instrumentIndex = Math.floor(Math.random() * this._instruments.length) // Define default player instrument

    this._ctx._$.instrument.innerText = `Playing: ${this._instrumentsText[this._instrumentIndex]}`

    // Player energy
    this._energy = {}
    this._energy.cap = 10
    this._energy.pool = this._energy.cap / 2
    this._energy.total = 0
    this._energy.spent = 0
    this._energy.step = 15
    this._energy.needUpdate = false
  }

  // Update depending on mouse position
  update () {
    // Check is mouse if far enough
    const distToCenter = Math.sqrt(this._ctx._mouse.x ** 2 + this._ctx._mouse.y ** 2)
    if (distToCenter > 0.05) {
      // Define max speed
      const maxSpeed = 0.5 * this._speed
      // Define new x / y vector
      const x = Math.max(Math.min(this._ctx._mouse.x * this._speed, maxSpeed), - maxSpeed)
      const y = - Math.max(Math.min(this._ctx._mouse.y * this._speed, maxSpeed), - maxSpeed)

      // Tell server new vector
      if (this._energy.needUpdate) {
        this._energy.needUpdate = false
        this._ctx._socket.emit("move", {x: x, y: y}, this._energy.pool)
      } else {
        this._ctx._socket.emit("move", {x: x, y: y})
      }

      // Local interpolation
      this.move({x: x, y: y}, true)

      // Check instrument collision
      this.checkInstrumentCollision()
    } else {
      this._ctx._socket.emit("move", {x: 0, y: 0})
    }
  }

  // Check collision between player and instrument on map
  checkInstrumentCollision () {
    for (const instrument of this._ctx._instrumentsHolder) {
      const dist = Math.sqrt((this._pos.x - instrument._pos.x) ** 2 + (this._pos.z - instrument._pos.z) ** 2)
      if (dist < (this._radius + instrument._radius * 1.2)) {
        this._ctx._socket.emit("removeInstrument", instrument._pos.x, instrument._pos.y)
        this.newInstrument() // instrument._name
      }
    }
  }

  // Get a new instrument
  newInstrument (name = false) {
    // Find new instrument different of current one
    let found = false
    if (name) {
      for (let i = 0; i < this._instruments.length; i++) {
        if (this._instruments[i] == name) {
          this._instrumentIndex = i
          found = true
          break
        }
      }
    }

    if (!name || !found) {
      const lastIndex = this._instrumentIndex
      this._instrumentIndex = Math.floor(Math.random() * (this._instruments.length - 1))
      if (this._instrumentIndex >= lastIndex) { this._instrumentIndex = (this._instrumentIndex + 1) % this._instruments.length }
    }

    // Set it
    this._ctx._socket.emit("setInstrument", this._instruments[this._instrumentIndex])
    this._ctx._$.instrument.innerText = `Playing: ${this._instrumentsText[this._instrumentIndex]}`
  }

  // Upgrade player
  upgrade (type = "energy") {
    if (type == "ShiftLeft") { type = "instrument"}
    else if (type == "Space") { type = "energy"}

    if (this._energy.total - this._energy.spent >= this._energy.step && (type == "energy" || type == "instrument")) {
      this._energy.spent += this._energy.step
      this._energy.step *= 1.15
      if (type == "energy") { this._energy.cap += 10 }
      else if (type == "instrument") { this.newInstrument() }
      this.updateEnergy()
    }
  }

  // Add energy to player
  addEnergy (point = 1) {
    this._energy.total = parseFloat((this._energy.total + point).toFixed(1))
    this._energy.pool = parseFloat((this._energy.pool + point).toFixed(1))
    this._energy.pool = Math.min(this._energy.pool, this._energy.cap)
    this.updateEnergy()
    this.updateSize(this._energy.pool)
  }

  // Remove energy to player
  removeEnergy (point = 1) {
    this._energy.pool = parseFloat((this._energy.pool - point).toFixed(1))
    this._energy.pool = Math.max(this._energy.pool, 0)
    this.updateEnergy()
    this.updateSize(this._energy.pool)
  }

  // Manage energy update (hud, level up, etc.)
  updateEnergy () {
    this._energy.needUpdate = true

    const ratio = this._energy.pool / this._energy.cap
    this._ctx._$.energyPool.innerText = `${this._energy.pool} / ${this._energy.cap}`
    this._ctx._$.energyPoolState.style.transform = `scale(${ratio}, ${ratio})`

    if (this._energy.total - this._energy.spent >= this._energy.step) {
      this._ctx._$.upgrade.classList.add("active")
    } else {
      this._ctx._$.upgrade.classList.remove("active")
    }
  }
}
