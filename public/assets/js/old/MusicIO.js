/**
 * MusicIO main class
 */
class MusicIO {
  constructor ({
    canvas,
    terrainNoise = 5,
    terrainNoiseOffset = 0,
    terrainWSegments = 50,
    terrainHSegments = 50,
    tileWidth = 50,
    tileHeight = 50,
    tileWnum = 10,
    tileHnum = 10,
    fxaa = false,
    ssao = false,
    color = 0xFFFFFF
  } = {}) {

    // MusicIO global variables
    this._ctx = {
      scene : new THREE.Scene(),
      $canvas : canvas ? document.querySelector(canvas) : undefined,
      terrain : {
        w : tileWidth * tileWnum,
        h : tileHeight * tileHnum,
        wSegments : terrainWSegments,
        hSegments : terrainHSegments,
        noise : terrainNoise,
        noiseOffset : terrainNoiseOffset
      },
      tile : {
        w: tileWidth,
        h: tileHeight,
        wNum: tileWnum,
        hNum: tileHnum,
      },
      pp : {
        fxaa: fxaa,
        ssao: ssao
      },
      color : color
    }

    // Init game
    this.init()
    // Then launch
    this.globalUpdate()
  }
  
  /**
   * Init everything
   */
  init () {
    
    this._terrain = new MusicIOterrain({ctx : this._ctx})
    
    this._player = new MusicIOplayer({
      ctx : this._ctx,
      pos : {
        x : 50,
        y : 50
      }
    })

    this._orchestor = new MusicIOorchestor()

    this._otherPlayers = []
    
    // Init main lighting
    this.globalLightsInit()
  }

  globalLightsInit () {

    this._lights = {}

    const ambient = new THREE.AmbientLight(0x555555)
    this._lights.ambient = ambient
    this._ctx.scene.add(this._lights.ambient)

    const sun = new THREE.DirectionalLight(0xffffff, 1)
    /* sun.castShadow = false
    sun.shadow.camera.top = this._ctx.terrain.h
    sun.shadow.camera.right = this._ctx.terrain.w
    sun.shadow.camera.bottom = -this._ctx.terrain.h
    sun.shadow.camera.left = -this._ctx.terrain.w
    sun.shadow.camera.near = this._ctx.terrain.w + this._ctx.terrain.h
    sun.shadow.camera.far = (this._ctx.terrain.w + this._ctx.terrain.h) / 2 * 5
    sun.shadow.mapSize.width = 4096
    sun.shadow.mapSize.height = 4096 */
    sun.position.x = this._ctx.terrain.w * 2
    sun.position.y = this._ctx.terrain.h * 2
    sun.position.z = (this._ctx.terrain.w + this._ctx.terrain.h) / 2
    this._lights.sun = sun
    this._ctx.scene.add(this._lights.sun)
  }
  
  /**
   * Update everything
   */
  globalUpdate (players) {
    window.requestAnimationFrame(this.globalUpdate.bind(this))
    this._terrain.updateNoise()
    this._player.updateAngle()
    this._orchestor.loop()
  }

  socketUpdate (players) {
    this._player.update(players[0])
    players.splice(0, 1)
    this.updateOtherPlayers(players)
  }

  updateOtherPlayers (players) {
    // Looking in otherPlayers
    for (let i = 0; i < this._otherPlayers.length; i++) {
      let dead = true
      // For dead one
      for (let j = 0; j < players.length; j++) {
        if (players[j].id && this._otherPlayers[i].id && players[j].id == this._otherPlayers[i].id) {
          dead = false
          break
        }
      }
      // If dead then die and delete from array
      if (dead) {
        this._otherPlayers[i].render.die()
        this._otherPlayers.splice(i, 1)
      }
    }
    // Looking in player
    for (let i = 0; i < players.length; i++) {
      let found = false
      // For the same one in otherPlayers
      for (let j = 0; j < this._otherPlayers.length; j++) {
        // If found, then update
        if (this._otherPlayers[j].id == players[i].id) {
          this._otherPlayers[j].position = players[i].position
          this._otherPlayers[j].musicInfo = players[i].musicInfo
          this._otherPlayers[j].render.update(this._otherPlayers[j].position)
          found = true
          break
        }
      }

      
      // If not, then create it
      if (!found) {
        this._otherPlayers.push(players[i])
        this._otherPlayers[this._otherPlayers.length - 1].render = new MusicIOotherPlayer({
          ctx: this._ctx,
          player: players[i]
        })
      }
    }
  }

  updateSound (playerId) {
    for (const player of this._otherPlayers) {
      if (player.id == playerId) {
        this._orchestor.addSound(player.musicInfo.instrument, player.musicInfo.note)
        break
      }
    }
  }

  /**
   * Static texture load
   */
  static loadTexture (path, ratioW = 1, ratioH = 1) {
    const temp = new THREE.TextureLoader().load(path)
    temp.wrapS = THREE.RepeatWrapping
    temp.wrapT = THREE.RepeatWrapping
    temp.repeat.set( ratioW, ratioH ) // "taux de répétition"
    return temp
  }
}