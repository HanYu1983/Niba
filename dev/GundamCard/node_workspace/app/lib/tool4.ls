require! {
    ramda:{map, head, partial, _, filter}
    "js.spec": {assert}
    "./types": types
}

assert types.point_list, [{x:0,y:0}]

const double = (x) ->
    x * 2;

const x = do
    [1 2 3] 
    |> map double, _
    |> filter do
        (x)->
            x % 2 == 0
        _
    |> head

console.log x