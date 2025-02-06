function getAssetPath(path) {
  if (window.location.href.indexOf("index.html") != -1) {
    return window.location.href.replace("index.html", path)
  }
  return window.location.href + path
}
app.view = async function () {
  const onSetup = new rxjs.ReplaySubject
  const onDraw = new rxjs.Subject
  const onMouseMove = new rxjs.Subject
  const onMouseUp = new rxjs.Subject
  const onMouseDown = new rxjs.Subject
  const onMouseDrag = new rxjs.Subject

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
        // loadImage要放在preload，不然畫不出來
        [
          "assets/circle_background_01.png",
          "assets/circle_background_bright_01.png",
          "assets/background.png",
          "assets/touhoku_01.jpg"
        ].forEach(path => {
          imgs[path] = p.loadImage(getAssetPath(path));
        })
      }
      // p.windowResized = function(){
      //   const W = p.windowWidth
      //   const H = p.windowHeight
      //   p.resizeCanvas(W, H);
      //   p.camera(W / 2, H / 2, 800, W / 2, H / 2, 0)
      // }
      p.setup = function () {
        const W = 720
        const H = 1484
        // https://www.fontspace.com/category/opentype
        // https://fonts.google.com/noto/specimen/Noto+Sans+JP
        const font = p.loadFont(getAssetPath("assets/NotoSansJP-VariableFont_wght.ttf"))
        const canvas = p.createCanvas(W, H, p.WEBGL);
        // 先移動攝像機讓mouse座標和物件位置能對上
        // https://p5js.org/reference/p5/camera/
        p.camera(W / 2, H / 2, 800, W / 2, H / 2, 0)
        p.frameRate(60)
        p.ortho()
        p.textFont(font)
        p.textAlign(p.CENTER)
        // 一次性的就呼叫complete
        onSetup.next(p)
        onSetup.complete()

        // 放最後面設定
        canvas.style('width', '100%')
        canvas.style('height', '100%')
      }
      p.draw = function () {
        onDraw.next(p.deltaTime)
      }
      p.touchStarted = function () {
        if (p.touches.length == 0) {
          return
        }
        const touch = p.touches[0]
        onMouseDown.next([touch.x, touch.y])
      }
      p.touchEnded = function () {
        onMouseUp.next()
      }
      p.touchMoved = function () {
        if (p.touches.length == 0) {
          return
        }
        const touch = p.touches[0]
        onMouseMove.next([touch.x, touch.y])
      }
      p.mousePressed = function () {
        onMouseDown.next([p.mouseX, p.mouseY])
      }
      p.mouseReleased = function () {
        onMouseUp.next()
      }
      // 非drag時
      p.mouseMoved = function () {
        onMouseMove.next([p.mouseX, p.mouseY])
      }
      // drag時
      p.mouseDragged = function () {
        // mouseDragged事件只有在PC上才會有；行動裝置沒有
        // 所以統一把mouseDragged的事件當成mouseMoved，才能和touchMoved一致
        onMouseMove.next([p.mouseX, p.mouseY])
        // 不使用mouseDragged
        // onMouseDrag.next([p.mouseX, p.mouseY])
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
    // onMouseDrag,
    getImage
  }
}()