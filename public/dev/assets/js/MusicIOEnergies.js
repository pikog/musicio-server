/**
 * Music IO energy node gestion class
 */
class MusicIOEnergies {
  constructor (ctx, density = 0.1) {
    this._ctx = ctx
    this._density = density

    this._holder = new THREE.Object3D()

    this._count = Math.round(this._ctx._terrain.width * this._ctx._terrain.width * density)

    // Geometry list
    this._geometry = [
      new THREE.SphereBufferGeometry(1.5, 7, 6),
      new THREE.BoxBufferGeometry(2, 2, 2),
      new THREE.DodecahedronBufferGeometry(1.5),
      new THREE.IcosahedronBufferGeometry(1.5),
      new THREE.OctahedronBufferGeometry(1.5)
    ]

    // Nodes holder
    this._nodes = []

    // Generate missing energies node
    this.generate()

    this._ctx._scene.add(this._holder)
  }

  generate () {
    while (this._nodes.length < this._count) {
      this.createEnergyNode()
    }
  }

  // Create player mesh
  createEnergyNode () {
    const x = Math.round(Math.random() * this._ctx._terrain.width)
    const z = Math.round(Math.random() * this._ctx._terrain.height)

    const geometry = this._geometry[Math.floor(Math.random() * this._geometry.length)]
    const material = Utils3.randomColorMaterial()

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, 5, z)

    this._holder.add(mesh)
    this._nodes.push({
      x: x,
      z: z,
      mesh: mesh
    })
  }

  checkCollision () {
    const playerX = this._ctx._player._pos.x
    const playerZ = this._ctx._player._pos.z
    const radius = this._ctx._player._radius * this._ctx._player._scale.current
    const length = this._nodes.length

    let deleted = 0

    for (let i = 0; i < length; i++) {
      if (!this._nodes[i - deleted]) {
        console.log(this._nodes[i - deleted], i, length)
      }
      const nodeX = this._nodes[i - deleted].x
      const nodeZ = this._nodes[i - deleted].z

      const dist = Math.sqrt((playerX - nodeX) ** 2 + (playerZ - nodeZ) ** 2)

      if (dist < radius + 1) {
        this.die(i - deleted++)
      }
    }

    this.generate()
  }

  // Delete node at specified index
  die (index) {
    this._ctx._player.addEnergy(2 / this._ctx._player._scale.current)
    this._holder.remove(this._nodes[index].mesh)
    this._nodes.splice(index, 1)
  }
}
