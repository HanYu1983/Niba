const {map, filter} = R
const {assert} = window['js.spec']

const double = (x) -> 
    x*2

const a = do 
    [0 til 10] 
    |> map double, _
    |> map do
        (x)->
            x*x
        _

console.log a
assert(types.point, {x:0, y:0})

