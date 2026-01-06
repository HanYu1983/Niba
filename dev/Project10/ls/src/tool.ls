createGetter = (keys)->
  getter = (k) -> (self) ->
    self[k]
  obj = {}
  for _, k of keys  
    obj["get#{k[0].toUpperCase() + k.slice(1)}"] = getter(k)
  obj

createSetter = (keys)->
  setter = (k) -> (self, v)->
    ret = {...self}
    ret[k] = v
  obj = {}
  for _, k of keys
    obj["set#{k[0].toUpperCase() + k.slice(1)}"] = setter(k)
  obj

createAttrs = (keys)->
  {
    ...createGetter(keys),
    ...createSetter(keys)
  }

window.app.Tool = 
  createGetter: createGetter
  createSetter: createSetter
  createAttrs: createAttrs