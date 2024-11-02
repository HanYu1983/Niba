
create = -> 
    id: ""
    robotId: ""
    components: []

const Robot = {
  create: create,
  ...((create() |> Object.keys |> Tool.createAttrs))
}

window.Robot = Robot