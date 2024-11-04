
create = -> 
    id: ""
    pos: glMatrix.vec2.create()
    vec: glMatrix.vec2.create()

const Robot = {
  create: create,
  ...((create() |> Object.keys |> Tool.createAttrs))
}

window.Robot = Robot