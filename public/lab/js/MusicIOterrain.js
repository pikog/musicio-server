/**
 * MusicIO terrain gestion
 */
class MusicIOterrain {
  constructor ({ctx} = {}) {
    this._ctx = ctx
    this._offset = []
    this._delta = 0
    this.create()

    if (this._ctx.terrain.noise || this._ctx.terrain.noiseOffset) {
      this.noiseMe(this._ctx.terrain.noise, this._ctx.terrain.noiseOffset)
    }

    this._ctx.scene.add(this._terrain)
    this.updateNoise()
  }

  // Create terrain
  create () {
    this._terrain = new THREE.Mesh(
      new THREE.PlaneGeometry(
        this._ctx.terrain.w * 1.5,
        this._ctx.terrain.h * 1.5,
        this._ctx.terrain.wSegments,
        this._ctx.terrain.hSegments
      ),
      new THREE.MeshPhongMaterial({
        color: new THREE.Color("hsl(150, 75%, 75%)"),
        flatShading: true
      })
    )
  }

  // Noise terrain
  noiseMe (value, offset) {
    for (let i = 0; i < this._terrain.geometry.vertices.length; i++) {
      this._offset.push(Math.random() * value + offset)
      this._terrain.geometry.vertices[i].z = this._offset[i]
    }
    this._terrain.geometry.computeFaceNormals()
    this._terrain.geometry.computeVertexNormals()
  }

  updateNoise () {
    this._delta += 0.0025
    for (let i = 0; i < this._terrain.geometry.vertices.length; i++) {
      this._terrain.geometry.vertices[i].z = Math.sin(this._delta + this._offset[i]) * 5
    }
    this._terrain.geometry.verticesNeedUpdate = true
  }
}