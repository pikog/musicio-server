/**
 * MusicIO player gestion
 */
class MusicIOplayer {
  constructor ({
    ctx,
    pos = { x : 0, y : 0 },
    speed = 0.5,
    cameraEasing = 0.5,
    cameraDistance = 60
  } = {}) {

    // Global var
    this._ctx = ctx
    this._screen = { w : window.innerWidth, h : window.innerHeight}

    // Player pos
    this._pos = pos
    // Player model
    this._mesh = new THREE.Object3D()
    this._parts = {}
    // Player speed
    this._speed = speed

    // Camera object
    this._camera = () => console.error("Camera not init with .initCamera()")
    // Camera follow easinf
    this._cameraEasing = cameraEasing
    // Camera distance from ground (0)
    this._cameraDistance = cameraDistance
    // Renderer object
    this._renderer = () => console.error("Renderer not init with .initRenderer()")
    // Composer
    this._composer = () => console.error("Composer not init with .initPostprocessing()")
    
    // Init player
    this.init()
    
    // Resize handling
    window.addEventListener("resize", this.resize.bind(this))
  }

  /**
   * Init everything
   */
  init() {
    // Create player shape
    this.create()
    // Init player camera
    this.initCamera()
    this.initRenderer()
    this.initPostprocessing(this._ctx.pp.fxaa, this._ctx.pp.ssao)

    this._mouse = { x: 0, y: 0 }
    window.addEventListener("mousemove", (e) => {
      this._mouse.x = Math.round((e.clientX / this._screen.w - 0.5) * 1000) / 1000
      this._mouse.y = Math.round((e.clientY / this._screen.h - 0.5) * 1000) / 1000
    })

    // Debug
    window.addEventListener("mouseup", () => {
      Math.floor(Math.random() * 2) ? this._camera.position.z = 400 : this._camera.position.z = this._cameraDistance
    })
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
    const material = new THREE.MeshPhongMaterial({
      color: this._ctx.color,
      flatShading: true
    })

    // Body
    const body = new THREE.Mesh(
      new THREE.SphereGeometry( 10, 8, 6 ),
      material
    )
    // Add body to player container
    this._parts.body = body
    this._parts.body.rotation.x = 25
    this._mesh.add(this._parts.body)
  }

  // Init the player's camera
  initCamera () {
    this._camera = new THREE.PerspectiveCamera(
      75,
      this._screen.w / this._screen.h,
      0.1,
      3000
    )
    this._camera.position.z = this._cameraDistance

    this._ctx.scene.add(this._camera)
  }

  // Init the player camera's renderer
  initRenderer () {
    this._renderer = new THREE.WebGLRenderer({
      canvas: this._ctx.$canvas,
      antialias: false
    })
    this._renderer.setClearColor(new THREE.Color("hsl(25, 25%, 50%)"))
    this._renderer.setPixelRatio(window.devicePixelRatio)
    this._renderer.setSize(this._screen.w, this._screen.h)
    this._renderer.shadowMap.enabled = false
  }

  // Init the postprocessing
  initPostprocessing (fxaa = false, ssao = false) {
    // Renderer
    this._composer = new THREE.EffectComposer(this._renderer)

    // Passes
    this._renderPass = new THREE.RenderPass(this._ctx.scene, this._camera)
    this._composer.addPass(this._renderPass)
    if (!(fxaa || ssao)) {
      this._renderPass.renderToScreen = true
    }

    if (fxaa) {
      this._effectFXAA = new THREE.ShaderPass(THREE.FXAAShader)
      this._effectFXAA.uniforms['resolution'].value.set(window.devicePixelRatio * 0.5 / this._screen.w, window.devicePixelRatio * 0.5 / this._screen.h)
      this._composer.addPass(this._effectFXAA)
      if (!ssao) {
        this._effectFXAA.renderToScreen = true
      }
    }

    if (ssao) {
      this._SSAOPass = new THREE.SSAOPass(this._ctx.scene, this._camera)
      this._composer.addPass(this._SSAOPass)
      this._SSAOPass.renderToScreen = true
    }
  }

  /**
   * Update everything
   */
  update (player) {
    // Define player position
    this._pos.x = player.position.x - this._ctx.terrain.w / 2
    this._pos.y = player.position.y - this._ctx.terrain.h / 2

    // Update player position
    this._mesh.position.x = this._pos.x
    this._mesh.position.y = this._pos.y

    // Make the camera follow the player with an easing
    this._camera.position.x += (this._pos.x - this._camera.position.x) * this._cameraEasing
    this._camera.position.y += (this._pos.y - this._camera.position.y) * this._cameraEasing

    // Force camera to lookAt player
    this._camera.lookAt(this._mesh.position)

    // Render the scene
    this._composer.render()
  }

  // Send updated mouse angle on move
  updateAngle() {
    // If mouse enough far away from center
    if (Math.abs(this._mouse.x) > 0.1 || Math.abs(this._mouse.y) > 0.1) {
      const norm = Math.sqrt(Math.pow((this._mouse.x), 2) + Math.pow((this._mouse.y), 2))
      socket.emit('move', {x: this._mouse.x / norm * this._speed, y: -this._mouse.y / norm * this._speed})
      //console.log(this._mouse.x / norm * 3, this._mouse.y / norm * 3)
    } else {
      socket.emit('move', {x: 0, y: 0})
    }
  }

  /**
   * Resize handling function
   */
  resize () {
    // Set width and height
    this._screen.w = window.innerWidth
    this._screen.h = window.innerHeight

    // Update camera
    this._camera.aspect = this._screen.w / this._screen.h
    this._camera.updateProjectionMatrix()

    // Update renderer
    this._renderer.setSize(this._screen.w, this._screen.h)

    this.initPostprocessing(this._ctx.pp.fxaa, this._ctx.pp.ssao)
  }
}