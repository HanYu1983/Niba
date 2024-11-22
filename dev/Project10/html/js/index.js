app = {}
const CUBE_SIZE = 50
const ROW = 10
const COL = 10

app.alg = (function () {
  function xy2cr([x, y]) {
    return [Math.floor(x / CUBE_SIZE), Math.floor(y / CUBE_SIZE)]
  }
  function cr2xy([c, r]) {
    const x = c * CUBE_SIZE //+ CUBE_SIZE / 2
    const y = r * CUBE_SIZE// + CUBE_SIZE / 2
    return [x, y]
  }
  return {
    xy2cr, cr2xy
  }
})()

function createView(p) {
  const { cr2xy, xy2cr } = app.alg
  const imgCubes = [
    p.loadImage('img/Drop/drop_d.png'),
    p.loadImage('img/Drop/drop_f.png'),
    p.loadImage('img/Drop/drop_h.png'),
    p.loadImage('img/Drop/drop_l.png'),
    p.loadImage('img/Drop/drop_t.png'),
    p.loadImage('img/Drop/drop_w.png'),
  ]
  function drawCube(value, x, y) {
    const img = imgCubes[value % imgCubes.length]
    p.image(img, x, y, CUBE_SIZE, CUBE_SIZE, 0, 0, img.width, img.height, p.COVER);
    // x = x + CUBE_SIZE / 2
    // y = y + CUBE_SIZE / 2
    // p.circle(x, y, CUBE_SIZE)
    // p.text(value, x, y)
  }

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
      draw: function () {
        this.pos[0] = this.pos[0] + (this.to[0] - this.pos[0]) / 2
        this.pos[1] = this.pos[1] + (this.to[1] - this.pos[1]) / 2
        const value = this.value
        const x = this.pos[0] + CUBE_SIZE / 2
        const y = this.pos[1] + CUBE_SIZE / 2
        p.circle(x, y, CUBE_SIZE)
        p.text(value, x, y)
      }
    }
  }

  function createSwapViwer2(v, from, to, duration, options) {
    const center = glMatrix.vec2.create()
    glMatrix.vec2.add(center, from, to)
    glMatrix.vec2.div(center, center, [2, 2])
    const centerToFrom = glMatrix.vec2.sub(glMatrix.vec2.create(), from, center)
    alpha = options?.alpha || 255
    return {
      value: v,
      from: from,
      to: to,
      pos: from,
      mat: glMatrix.mat2d.create(),
      vec: glMatrix.vec2.create(),
      center: center,
      centerToFrom: centerToFrom,
      time: 0,
      alpha: alpha,
      draw: function () {
        const deltaTime = p.deltaTime
        this.time += deltaTime

        // glMatrix.mat2d.identity(this.mat)
        // glMatrix.mat2d.translate(this.mat, this.mat, this.center)
        // glMatrix.mat2d.rotate(this.mat, this.mat, this.time * Math.PI / duration )
        // const nowPos = glMatrix.vec2.transformMat2d(this.vec, this.centerToFrom, this.mat)

        const pe = (deltaTime / duration)
        glMatrix.mat2d.fromRotation(this.mat, pe * Math.PI)
        this.centerToFrom = glMatrix.vec2.transformMat2d(this.centerToFrom, this.centerToFrom, this.mat)
        const nowPos = glMatrix.vec2.add(glMatrix.vec2.create(), this.center, this.centerToFrom)
        const value = this.value
        // tint(color, alpha)
        p.tint(255, this.alpha)
        drawCube(value, nowPos[0], nowPos[1])
        p.tint(255, 255)
      }
    }
  }

  function swapCube(model, fromCR, toCR) {
    return new Promise((res, rej) => {
      const duration = 150
      const v1 = createSwapViwer2(model.getBoardValue(fromCR[0], fromCR[1]), cr2xy(fromCR), cr2xy(toCR), duration, { alpha: 64 })
      const v2 = createSwapViwer2(model.getBoardValue(toCR[0], toCR[1]), cr2xy(toCR), cr2xy(fromCR), duration)
      addViewer(v1)
      addViewer(v2)
      setCubeHide(fromCR, true)
      setCubeHide(toCR, true)
      setTimeout(() => {
        removeViewer(v1)
        removeViewer(v2)
        setCubeHide(fromCR, false)
        setCubeHide(toCR, false)
        res()
      }, duration)
    })
  }

  function eatCubes(model, crs) {
    return Promise.resolve()
  }

  const _hideCubes = {}
  function setCubeHide(cr, value) {
    const key = `${cr[0]}_${cr[1]}`
    _hideCubes[key] = value
  }
  function isCubeHide(cr) {
    const key = `${cr[0]}_${cr[1]}`
    return _hideCubes[key]
  }

  let _dragCube = null
  function setDragCube(value, x, y) {
    _dragCube = {
      value, x, y
    }
  }
  function updateDragCube(x, y) {
    if (_dragCube == null) {
      return
    }
    _dragCube.x = x
    _dragCube.y = y
  }
  function deleteDragCube() {
    _dragCube = null
  }
  function isHitDragCubeCR(c, r) {
    if (_dragCube == null) {
      return false
    }
    const cr1 = xy2cr([_dragCube.x + CUBE_SIZE / 2, _dragCube.y + CUBE_SIZE / 2])
    const cr2 = [c, r]
    return cr1[0] == cr2[0] && cr1[1] == cr2[1]
  }
  //
  function getDragCube() {
    return _dragCube
  }
  function dropCubes(cubes) {
    return Promise.resolve()
  }
  function onDragStart(model, x, y) {
    const cr = xy2cr([x, y])
    const value = model.getBoardValue(cr[0], cr[1])
    setDragCube(value, x - CUBE_SIZE / 2, y - CUBE_SIZE / 2)
  }
  function onDrag(model, x, y) {
    updateDragCube(x - CUBE_SIZE / 2, y - CUBE_SIZE / 2)
  }
  function onDragEnd() {
    deleteDragCube()
  }
  function draw(model) {
    const board = model.getBoard()
    for (const row in board) {
      for (const col in board[row]) {
        if (isCubeHide([col, row])) {
          continue
        }
        const value = board[row][col]
        let [x, y] = cr2xy([col, row])
        const isHit = isHitDragCubeCR(col, row)
        if (isHit) {
          p.tint(255, 64)
        }
        drawCube(value, x, y)
        if (isHit) {
          p.tint(255, 255)
        }
      }
    }
    for (const viewer of viewers) {
      viewer.draw()
    }
    const dragCube = getDragCube()
    if (dragCube) {
      drawCube(dragCube.value, dragCube.x, dragCube.y)
    }
  }
  return {
    draw,
    swapCube,
    eatCubes,
    dropCubes,
    onDragStart, onDrag, onDragEnd
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

function createController(p) {
  const { xy2cr } = app.alg
  // 共用事件
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
  // 可否拖拉的狀態
  // ex. 結算吃掉方塊時設為false，結算完後設為true
  const onDragStateChangeSub = new rxjs.Subject
  function setDragState(v) {
    console.log("setDragState", v)
    onDragStateChangeSub.next(v)
  }

  const view = createView(p)
  const model = createModel()

  // 吃掉方塊
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

  // 拖拉結束後吃掉方塊
  {
    let isEat = false
    function onDragEnd() {
      if (isEat != true) {
        isEat = true
        doEatCubes().then(() => {
          isEat = false
        }).catch(alert)
      }
    }
    onMouseUpSub.subscribe(onDragEnd)
  }

  // 拖拉過程中交換方塊
  {
    const onSwapAnimSub = onDragStateChangeSub.pipe(
      rxjs.switchMap(enabled => {
        if (enabled != true) {
          return rxjs.of()
        }
        // 使用concatMap的動畫就會和model完全一致，但不即時 
        // return onSwapSub.pipe(rxjs.concatMap(async ([fromCR, toCR]) => {
        //   await view.swapCube(model, fromCR, toCR)
        //   model.swapCube(fromCR, toCR)
        // }))
        // 使用switchMap做動畫在過程中和model會不一致，但即時
        const animSub = onSwapSub.pipe(rxjs.switchMap(([fromCR, toCR]) => {
          return view.swapCube(model, fromCR, toCR)
        }))
        const tapSub = onSwapSub.pipe(rxjs.tap(([fromCR, toCR]) => {
          return model.swapCube(fromCR, toCR)
        }))
        return rxjs.merge(animSub, tapSub)
      })
    )
    onSwapAnimSub.subscribe()
  }

  // 拖拉時的被拖拉方塊的顯示
  {
    onDragStateChangeSub.pipe(
      rxjs.filter(v => v),
      rxjs.switchMap(() => {
        return rxjs.merge(
          onMouseDownSub.pipe(
            rxjs.tap(([x, y]) => {
              view.onDragStart(model, x, y)
            })
          ),
          onMouseMoveSub.pipe(
            rxjs.tap(([x, y]) => {
              view.onDrag(model, x, y)
            })
          )
        )
      })
    ).subscribe()
    onMouseUpSub.subscribe(() => {
      view.onDragEnd()
    })
  }
  function onDraw() {
    p.background(250, 180, 200)
    view.draw(model)
  }
  function onMouseDown(x, y) {
    onMouseDownSub.next([x, y])
  }
  function onMouseUp() {
    onMouseUpSub.next(true)
  }
  function onMouseMove(x, y) {
    onMouseMoveSub.next([x, y])
  }
  setDragState(true)
  return {
    onDraw, onMouseDown, onMouseUp, onMouseMove
  }
}

(function () {
  function createP5app() {
    new p5(p => {
      const controller = createController(p)
      p.setup = function () {
        p.createCanvas(800, 600)
        p.frameRate(60)
      }
      p.draw = function () {
        controller.onDraw()
      }
      p.touchStarted = function () {
        if (p.touches.length == 0) {
          return
        }
        const touch = p.touches[0]
        controller.onMouseDown?.(touch.x, touch.y)
      }
      p.touchEnded = function () {
        controller.onMouseUp?.()
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
        console.log("mouseReleased")
        controller.onMouseUp?.()
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

