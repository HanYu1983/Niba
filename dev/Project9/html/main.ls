const {map, filter} = R

const double = (x) -> 
    x*2

const a = do 
    [0 til 10] 
    |> map double, _
    |> map ((x)-> x*x), _

console.log a

console.log(Robot.create())
console.log(Pilot.create())


createPilotRobot = ->
    pilot2robot: {}

createGame = ->
    {
        ...createPilotRobot()
    }
console.log(createGame())

console.log(window)