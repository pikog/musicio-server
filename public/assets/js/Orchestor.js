/**
 * Sounds orchestor using Pizzicato
 */
class Orchestor {
  constructor (ctx, movInterval = 4000, playInterval = 200) {
    this._ctx = ctx
    this._basePATH = "assets/sounds/"

    // idea is to be able to play a sound with: this._sounds[mov]["instr"]["input"].play()
    this._sounds = [
      {
        bass : [
          "bass/1_bass_1.wav",
          "bass/1_bass_2.wav",
          "bass/1_bass_3.wav",
          "bass/1_bass_4.wav",
          "bass/1_bass_3.wav",
          "bass/1_bass_2.wav"
        ],
        cello : [
          "cello/1_cello_1.wav",
          "cello/1_cello_2.wav",
          "cello/1_cello_3.wav",
          "cello/1_cello_4.wav",
          "cello/1_cello_3.wav",
          "cello/1_cello_2.wav"
        ],
        horn : [
          "horn/1_horn_1.wav",
          "horn/1_horn_2.wav",
          "horn/1_horn_3.wav",
          "horn/1_horn_4.wav",
          "horn/1_horn_3.wav",
          "horn/1_horn_2.wav"
        ],
        harp : [
          "harp/1_harp_1.wav",
          "harp/1_harp_2.wav",
          "harp/1_harp_3.wav",
          "harp/1_harp_4.wav",
          "harp/1_harp_5.wav",
          "harp/1_harp_6.wav"
        ],
        metallo : [
          "metallo/1_metallo_1.wav",
          "metallo/1_metallo_2.wav",
          "metallo/1_metallo_3.wav",
          "metallo/1_metallo_4.wav",
          "metallo/1_metallo_5.wav",
          "metallo/1_metallo_6.wav"
        ],
        pizzi : [
          "pizzi/1_pizzi_1.wav",
          "pizzi/1_pizzi_2.wav",
          "pizzi/1_pizzi_3.wav",
          "pizzi/1_pizzi_4.wav",
          "pizzi/1_pizzi_5.wav",
          "pizzi/1_pizzi_6.wav"
        ],
        sitar : [
          "sitar/1_sitar_1.wav",
          "sitar/1_sitar_2.wav",
          "sitar/1_sitar_3.wav",
          "sitar/1_sitar_4.wav",
          "sitar/1_sitar_5.wav",
          "sitar/1_sitar_6.wav"
        ],
        trumpet : [
          "trumpet/1_trumpet_1.wav",
          "trumpet/1_trumpet_2.wav",
          "trumpet/1_trumpet_3.wav",
          "trumpet/1_trumpet_4.wav",
          "trumpet/1_trumpet_5.wav",
          "trumpet/1_trumpet_6.wav"
        ],
        violin : [
          "violin/1_violin_1.wav",
          "violin/1_violin_2.wav",
          "violin/1_violin_3.wav",
          "violin/1_violin_4.wav",
          "violin/1_violin_5.wav",
          "violin/1_violin_6.wav"
        ],
        xylo : [
          "xylo/1_xylo_1.wav",
          "xylo/1_xylo_2.wav",
          "xylo/1_xylo_3.wav",
          "xylo/1_xylo_4.wav",
          "xylo/1_xylo_5.wav",
          "xylo/1_xylo_6.wav"
        ],
        metronome : [
          "theme.wav",
          "metronome/tic.m4a",
          "metronome/tac.m4a"
        ]
      },
      {
        bass : [
          "bass/2_bass_1.wav",
          "bass/2_bass_2.wav",
          "bass/2_bass_3.wav",
          "bass/2_bass_4.wav",
          "bass/2_bass_3.wav",
          "bass/2_bass_2.wav"
        ],
        cello : [
          "cello/2_cello_1.wav",
          "cello/2_cello_2.wav",
          "cello/2_cello_3.wav",
          "cello/2_cello_4.wav",
          "cello/2_cello_3.wav",
          "cello/2_cello_2.wav"
        ],
        horn : [
          "horn/2_horn_1.wav",
          "horn/2_horn_2.wav",
          "horn/2_horn_3.wav",
          "horn/2_horn_4.wav",
          "horn/2_horn_3.wav",
          "horn/2_horn_2.wav"
        ],
        harp : [
          "harp/2_harp_1.wav",
          "harp/2_harp_2.wav",
          "harp/2_harp_3.wav",
          "harp/2_harp_4.wav",
          "harp/2_harp_5.wav",
          "harp/2_harp_6.wav"
        ],
        metallo : [
          "metallo/2_metallo_1.wav",
          "metallo/2_metallo_2.wav",
          "metallo/2_metallo_3.wav",
          "metallo/2_metallo_4.wav",
          "metallo/2_metallo_5.wav",
          "metallo/2_metallo_6.wav"
        ],
        pizzi : [
          "pizzi/2_pizzi_1.wav",
          "pizzi/2_pizzi_2.wav",
          "pizzi/2_pizzi_3.wav",
          "pizzi/2_pizzi_4.wav",
          "pizzi/2_pizzi_5.wav",
          "pizzi/2_pizzi_6.wav"
        ],
        sitar : [
          "sitar/2_sitar_1.wav",
          "sitar/2_sitar_2.wav",
          "sitar/2_sitar_3.wav",
          "sitar/2_sitar_4.wav",
          "sitar/2_sitar_5.wav",
          "sitar/2_sitar_6.wav"
        ],
        trumpet : [
          "trumpet/2_trumpet_1.wav",
          "trumpet/2_trumpet_2.wav",
          "trumpet/2_trumpet_3.wav",
          "trumpet/2_trumpet_4.wav",
          "trumpet/2_trumpet_5.wav",
          "trumpet/2_trumpet_6.wav"
        ],
        violin : [
          "violin/2_violin_1.wav",
          "violin/2_violin_2.wav",
          "violin/2_violin_3.wav",
          "violin/2_violin_4.wav",
          "violin/2_violin_5.wav",
          "violin/2_violin_6.wav"
        ],
        xylo : [
          "xylo/2_xylo_1.wav",
          "xylo/2_xylo_2.wav",
          "xylo/2_xylo_3.wav",
          "xylo/2_xylo_4.wav",
          "xylo/2_xylo_5.wav",
          "xylo/2_xylo_6.wav"
        ]
      },
      {
        bass : [
          "bass/3_bass_1.wav",
          "bass/3_bass_2.wav",
          "bass/3_bass_3.wav",
          "bass/3_bass_4.wav",
          "bass/3_bass_3.wav",
          "bass/3_bass_2.wav"
        ],
        cello : [
          "cello/3_cello_1.wav",
          "cello/3_cello_2.wav",
          "cello/3_cello_3.wav",
          "cello/3_cello_4.wav",
          "cello/3_cello_3.wav",
          "cello/3_cello_2.wav"
        ],
        horn : [
          "horn/3_horn_1.wav",
          "horn/3_horn_2.wav",
          "horn/3_horn_3.wav",
          "horn/3_horn_4.wav",
          "horn/3_horn_3.wav",
          "horn/3_horn_2.wav"
        ],
        harp : [
          "harp/3_harp_1.wav",
          "harp/3_harp_2.wav",
          "harp/3_harp_3.wav",
          "harp/3_harp_4.wav",
          "harp/3_harp_5.wav",
          "harp/3_harp_6.wav"
        ],
        metallo : [
          "metallo/3_metallo_1.wav",
          "metallo/3_metallo_2.wav",
          "metallo/3_metallo_3.wav",
          "metallo/3_metallo_4.wav",
          "metallo/3_metallo_5.wav",
          "metallo/3_metallo_6.wav"
        ],
        pizzi : [
          "pizzi/3_pizzi_1.wav",
          "pizzi/3_pizzi_2.wav",
          "pizzi/3_pizzi_3.wav",
          "pizzi/3_pizzi_4.wav",
          "pizzi/3_pizzi_5.wav",
          "pizzi/3_pizzi_6.wav"
        ],
        sitar : [
          "sitar/3_sitar_1.wav",
          "sitar/3_sitar_2.wav",
          "sitar/3_sitar_3.wav",
          "sitar/3_sitar_4.wav",
          "sitar/3_sitar_5.wav",
          "sitar/3_sitar_6.wav"
        ],
        trumpet : [
          "trumpet/3_trumpet_1.wav",
          "trumpet/3_trumpet_2.wav",
          "trumpet/3_trumpet_3.wav",
          "trumpet/3_trumpet_4.wav",
          "trumpet/3_trumpet_5.wav",
          "trumpet/3_trumpet_6.wav"
        ],
        violin : [
          "violin/3_violin_1.wav",
          "violin/3_violin_2.wav",
          "violin/3_violin_3.wav",
          "violin/3_violin_4.wav",
          "violin/3_violin_5.wav",
          "violin/3_violin_6.wav"
        ],
        xylo : [
          "xylo/3_xylo_1.wav",
          "xylo/3_xylo_2.wav",
          "xylo/3_xylo_3.wav",
          "xylo/3_xylo_4.wav",
          "xylo/3_xylo_5.wav",
          "xylo/3_xylo_6.wav"
        ]
      },
      {
        bass : [
          "bass/4_bass_1.wav",
          "bass/4_bass_2.wav",
          "bass/4_bass_3.wav",
          "bass/4_bass_4.wav",
          "bass/4_bass_3.wav",
          "bass/4_bass_2.wav"
        ],
        cello : [
          "cello/4_cello_1.wav",
          "cello/4_cello_2.wav",
          "cello/4_cello_3.wav",
          "cello/4_cello_4.wav",
          "cello/4_cello_3.wav",
          "cello/4_cello_2.wav"
        ],
        horn : [
          "horn/4_horn_1.wav",
          "horn/4_horn_2.wav",
          "horn/4_horn_3.wav",
          "horn/4_horn_4.wav",
          "horn/4_horn_3.wav",
          "horn/4_horn_2.wav"
        ],
        harp : [
          "harp/4_harp_1.wav",
          "harp/4_harp_2.wav",
          "harp/4_harp_3.wav",
          "harp/4_harp_4.wav",
          "harp/4_harp_5.wav",
          "harp/4_harp_6.wav"
        ],
        metallo : [
          "metallo/4_metallo_1.wav",
          "metallo/4_metallo_2.wav",
          "metallo/4_metallo_3.wav",
          "metallo/4_metallo_4.wav",
          "metallo/4_metallo_5.wav",
          "metallo/4_metallo_6.wav"
        ],
        pizzi : [
          "pizzi/4_pizzi_1.wav",
          "pizzi/4_pizzi_2.wav",
          "pizzi/4_pizzi_3.wav",
          "pizzi/4_pizzi_4.wav",
          "pizzi/4_pizzi_5.wav",
          "pizzi/4_pizzi_6.wav"
        ],
        sitar : [
          "sitar/4_sitar_1.wav",
          "sitar/4_sitar_2.wav",
          "sitar/4_sitar_3.wav",
          "sitar/4_sitar_4.wav",
          "sitar/4_sitar_5.wav",
          "sitar/4_sitar_6.wav"
        ],
        trumpet : [
          "trumpet/4_trumpet_1.wav",
          "trumpet/4_trumpet_2.wav",
          "trumpet/4_trumpet_3.wav",
          "trumpet/4_trumpet_4.wav",
          "trumpet/4_trumpet_5.wav",
          "trumpet/4_trumpet_6.wav"
        ],
        violin : [
          "violin/4_violin_1.wav",
          "violin/4_violin_2.wav",
          "violin/4_violin_3.wav",
          "violin/4_violin_4.wav",
          "violin/4_violin_5.wav",
          "violin/4_violin_6.wav"
        ],
        xylo : [
          "xylo/4_xylo_1.wav",
          "xylo/4_xylo_2.wav",
          "xylo/4_xylo_3.wav",
          "xylo/4_xylo_4.wav",
          "xylo/4_xylo_5.wav",
          "xylo/4_xylo_6.wav"
        ]
      },
    ]

    this._playing = {
      bass: {},
      cello: {},
      horn:{},
      harp: {},
      metallo: {},
      pizzi: {},
      sitar: {},
      trumpet: {},
      violin: {},
      xylo: {}
    }

    this._range = this._sounds[0]["cello"].length

    this._toPlay = new Pizzicato.Group()

    this._movInterval = movInterval
    this._playInterval = playInterval

    this._now = Date.now()
    this._lastTime = Date.now()

    this._structureIndex = 0

    this._metronomeState = 0

    // Movement structure
    this._structure = [0, 1, 2, 3]
  }

