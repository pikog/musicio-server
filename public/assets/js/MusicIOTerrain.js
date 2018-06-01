/**
 * Music IO terrain generator
 */
class MusicIOTerrain {
  constructor (ctx) {
    this._ctx = ctx

    this._holder = new THREE.Object3D()

    this.createTerrain()
    this.createLight()

    this._ctx._scene.add(this._holder)
  }

  // Create and noise terrain
  createTerrain () {
    const geometry = new THREE.PlaneGeometry(
      this._ctx._terrain.width * 3,
      this._ctx._terrain.height * 3,
      this._ctx._terrain.width / 10,
      this._ctx._terrain.height / 10
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

    this._floor = new THREE.Mesh(geometry, material)
    this._floor.rotation.x = -Math.PI / 2
    this._floor.position.set(this._ctx._terrain.width / 2, -10, this._ctx._terrain.height / 2)

    this._holder.add(this._floor)
  }

  // Create visual terrain border
  createBorder () {
    const geometry = new THREE.PlaneGeometry(this._ctx._terrain.width, this._ctx._terrain.height, 1, 1)

    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0
    })

    this._border = new THREE.Mesh(geometry, material)
    this._border.rotation.x = -Math.PI / 2
    this._border.position.set(this._ctx._terrain.width / 2, 10, this._ctx._terrain.height / 2)
    this._holder.add(this._border)
    this._ctx._composer.outlineSelect([this._border])
  }

  // Create light
  createLight () {
    this._sunLight = new THREE.DirectionalLight(0xffffff, 0.5)
    this._sunLight.position.set(1, 1, 1)
    this._holder.add(this._sunLight)
    this._ambientLight = new THREE.AmbientLight(0x292929, 0.5)
    this._holder.add(this._ambientLight)
  }
}
