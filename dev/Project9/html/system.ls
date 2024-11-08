window.System = {
  updatePosition: (self)->
    return self if self.pos == null || self.vel == null
    pos = self.pos |> glMatrix.vec3.clone |> glMatrix.vec3.add _, self.pos, self.vel
    {...self, pos}
}