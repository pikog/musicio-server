/**
 * MusicIO main class
 */
class MusicIOorchestor {
  constructor () {
    this._basePATH = "sounds/"

    // Define all possible instrument
    this._instr = [
      "cello",
      "clarinet",
      "harp",
      "string",
      "string2"
    ]

    // Define player instrument
    this._playerInstr = this._instr[Math.floor(Math.random() * this._instr.length)]
    socket.emit("setNote", this._playerInstr, "a")

    console.log(this._playerInstr)

    // this._sounds[mov]["instr"]["input"].play()
    this._sounds = [
      {
        cello : {
          a : "cello/1_cello_1.wav",
          z : "cello/1_cello_2.wav",
          e : "cello/1_cello_3.wav",
          r : "cello/1_cello_4.wav",
        },
        clarinet : {
          a : "clarinet/1_clarinet_1.wav",
          z : "clarinet/1_clarinet_2.wav",
          e : "clarinet/1_clarinet_3.wav",
          r : "clarinet/1_clarinet_4.wav",
        },
        harp : {
          a : "harp/1_harp_1.wav",
          z : "harp/1_harp_2.wav",
          e : "harp/1_harp_3.wav",
          r : "harp/1_harp_4.wav",
        },
        string : {
          a : "string/1_string_1.wav",
          z : "string/1_string_2.wav",
          e : "string/1_string_3.wav",
          r : "string/1_string_4.wav",
        },
        string2 : {
          a : "string2/1_string2_1.wav",
          z : "string2/1_string2_2.wav",
          e : "string2/1_string2_3.wav",
          r : "string2/1_string2_4.wav",
        }
      },
      {
        cello : {
          a : "cello/2_cello_1.wav",
          z : "cello/2_cello_2.wav",
          e : "cello/2_cello_3.wav",
          r : "cello/2_cello_4.wav",
        },
        clarinet : {
          a : "clarinet/2_clarinet_1.wav",
          z : "clarinet/2_clarinet_2.wav",
          e : "clarinet/2_clarinet_3.wav",
          r : "clarinet/2_clarinet_4.wav",
        },
        harp : {
          a : "harp/2_harp_1.wav",
          z : "harp/2_harp_2.wav",
          e : "harp/2_harp_3.wav",
          r : "harp/2_harp_4.wav",
        },
        string : {
          a : "string/2_string_1.wav",
          z : "string/2_string_2.wav",
          e : "string/2_string_3.wav",
          r : "string/2_string_4.wav",
        },
        string2 : {
          a : "string2/2_string2_1.wav",
          z : "string2/2_string2_2.wav",
          e : "string2/2_string2_3.wav",
          r : "string2/2_string2_4.wav",
        }
      },
      {
        cello : {
          a : "cello/3_cello_1.wav",
          z : "cello/3_cello_2.wav",
          e : "cello/3_cello_3.wav",
          r : "cello/3_cello_4.wav",
        },
        clarinet : {
          a : "clarinet/3_clarinet_1.wav",
          z : "clarinet/3_clarinet_2.wav",
          e : "clarinet/3_clarinet_3.wav",
          r : "clarinet/3_clarinet_4.wav",
        },
        harp : {
          a : "harp/3_harp_1.wav",
          z : "harp/3_harp_2.wav",
          e : "harp/3_harp_3.wav",
          r : "harp/3_harp_4.wav",
        },
        string : {
          a : "string/3_string_1.wav",
          z : "string/3_string_2.wav",
          e : "string/3_string_3.wav",
          r : "string/3_string_4.wav",
        },
        string2 : {
          a : "string2/3_string2_1.wav",
          z : "string2/3_string2_2.wav",
          e : "string2/3_string2_3.wav",
          r : "string2/3_string2_4.wav",
        }
      },
    ]

    this._binding = ["a", "z", "e", "r"]

    this._playing = {
      cello : {},
      clarinet : {},
      harp : {},
      string : {},
      string2 : {}
    }
    // Not used :
    this._oldPlaying = {
      cello : {},
      clarinet : {},
      harp : {},
      string : {},
      string2 : {}
    }
    
    this._toPlay = new Pizzicato.Group()

    this._movInterval = 4000
    this._playInterval = 200

    this._lastTime = Date.now()

    this._structureIndex = 0
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
    for (const movement of this._sounds) {
      for (const instr in movement) {
        for (const input in movement[instr]) {
          loading++
        }
      }
    }

    for (const movement of this._sounds) {
      for (const instr in movement) {
        for (const input in movement[instr]) {
          movement[instr][input] = new Pizzicato.Sound(`${this._basePATH}${movement[instr][input]}`, () => {
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

    document.addEventListener("keydown", (e) => {
      if (this._binding.indexOf(e.key) + 1) {
        this.addSound(this._playerInstr, e.key)
        socket.emit("setNote", this._playerInstr, e.key)
        socket.emit("playSound")
      }
    })

    document.addEventListener("keyup", (e) => {
      //this._oldPlaying[this._playerInstr][e.key] = false
    })

    this._canLoop = true
  }

  addSound (instr, note) {
    this._playing[instr][note] = true
  }

  loop () {
    if (this._canLoop) {
      // Each movInterval of time
      if (Math.floor(Date.now() / this._movInterval) != Math.floor(this._lastTime / this._movInterval)) {
        this._structureIndex++
        this._structureIndex %= this._structure.length
      }
  
      // Each playInterval of time
      if (Math.floor(Date.now() / this._playInterval) != Math.floor(this._lastTime / this._playInterval)) {
        // Copy and reset playing object
        const playing = {...this._playing}
        this._playing = {
          cello : {},
          clarinet : {},
          harp : {},
          string : {},
          string2 : {}
        }
  
        // Building sound group
        for (const instr in this._playing) {
          for (const key of this._binding) {
            if (playing[instr][key]) {
              this._sounds[this._structure[this._structureIndex]][instr][key].stop()
              //this._sounds[this._structure[this._structureIndex]][instr][key].clone().play()
              this._toPlay.addSound(this._sounds[this._structure[this._structureIndex]][instr][key])
            }
          }
        }
  
        // Playing sound group
        this._toPlay.play()
  
        // Unbuilding sound group
        for (const instr in this._playing) {
          for (const key of this._binding) {
            if (playing[instr][key]) {
              this._toPlay.removeSound(this._sounds[this._structure[this._structureIndex]][instr][key])
            }
          }
        }
      }
  
      this._lastTime = Date.now()
    }
  }
}