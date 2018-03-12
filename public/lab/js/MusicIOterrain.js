/**
 * MusicIO terrain gestion
 */
class MusicIOterrain {
  constructor ({ctx} = {}) {
    this._ctx = ctx
    this.create()

    if (this._ctx.terrain.noise || this._ctx.terrain.noiseOffset) {
      this.noiseMe(this._ctx.terrain.noise, this._ctx.terrain.noiseOffset)
    }

    this._terrain.receiveShadow = true
    this._ctx.scene.add(this._terrain)
  }

  // Create terrain
  create () {
    this._terrain = new THREE.Mesh(
      new THREE.PlaneGeometry(
        this._ctx.terrain.w,
        this._ctx.terrain.h,
        this._ctx.terrain.wSegments,
        this._ctx.terrain.hSegments
      ),
      new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        wireframe: true
      })
    )
    this._terrain.castShadow = true
    this._terrain.receiveShadow = true
  }

  // Noise terrain
  noiseMe (value, offset) {
    for (const vertice of this._terrain.geometry.vertices) {
      vertice.z += Math.round(Math.random() * value) + offset
    }
    this._terrain.geometry.computeFaceNormals()
    this._terrain.geometry.computeVertexNormals()
  }
}