/**
 * Sounds orchestor using Pizzicato
 */
class Orchestor {
  constructor (movInterval = 4000, playInterval = 200) {
    this._basePATH = "assets/sounds/"

    // idea is to be able to play a sound with: this._sounds[mov]["instr"]["input"].play()
    this._sounds = [
      {
        cello : [
          "cello/1_cello_1.wav",
          "cello/1_cello_2.wav",
          "cello/1_cello_3.wav",
          "cello/1_cello_4.wav"
        ],
        clarinet : [
          "clarinet/1_clarinet_1.wav",
          "clarinet/1_clarinet_2.wav",
          "clarinet/1_clarinet_3.wav",
          "clarinet/1_clarinet_4.wav"
        ],
        harp : [
          "harp/1_harp_1.wav",
          "harp/1_harp_2.wav",
          "harp/1_harp_3.wav",
          "harp/1_harp_4.wav"
        ],
        string : [
          "string/1_string_1.wav",
          "string/1_string_2.wav",
          "string/1_string_3.wav",
          "string/1_string_4.wav"
        ],
        string2 : [
          "string2/1_string2_1.wav",
          "string2/1_string2_2.wav",
          "string2/1_string2_3.wav",
          "string2/1_string2_4.wav"
        ]
      },
      {
        cello : [
          "cello/2_cello_1.wav",
          "cello/2_cello_2.wav",
          "cello/2_cello_3.wav",
          "cello/2_cello_4.wav"
        ],
        clarinet : [
          "clarinet/2_clarinet_1.wav",
          "clarinet/2_clarinet_2.wav",
          "clarinet/2_clarinet_3.wav",
          "clarinet/2_clarinet_4.wav"
        ],
        harp : [
          "harp/2_harp_1.wav",
          "harp/2_harp_2.wav",
          "harp/2_harp_3.wav",
          "harp/2_harp_4.wav"
        ],
        string : [
          "string/2_string_1.wav",
          "string/2_string_2.wav",
          "string/2_string_3.wav",
          "string/2_string_4.wav"
        ],
        string2 : [
          "string2/2_string2_1.wav",
          "string2/2_string2_2.wav",
          "string2/2_string2_3.wav",
          "string2/2_string2_4.wav"
        ]
      },
      {
        cello : [
          "cello/3_cello_1.wav",
          "cello/3_cello_2.wav",
          "cello/3_cello_3.wav",
          "cello/3_cello_4.wav"
        ],
        clarinet : [
          "clarinet/3_clarinet_1.wav",
          "clarinet/3_clarinet_2.wav",
          "clarinet/3_clarinet_3.wav",
          "clarinet/3_clarinet_4.wav"
        ],
        harp : [
          "harp/3_harp_1.wav",
          "harp/3_harp_2.wav",
          "harp/3_harp_3.wav",
          "harp/3_harp_4.wav"
        ],
        string : [
          "string/3_string_1.wav",
          "string/3_string_2.wav",
          "string/3_string_3.wav",
          "string/3_string_4.wav"
        ],
        string2 : [
          "string2/3_string2_1.wav",
          "string2/3_string2_2.wav",
          "string2/3_string2_3.wav",
          "string2/3_string2_4.wav"
        ]
      }
    ]

    this._playing = {
      cello : {},
      clarinet : {},
      harp : {},
      string : {},
      string2 : {}
    }

    this._range = this._sounds[0]["cello"].length

    this._toPlay = new Pizzicato.Group()

    this._movInterval = movInterval
    this._playInterval = playInterval

    this._now = Date.now()
    this._lastTime = Date.now()

    this._structureIndex = 0

    // Movement structure
    this._structure = [
      0, 0, 0, 0,
      1, 1, 0, 0,
      2, 1, 0, 2
    ]

    this._canLoop = false

    this.loadSound()
  }

  loadSound () {
    let loading = 0, loaded = 0

    // Count number of sound to be loaded
    for (const movement of this._sounds) {
      for (const instr in movement) {
        for (const input in movement[instr]) {
          loading++
        }
      }
    }

    // Load each sounds
    for (const movement of this._sounds) {
      for (const instr in movement) {
        for (const input in movement[instr]) {
          movement[instr][input] = new Pizzicato.Sound({
            source: "file",
            options: {
              path: `${this._basePATH}${movement[instr][input]}`,
              attack: 0,
              release: 0
            }
          }, () => {
            loaded++
            console.log("Loading : ", Math.floor(loaded / loading * 10))
            if (loaded / loading == 1) {
              this.init()
            }
          })
        }
      }
    }

  }

  init () {
    console.log("All sound were loaded successfully")
    this._canLoop = true
  }

  addSound (instr, note) {
    this._playing[instr][note] = true
  }

  loop () {
    if (this._canLoop) {
      this._now = Date.now()
      // Update structure interval
      this.updateStructure()

      // Play current sounds
      this.playGroup()

      this._lastTime = this._now
    }
  }

  // Update if necessary current movement according to movement structure
  updateStructure () {
    if (Math.floor(this._now / this._movInterval) != Math.floor(this._lastTime / this._movInterval)) {
      this._structureIndex++
      this._structureIndex %= this._structure.length
    }
  }

  // Play current sounds that need to be played at each define timeinterval
  playGroup () {
    if (Math.floor(this._now / this._playInterval) != Math.floor(this._lastTime / this._playInterval)) {
      // Copy and reset playing object
      const playing = {...this._playing}
      //console.log(this._playing)
      this._playing = {
        cello : {},
        clarinet : {},
        harp : {},
        string : {},
        string2 : {}
      }

      // Building sound group
      for (const instr in this._playing) {
        for (let i = 0; i < this._range; i++) {
          if (playing[instr][i]) {
            this._sounds[this._structure[this._structureIndex]][instr][i].stop()
            this._toPlay.addSound(this._sounds[this._structure[this._structureIndex]][instr][i])
          }
        }
      }

      // Playing sound group
      this._toPlay.play()

      // Unbuilding sound group
      for (const instr in this._playing) {
        for (let i = 0; i < this._range; i++) {
          if (playing[instr][i]) {
            this._toPlay.removeSound(this._sounds[this._structure[this._structureIndex]][instr][i])
          }
        }
      }

    }
  }
}
