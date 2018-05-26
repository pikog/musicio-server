/**
 * Music IO simple player class
 */
class MusicIOSimplePlayer {
  constructor ({
    ctx,
    color = "#ffffff",
    radius = 10,
    name = false,
    defaultEnergy = false
  } = {}) {
    this._ctx = ctx
    this._color = new THREE.Color(color)

    this._holder = new THREE.Object3D()

    // Player radius
    this._radius = radius

    this._scale = {
      goal: 1,
      current: 1
    }

    // Set default scale
    if (defaultEnergy) {
      this.updateSize(defaultEnergy, true)
    }

    // Position holder
    this._pos = {x: 0, y: 0, z: 0}

    this.createPlayer()
    if (name) {
      this.setName(name)
    }
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

  // Create name over player
  setName (name) {
    if (!this._name) {
      // Cut string if too long
      if (name.length > 20) {
        name = name.substring(0, 19) + "..."
      }
      this._name = name
      const size = 1.5
      const geometry = new THREE.TextGeometry(name, {
        font: this._ctx._font,
        size: size,
        height: 0.01,
        curveSegments: 12,
        bevelThickness: 12,
        bevelSize: 1,
        bevelEnabled: false
      })
      geometry.computeBoundingBox()
      geometry.translate(-0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x), 0, 0)
      const material = new THREE.MeshBasicMaterial({ color: 0xdedede })
      this._name = new THREE.Mesh(geometry, material)
      this._name.position.y = 10
      this._name.rotation.x = -Math.PI / 2
      this._holder.add(this._name)
    }
  }

  updateSize (value, instant = false) {
    this._scale.goal = 1 + 0.015 * value //(this._radius + (Math.log10(value + 100) - 2) * 20) / 10
    if (instant) {
      this._scale.current = this._scale.goal
    }
  }

  // Move player
  move (position, add = false) {
    position = position.position ? position.position : position
    if (this._pos.x != position.x || this._pos.z != position.y) {
      if (add) {
        this._pos.x = this._pos.x + position.x
        this._pos.z = this._pos.z + position.y
        this._pos.x = Math.max(Math.min(this._pos.x, this._ctx._terrain.width - this._radius * this._scale.current), this._radius * this._scale.current)
        this._pos.z = Math.max(Math.min(this._pos.z, this._ctx._terrain.height - this._radius * this._scale.current), this._radius * this._scale.current)
      } else {
        this._pos.x = position.x
        this._pos.z = position.y
      }

      this._holder.position.set(this._pos.x, 0, this._pos.z)
      this._holder.position.set(this._pos.x, 0, this._pos.z)
    }
    if (this._scale.goal != this._scale.current) {
      this._scale.current += 0.002 * Math.sign(this._scale.goal - this._scale.current)
      this._holder.scale.set(this._scale.current, this._scale.current, this._scale.current)
    }
  }

  // Delete player
  die () {
    this._ctx._scene.remove(this._holder)
  }
}
