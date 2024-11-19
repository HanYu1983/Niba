app = {}
const CUBE_SIZE = 50
const ROW = 10
const COL = 10

app.alg = (function () {
  function xy2cr([x, y]) {
    return [Math.floor(x / CUBE_SIZE), Math.floor(y / CUBE_SIZE)]
  }
  function cr2xy([c, r]) {
    const x = c * CUBE_SIZE + CUBE_SIZE / 2
    const y = r * CUBE_SIZE + CUBE_SIZE / 2
    return [x, y]
  }
  return {
    xy2cr, cr2xy
  }
})()

app.event = (function () {
  const { xy2cr } = app.alg

  const onMouseDown = rxjs.fromEvent(document, 'mousedown')
  const onMouseUp = rxjs.fromEvent(document, 'mouseup')
  const onMouseMove = new rxjs.Subject
  // https://www.thisdot.co/blog/how-to-implement-drag-and-drop-using-rxjs
  const onSwap = onMouseDown.pipe(
    rxjs.switchMap(() => onMouseMove.pipe(
      rxjs.map(xy2cr),
      rxjs.pairwise(),
      rxjs.filter(([[x, y], [x2, y2]]) => x != x2 || y != y2),
      rxjs.takeUntil(onMouseUp)
    ))
  )
  const onDragStateChange = new rxjs.Subject

  function createOnSwapAnim(f) {
    return onSwap.pipe(rxjs.concatMap(f))
  }
  return {
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onSwap,
    createOnSwapAnim,
    onDragStateChange
  }
})()

function createView() {

  const { cr2xy } = app.alg

  let viewers = []

  function addViewer(viewer) {
    viewers.push(viewer)
  }
  function removeViewer(viewer) {
    viewers = viewers.filter(v => v != viewer)
  }

  function createSwapViwer(v, from, to) {
    return {
      value: v,
      from: from,
      to: to,
      pos: from,
      draw: function (p) {
        this.pos[0] = this.pos[0] + (this.to[0] - this.pos[0]) / 2
        this.pos[1] = this.pos[1] + (this.to[1] - this.pos[1]) / 2
        const value = this.value
        const x = this.pos[0]
        const y = this.pos[1]
        p.circle(x, y, CUBE_SIZE)
        p.text(value, x, y)
      }
    }
  }

  function swapCube(model, fromCR, toCR) {
    return new Promise((res, rej) => {
      const v1 = createSwapViwer(model.getBoardValue(fromCR[0], fromCR[1]), cr2xy(fromCR), cr2xy(toCR))
      const v2 = createSwapViwer(model.getBoardValue(toCR[0], toCR[1]), cr2xy(toCR), cr2xy(fromCR))
      addViewer(v1)
      addViewer(v2)
      setTimeout(() => {
        removeViewer(v1)
        removeViewer(v2)
        res()
      }, 50)
    })
  }

  function eatCubes(model, crs) {
    return Promise.resolve()
  }

  function draw(p, model) {
    const board = model.getBoard()
    for (const row in board) {
      for (const col in board[row]) {
        const value = board[row][col]
        const [x, y] = cr2xy([col, row])
        p.circle(x, y, CUBE_SIZE)
        p.text(value, x, y)
      }
    }
    for (const viewer of viewers) {
      viewer.draw(p)
    }
  }
  function dropCubes(cubes) {
    return Promise.resolve()
  }
  return {
    draw,
    swapCube,
    eatCubes,
    dropCubes
  }
}

function createModel() {
  const { repeat, range } = R
  const board = [
    range(0, COL), range(0, COL), range(0, COL), range(0, COL), range(0, COL)
  ]
  function swapCube(fromCR, toCR) {
    const copy = board[fromCR[1]][fromCR[0]]
    board[fromCR[1]][fromCR[0]] = board[toCR[1]][toCR[0]]
    board[toCR[1]][toCR[0]] = copy
  }
  function getBoard() {
    return board
  }
  function getBoardValue(c, r) {
    return board[r][c]
  }
  function createEatCubes() {
    return []
  }
  function eatCubes(cubes) {

  }
  function createDropCubes() {
    return []
  }
  function dropCubes(cubes) {

  }
  return {
    getBoard,
    swapCube,
    getBoardValue,
    createDropCubes,
    createEatCubes,
    eatCubes,
    dropCubes
  }
}

function createController() {
  const view = createView()
  const model = createModel()

  function setDragState(v) {
    console.log("setDragState", v)
    app.event.onDragStateChange.next(v)
  }

  async function swapCube([fromCR, toCR]) {
    await view.swapCube(model, fromCR, toCR)
    model.swapCube(fromCR, toCR)
  }

  function onDragStart() {

  }

  let isEat = false
  function onDragEnd() {
    if (isEat != true) {
      isEat = true
      setDragState(false)
      const animWorker = (async function () {
        for (let i = 0; i < 10; ++i) {
          const eatCubes = model.createEatCubes()
          if (eatCubes.length == 0) {
            break
          }
          await view.eatCubes(eatCubes)
          model.eatCubes(eatCubes)
          const dropCubes = model.createDropCubes()
          await view.dropCubes(dropCubes)
        }
        setDragState(true)
        isEat = false
      })()
      animWorker.catch(alert)
    }
  }

  const onSwapAnim = app.event.onDragStateChange.pipe(
    rxjs.switchMap(enabled => {
      if (enabled != true) {
        return rxjs.of()
      }
      return app.event.createOnSwapAnim(pos => swapCube(pos))
    })
  )
  function onDraw(p) {
    app.event.onMouseMove.next([p.mouseX, p.mouseY])
    view.draw(p, model)
  }

  app.event.onMouseDown.subscribe(onDragStart)
  app.event.onMouseUp.subscribe(onDragEnd)
  onSwapAnim.subscribe()
  setDragState(true)

  return {
    onDraw
  }
}

(function () {
  const controller = createController()

  function createP5app(p) {
    new p5(p => {
      p.setup = function () {
        p.createCanvas(800, 600)
      }
      p.draw = function () {
        p.background(250, 180, 200)
        controller.onDraw(p)
      }

      p.touchStarted = function () {
        console.log("touchStarted")
      }
      p.touchEnded = function() {
        console.log("touchEnded")
      }
      p.touchMoved = function(){
        console.log(p.touches)
      }

      p.mousePressed = function () {
        console.log("mousePressed")
      }
      p.mouseReleased = function() {
        console.log("mouseReleased")
      }
      p.mouseMoved = function(){
        console.log("mouseMoved")
      }
      console.log(p)
    }, "canvas")
  }
  createP5app()
  return {}
})()

