/**
 * Music IO terrain generator
 */
class MusicIOTerrain {
  constructor (ctx) {
    this._ctx = ctx

    this.createTerrain()
    this.createLight()
  }

  // Create and noise terrain
  createTerrain () {
    const geometry = new THREE.PlaneGeometry(
      this._ctx._terrain.width * 1.5,
      this._ctx._terrain.height * 1.5,
      this._ctx._terrain.width / 20,
      this._ctx._terrain.height / 20
    )

    // Noise geomrtry
    this._offset = []
    for (let i = 0; i < geometry.vertices.length; i++) {
      this._offset.push(Math.random() * 10)
      geometry.vertices[i].z = this._offset[i]
    }

    const material = new THREE.MeshStandardMaterial({
      color: 0x48fe96,
      flatShading: true,
      metalness: 0.1,
      roughness: 0.6
    })

    this._mesh = new THREE.Mesh(geometry, material)
    this._mesh.rotation.x = -Math.PI / 2
    this._mesh.position.set(this._ctx._terrain.width / 2, -10, this._ctx._terrain.height / 2)

    this._ctx._scene.add(this._mesh)
  }

  // Create light
  createLight () {
    this._sunLight = new THREE.DirectionalLight(0xffffff, 0.5)
    this._sunLight.position.set(1, 1, 1)
    this._ctx._scene.add(this._sunLight)
    this._ambientLight = new THREE.AmbientLight(0x292929, 0.5)
    this._ctx._scene.add(this._ambientLight)
  }
}
