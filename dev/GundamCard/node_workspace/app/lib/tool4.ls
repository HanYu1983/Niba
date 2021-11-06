require! {
    ramda: {map, head, partial, _, filter}
}

const double = (x) ->
    x * 2;

const x = do
    [1 2 3] 
    |> map double _
    |> filter do
        (x)->
            x % 2 == 0
        _
    |> head

console.log x