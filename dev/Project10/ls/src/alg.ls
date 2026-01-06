CUBE_SIZE = 50
xy2rc = ([x,y]) -> [Math.floor(x / CUBE_SIZE), Math.floor(y / CUBE_SIZE)]

window.app.Alg =
  * CUBE_SIZE: CUBE_SIZE
    xy2rc: xy2rc
