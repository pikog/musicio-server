//World
const world = Matter.World.create({
    gravity : {
        x: 0,
        y: 0,
        scale: 0,
    }
})

//World borders
const createBorders = (world, pointMin, pointMax, thickness) =>
{
    const borderOptions = {
        render: {
            fillStyle: '#67b576',
            lineWidth: 0.01,
            strokeStyle: '#000000'
        },
        isStatic: true,
    }
    borderOptions.label = 'Border Up'
    Matter.World.addBody(world, Matter.Bodies.rectangle((pointMin.x+pointMax.x)/2, pointMin.y-thickness/2, (pointMax.x-pointMin.x)+thickness*2, thickness, borderOptions))
    borderOptions.label = 'Border Down'
    Matter.World.addBody(world, Matter.Bodies.rectangle((pointMin.x+pointMax.x)/2, pointMax.y+thickness/2, (pointMax.x-pointMin.x)+thickness*2, thickness, borderOptions))
    borderOptions.label = 'Border Right'
    Matter.World.addBody(world, Matter.Bodies.rectangle(pointMax.x+thickness/2, (pointMin.y+pointMax.y)/2, thickness, (pointMax.y-pointMin.y)+thickness*2, borderOptions))
    borderOptions.label = 'Border Left'
    Matter.World.addBody(world, Matter.Bodies.rectangle(pointMin.x-thickness/2, (pointMin.y+pointMax.y)/2, thickness, (pointMax.y-pointMin.y)+thickness*2, borderOptions))
}

createBorders(world, {x:10, y:10}, {x:790, y:490}, 25)

// create an engine
const engine = Matter.Engine.create({
    world
})

// create a renderer
const render = Matter.Render.create({
    element: document.querySelector('.render'),
    engine,
    options: {
        width: 800,
        height: 500,
        showPositions: true,
        showVelocity: true,
        hasBounds: true
    }
})

// run the engine
Matter.Engine.run(engine)

// run the renderer
Matter.Render.run(render)

const test = () => 
{
    Matter.Body.translate(boxA, {x: 100, y: 0})
}

document.addEventListener('DOMContentLoaded', () =>
{
    MatterTools.Gui.create(engine, undefined, render)
})