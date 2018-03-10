const Matter = require('matter-js')

class Engine
{
    constructor(borders)
    {
        this.world
        this.engine
        this.borders = borders
        this.loop
        this.setEngine()
        this.startEngine()
        return this
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
        this.engine = Matter.Engine.create({
            world: this.world
        })
    }

    startEngine()
    {
        this.loop = setInterval(() =>
        {
            Matter.Engine.update(this.engine, 1000 / 60);
        }, 1000 / 60)
    }

    stopEngine()
    {
        clearInterval(this.loop)
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
        const engineObject = Matter.Bodies.circle(50, 50, 10, playerOption)
        Matter.World.addBody(this.world, engineObject)
        console.log(Matter.Query.point(this.world.bodies, {x: 48, y: 48}))
        return engineObject
    }
}

module.exports = Engine