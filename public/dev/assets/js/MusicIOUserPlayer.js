/**
 * Music IO player class
 */
class MusicIOUserPlayer extends MusicIOSimplePlayer {
  constructor (ctx, color = ffffff, speed = 5) {
    super(ctx, color)
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
    const distToCenter = Math.sqrt(this._ctx._mouse.x ** 2 + this._ctx._mouse.y ** 2)
    if (distToCenter > 0.05) {
      const maxSpeed = 0.5 * this._speed
      const x = Math.max(Math.min(this._ctx._mouse.x * this._speed, maxSpeed), - maxSpeed)
      const y = - Math.max(Math.min(this._ctx._mouse.y * this._speed, maxSpeed), - maxSpeed)

      // Tell server new vector
      if (this._energy.needUpdate) {
        this._energy.needUpdate = false
        this._ctx._socket.emit("move", {x: x, y: y}, this._energy.total)
      } else {
        this._ctx._socket.emit("move", {x: x, y: y})
      }

      // Local interpolation
      this.move({x: x, y: y}, true)
    } else {
      this._ctx._socket.emit("move", {x: 0, y: 0})
    }
  }

  // Get a new instrument
  newInstrument () {
    // Find new instrument different of current one
    const lastIndex = this._instrumentIndex
    this._instrumentIndex = Math.floor(Math.random() * (this._instruments.length - 1))
    if (this._instrumentIndex >= lastIndex) { this._instrumentIndex++ }

    // Set it
    this._ctx._socket.emit("setInstrument", this._instruments[this._instrumentIndex])
    this._ctx._$.instrument.innerText = `Playing: ${this._instrumentsText[this._instrumentIndex]}`
  }

  // Upgrade player
  upgrade (type = "energy") {
    if (this._energy.total - this._energy.spent >= this._energy.step) {
      this._energy.spent += this._energy.step
      this._energy.step *= 1.15
      if (type == "energy") { this._energy.cap += 10 }
      if (type == "instrument") { this.newInstrument() }
      this.updateEnergy()
    }
  }

  // Add energy to player
  addEnergy (point = 1) {
    this._energy.total = parseFloat((this._energy.total + point).toFixed(1))
    this._energy.pool = parseFloat((this._energy.pool + point).toFixed(1))
    this._energy.pool = Math.min(this._energy.pool, this._energy.cap)
    this.updateEnergy()
    this.updateSize(this._energy.total)
  }

  // Remove energy to player
  removeEnergy (point = 1) {
    this._energy.pool = parseFloat((this._energy.pool - point).toFixed(1))
    this._energy.pool = Math.max(this._energy.pool, 0)
    this.updateEnergy()
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
