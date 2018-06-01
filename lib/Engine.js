const Matter = require('matter-js')

class Engine
{
  constructor(borders)
  {
    this.world
    this.engine
    this.playerRadius = 10
    this.borders = borders
    this.setEngine()
  }

  setEngine()
  {
    this.world = Matter.World.create({
      gravity : {
        x: 0,
        y: 0,
        scale: 0,
      }
    })
    this.createBorders()
    this.matterEngine = Matter.Engine.create({
      world: this.world
    })
  }

  createBorders()
  {
    const world = this.world
    const pointMin = this.borders.pointMin
    const pointMax = this.borders.pointMax
    const thickness = this.borders.thickness

    const borderOptions = {
        isStatic: true
    }

    borderOptions.label = 'Border Up'
    Matter.World.addBody(world, Matter.Bodies.rectangle(
      (pointMin.x+pointMax.x)/2,
      pointMin.y-thickness/2,
      (pointMax.x-pointMin.x)+thickness*2,
      thickness,
      borderOptions
    ))

    borderOptions.label = 'Border Down'
    Matter.World.addBody(world, Matter.Bodies.rectangle(
      (pointMin.x+pointMax.x)/2,
      pointMax.y+thickness/2,
      (pointMax.x-pointMin.x)+thickness*2,
      thickness,
      borderOptions
    ))

    borderOptions.label = 'Border Right'
    Matter.World.addBody(world, Matter.Bodies.rectangle(
      pointMax.x+thickness/2,
      (pointMin.y+pointMax.y)/2,
      thickness,
      (pointMax.y-pointMin.y)+thickness*2,
      borderOptions
    ))

    borderOptions.label = 'Border Left'
    Matter.World.addBody(world, Matter.Bodies.rectangle(
      pointMin.x-thickness/2,
      (pointMin.y+pointMax.y)/2,
      thickness,
      (pointMax.y-pointMin.y)+thickness*2,
      borderOptions
    ))
  }

  addPlayer(playerId)
  {
    const playerOption = {
      label: `Player ${playerId}`
    }
    const engineObject = Matter.Bodies.circle(
      this.randomPos(this.borders).x,
      this.randomPos(this.borders).y,
      10, playerOption
    )
    Matter.World.addBody(this.world, engineObject)
    return engineObject
  }

  randomPos(borders)
  {
    const pos = {
      x: (this.borders.pointMin.x + this.playerRadius + 5) + Math.floor(Math.random()*(this.borders.pointMax.x - (this.borders.pointMin.x + this.playerRadius + 5))),
      y: (this.borders.pointMin.y + this.playerRadius + 5) + Math.floor(Math.random()*(this.borders.pointMax.y - (this.borders.pointMin.y + this.playerRadius + 5)))
    }
    return pos
  }
}

module.exports = Engine
