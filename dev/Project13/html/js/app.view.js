app.view = async function () {
  const onSetup = new rxjs.ReplaySubject
  const onDraw = new rxjs.Subject
  const onMouseMove = new rxjs.Subject
  const onMouseUp = new rxjs.Subject
  const onMouseDown = new rxjs.Subject
  const onMouseDrag = new rxjs.Subject
  const W = 800
  const H = 600
  const imgs = {}
  function getImage(key) {
    if (imgs[key] == null) {
      throw new Error(`image not found: ${key}`)
    }
    return imgs[key]
  }
  function create(tagName) {
    new p5(p => {
      p.preload = function () {
        ["/assets/word_background.png"].forEach(path => {
          imgs[path] = p.loadImage(path);
        })
      }
      p.setup = function () {
        // https://www.fontspace.com/category/opentype
        // https://fonts.google.com/noto/specimen/Noto+Sans+JP
        const font = p.loadFont("/assets/NotoSansJP-VariableFont_wght.ttf")
        p.createCanvas(W, H, p.WEBGL)
        p.frameRate(60)
        p.textFont(font)
        p.textAlign(p.CENTER)
        p.ortho()
        onSetup.next(p)
      }
      p.draw = function () {
        onDraw.next()
      }
      p.touchStarted = function () {
        if (p.touches.length == 0) {
          return
        }
        const touch = p.touches[0]
        onMouseDown.next([touch.x - W / 2, touch.y - H / 2])
      }
      p.touchEnded = function () {
        onMouseUp.next()
      }
      p.touchMoved = function () {
        if (p.touches.length == 0) {
          return
        }
        const touch = p.touches[0]
        onMouseMove.next([touch.x - W / 2, touch.y - H / 2])
      }
      p.mousePressed = function () {
        onMouseDown.next([p.mouseX - W / 2, p.mouseY - H / 2])
      }
      p.mouseReleased = function () {
        onMouseUp.next()
      }
      // 非drag時
      p.mouseMoved = function () {
        onMouseMove.next([p.mouseX - W / 2, p.mouseY - H / 2])
      }
      // drag時
      p.mouseDragged = function () {
        onMouseDrag.next([p.mouseX - W / 2, p.mouseY - H / 2])
      }
    }, tagName)
  }
  return {
    create,
    onSetup,
    onDraw,
    onMouseMove,
    onMouseDown,
    onMouseUp,
    onMouseDrag,
    getImage
  }
}()