  loadSound (callback) {

    // Count number of sound to be loaded
    for (const movement of this._sounds) {
      for (const instr in movement) {
        for (const input in movement[instr]) {
          this._ctx._loading.total++
          this._metronomeState = 3
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
            callback()
          })
        }
      }
    }

  }

  init () {
    this._sounds[0]["metronome"][0].volume = 0
    this._sounds[0]["metronome"][0].play()
  }

  addSound (instr, note) {
    this._playing[instr][note] = true
  }

  loop () {
    if (this._ctx._loaded) {
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
      if (this._ctx._playerPlayed) {
        this._ctx._player.removeEnergy(1)
        this._ctx._playerPlayed = false
      }
      // Copy and reset playing object
      const playing = {...this._playing}
      //console.log(this._playing)
      this._playing = {
        bass: {},
        cello: {},
        horn:{},
        harp: {},
        metallo: {},
        pizzi: {},
        sitar: {},
        trumpet: {},
        violin: {},
        xylo: {}
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

      // Playing sound group & deal with chrome autoplay policy
      if (!this._toPlay.play()) {
        document.addEventListener("keyup", () => {
          Pizzicato.context.resume().then(() => {
            this._toPlay.play()
          })
        }, {once: true})
      }

      // Unbuilding sound group
      for (const instr in this._playing) {
        for (let i = 0; i < this._range; i++) {
          if (playing[instr][i]) {
            this._toPlay.removeSound(this._sounds[this._structure[this._structureIndex]][instr][i])
          }
        }
      }

      // Old metronome
      // this._metronomeState = (this._metronomeState + 1) % 8
      // if ((this._metronomeState + 1) % 2) {
        //   const state = this._metronomeState / 2 ? 1 : 0
        //   this._sounds[0]["metronome"][state + 1].stop()
        //   this._sounds[0]["metronome"][state + 1].play()
        // }
      this._sounds[0]["metronome"][0].volume = 0.2
      if (!this._metronomeState) {
        this._sounds[0]["metronome"][0].stop()
        this._sounds[0]["metronome"][0].play()
      }
      this._metronomeState = (this._metronomeState + 1) % 64

    }
  }

}
