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
  const { xy2cr } = app.alg

  const onMouseDownSub = new rxjs.Subject
  const onMouseUpSub = new rxjs.Subject
  const onMouseMoveSub = new rxjs.Subject
  // https://www.thisdot.co/blog/how-to-implement-drag-and-drop-using-rxjs
  const onSwapSub = onMouseDownSub.pipe(
    rxjs.switchMap(() => onMouseMoveSub.pipe(
      rxjs.map(xy2cr),
      rxjs.pairwise(),
      rxjs.filter(([[x, y], [x2, y2]]) => x != x2 || y != y2),
      rxjs.takeUntil(onMouseUpSub)
    ))
  )
  const onDragStateChangeSub = new rxjs.Subject

  function createOnSwapAnim(f) {
    return onSwapSub.pipe(rxjs.concatMap(f))
  }

  const view = createView()
  const model = createModel()

  function setDragState(v) {
    console.log("setDragState", v)
    onDragStateChangeSub.next(v)
  }

  async function swapCube([fromCR, toCR]) {
    await view.swapCube(model, fromCR, toCR)
    model.swapCube(fromCR, toCR)
  }

  async function doEatCubes() {
    setDragState(false)
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
  }

  function onDragStart() {

  }

  let isEat = false
  function onDragEnd() {
    if (isEat != true) {
      isEat = true
      doEatCubes().then(()=>{
        isEat = false
      }).catch(alert)
    }
  }
  const onSwapAnimSub = onDragStateChangeSub.pipe(
    rxjs.switchMap(enabled => {
      if (enabled != true) {
        return rxjs.of()
      }
      return createOnSwapAnim(pos => swapCube(pos))
    })
  )
  function onDraw(p) {
    p.background(250, 180, 200)
    view.draw(p, model)
  }
  function onMouseDown(x, y) {
    onMouseDownSub.next([x, y])
  }
  function onMouseUp(x, y) {
    onMouseUpSub.next([x, y])
  }
  function onMouseMove(x, y) {
    onMouseMoveSub.next([x, y])
  }
  onMouseDownSub.subscribe(onDragStart)
  onMouseUpSub.subscribe(onDragEnd)
  onSwapAnimSub.subscribe()
  setDragState(true)

  return {
    onDraw, onMouseDown, onMouseUp, onMouseMove
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
        controller.onDraw(p)
      }
      p.touchStarted = function () {
        if (p.touches.length == 0) {
          return
        }
        const touch = p.touches[0]
        controller.onMouseDown?.(touch.x, touch.y)
      }
      p.touchEnded = function () {
        if (p.touches.length == 0) {
          return
        }
        const touch = p.touches[0]
        controller.onMouseUp?.(touch.x, touch.y)
      }
      p.touchMoved = function () {
        if (p.touches.length == 0) {
          return
        }
        const touch = p.touches[0]
        controller.onMouseMove?.(touch.x, touch.y)
      }
      p.mousePressed = function () {
        controller.onMouseDown?.(p.mouseX, p.mouseY)
      }
      p.mouseReleased = function () {
        controller.onMouseUp?.(p.mouseX, p.mouseY)
      }
      // 非drag時
      p.mouseMoved = function () {
        controller.onMouseMove?.(p.mouseX, p.mouseY)
      }
      // drag時
      p.mouseDragged = function () {
        controller.onMouseMove?.(p.mouseX, p.mouseY)
      }
    }, "canvas")
  }
  createP5app()
  return {}
})()

