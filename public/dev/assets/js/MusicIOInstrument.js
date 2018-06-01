/**
 * Music IO energy node gestion class
 */
class MusicIOInstrument {
  constructor (ctx, x, y, name) {
    this._ctx = ctx

    this._pos = {
      x: x,
      y: 5,
      z: y
    }

    this._name = name

    this._radius = 4

    // Mesh holder
    this._holder = new THREE.Object3D()
    this._holder.position.set(this._pos.x, this._pos.y, this._pos.z)

    // Create mesh
    const geometry = new THREE.TorusKnotBufferGeometry(this._radius, this._radius / 3, 80, 12)
    const material = Utils3.randomColorMaterial()
    this._mesh = new THREE.Mesh(geometry, material)
    this._mesh.rotation.x = Math.PI / 2

    this._holder.add(this._mesh)

    this._ctx._scene.add(this._holder)
  }

  // Delete instrument
  die () {
    this._ctx._scene.remove(this._holder)
  }
}
