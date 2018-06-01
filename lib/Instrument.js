const instrumentsType = ["cello", "clarinet", "harp", "string", "string2"]

class Instrument
{
  constructor(maxX, maxY)
  {
    this.type = Math.floor(Math.random()*instrumentsType.length)
    this.x = Math.floor(Math.random()*maxX)
    this.y = Math.floor(Math.random()*maxY)
  }
}

module.exports = Instrument
