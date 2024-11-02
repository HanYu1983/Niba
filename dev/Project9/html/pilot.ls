
create = -> 
    id: ""
    range: 0
    melee: 0
    
const Pilot = {
  create: create,
  ...((create() |> Object.keys |> Tool.createAttrs))
}

window.Pilot = Pilot