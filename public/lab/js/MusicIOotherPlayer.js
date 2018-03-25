/**
 * MusicIO other player gestion
 */
class MusicIOotherPlayer {
  constructor ({
    ctx,
    player
  } = {}) {

    // Global var
    this._ctx = ctx
    this._player = player
    // Player pos
    this._pos = player.position
    // Player model
    this._mesh = new THREE.Object3D()
    this._parts = {}

    // Init player
    this.init()
  }

  /**
   * Init everything
   */
  init() {
    // Create player shape
    this.create()
  }

  // Sub init method

  // Create the player 3D model
  create () {
    // Player 3D container setup
    this._ctx.scene.add(this._mesh)
    this._mesh.position.x = this._pos.x
    this._mesh.position.y = this._pos.y
    this._mesh.position.z = 5


    // Global material
    const material =  new THREE.MeshStandardMaterial({
      color: this._player.color,
      metalness: 0.3,
      roughness: 0,
      flatShading: true
    })

    // Body
    const body = new THREE.Mesh(
      new THREE.SphereGeometry( 10, 8, 6 ),
      material
    )
    // Add body to player container
    this._parts.body = body
    this._mesh.add(this._parts.body)
  }

  /**
   * Update everything
   */
  update (position) {
    this._pos.x = position.x - this._ctx.terrain.w / 2
    this._pos.y = position.y - this._ctx.terrain.h / 2

    // Update player position
    this._mesh.position.x = this._pos.x
    this._mesh.position.y = this._pos.y
  }

  die () {
    this._ctx.scene.remove(this._mesh)
  }
}