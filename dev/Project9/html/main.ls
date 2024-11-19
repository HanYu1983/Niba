const {map, filter} = R

attack = (ctx, robot, pilot, targetRobot, targetPilot, weapon) ->
    atk = ctx |> getWeaponPower _, weapon
    def = getRobotDef ctx (robot |> Robot.getId)
    damage = atk - def
    makeDamage ctx robot damage

createPilotRobot = ->
    pilot2robot: {}

createGame = ->
    {
        ...createPilotRobot()
    }
console.log(createGame())

console.log(window)

startP5 = ->
    new p5 do 
        (p)->
            p.setup = ->
                p.createCanvas(710, 400, p.WEBGL);
                p.angleMode(p.DEGREES);
                #p.strokeWeight(5);
                #p.noFill();
                #p.stroke(32, 8, 64);

                p.normalMaterial();
                #p.ortho!
            p.draw = ->
                p.background 250 180 200
                p.orbitControl!
                for z in [0 to 180 by 30]
                    for x in [0 to 360 by 30]
                        p.push!
                        p.rotateZ z
                        p.rotateX x
                        p.translate 0 400 0
                        # p.ellipsoid(20, 40, 40);
                        p.box!
                        p.pop!
        "canvas"

startP5!