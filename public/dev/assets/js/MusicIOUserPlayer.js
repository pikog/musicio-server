/**
 * Music IO player class
 */
class MusicIOUserPlayer extends MusicIOSimplePlayer {
  constructor (ctx, color = ffffff, speed = 5) {
    super(ctx, color)
    this._speed = speed
  }

  // Update depending on mouse position
  update () {
    const distToCenter = Math.sqrt(this._ctx._mouse.x ** 2 + this._ctx._mouse.y **2)
    if (distToCenter > 0.15) {
      const ratio = 1 / distToCenter
      this._ctx._socket.emit("move", {x: this._ctx._mouse.x / distToCenter * this._speed, y: -this._ctx._mouse.y / distToCenter * this._speed})
    } else {
      this._ctx._socket.emit("move", {x: 0, y: 0})
    }
  }
}
