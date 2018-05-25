/**
 * Music IO simple player class
 */
class MusicIOSimplePlayer {
  constructor (ctx, color = ffffff, radius = 10) {
    this._ctx = ctx
    this._color = new THREE.Color(color)

    this._holder = new THREE.Object3D()

    this._radius = radius
    this._scale = 1

    // Position holder
    this._pos = {x: 0, y: 0, z: 0}

    this.createPlayer()
    this._ctx._scene.add(this._holder)
  }

  // Create player mesh
  createPlayer () {
    const geometry = new THREE.SphereBufferGeometry(this._radius, Math.floor(Math.random() * 3 + 7), Math.floor(Math.random() * 3 + 7))
    const material = new THREE.MeshStandardMaterial({
      color: this._color,
      flatShading: true,
      metalness: 0.1,
      roughness: 0.6
    })

    this._mesh = new THREE.Mesh(geometry, material)
    this._mesh.rotation.x = -Math.PI / 2

    this._holder.add(this._mesh)
  }

  updateSize (value) {
    this._scale = (this._radius + (Math.log10(value + 100) - 2) * 20) / 10
    this._holder.scale.set(this._scale, this._scale, this._scale)
  }

  // Move player
  move (position, add = false) {
    position = position.position ? position.position : position
    if (this._pos.x != position.x || this._pos.z != position.y) {
      if (add) {
        this._pos.x = this._pos.x + position.x
        this._pos.z = this._pos.z + position.y
        this._pos.x = Math.max(Math.min(this._pos.x, this._ctx._terrain.width - this._radius), this._radius)
        this._pos.z = Math.max(Math.min(this._pos.z, this._ctx._terrain.height - this._radius), this._radius)
      } else {
        this._pos.x = position.x
        this._pos.z = position.y
      }

      this._holder.position.set(this._pos.x, 0, this._pos.z)
      this._holder.position.set(this._pos.x, 0, this._pos.z)
    }
  }

  // Delete player
  die () {
    this._ctx._scene.remove(this._holder)
  }
}
