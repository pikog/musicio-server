/**
 * Music IO simple player class
 */
class MusicIOSimplePlayer {
  constructor (ctx, color = ffffff) {
    this._ctx = ctx
    this._color = new THREE.Color(color)

    this._holder = new THREE.Object3D()

    // Position holder
    this._pos = {x: 0, y: 0, z: 0}

    this.createPlayer()
    this._ctx._scene.add(this._holder)
  }

  // Create player mesh
  createPlayer () {
    const geometry = new THREE.SphereGeometry(10, Math.floor(Math.random() * 3 + 7), Math.floor(Math.random() * 3 + 7))
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

  // Move player
  move (player) {
    if (this._pos.x != player.position.x || this._pos.z != player.position.y) {
      this._pos.x = player.position.x
      this._pos.z = player.position.y
      this._holder.position.set(this._pos.x, 0, this._pos.z)
      this._holder.position.set(this._pos.x, 0, this._pos.z)
    }
  }

  // Delete player
  die () {
    this._ctx._scene.remove(this._holder)
  }
}
