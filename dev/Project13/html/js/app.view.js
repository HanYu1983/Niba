function getAssetPath(path) {
  return path
  // return `https://test-han-tmp-2.s3.ap-northeast-1.amazonaws.com/kotodaman/${path}`
  // if (window.location.href.indexOf("index.html") != -1) {
  //   return window.location.href.replace("index.html", path)
  // }
  // return window.location.href + path
}
app.view = async function () {
  // 同背景圖大小
  const CANVAS_W = 720
  const CANVAS_H = 1264
  const W = 1080
  const H = 1920
  function getWidth() { return W }
  function getHeight() { return H }

  function getScaleX() {
    return W / CANVAS_W
  }
  function getScaleY() {
    return H / CANVAS_H
  }

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
          "assets/250207_kotodaman_background_01.png",
          "assets/kotoba-wo-tsukurou_01.png",
          "assets/250226_kotodaman_material/mock-up_sample/01.png",
          "assets/250226_kotodaman_material/material/title_big_01.png",
          "assets/250226_kotodaman_material/material/title_small_01.png",
          "assets/250226_kotodaman_material/material/text_01.png",
          "assets/250226_kotodaman_material/material/text_02.png",
          "assets/250226_kotodaman_material/material/text_03.png",
          "assets/250226_kotodaman_material/material/text_04.png",
          "assets/250226_kotodaman_material/material/text_05.png",
          "assets/250226_kotodaman_material/material/text_06.png",
          "assets/250226_kotodaman_material/material/text_07.png",
          "assets/250226_kotodaman_material/material/tap_text_01.png",
          "assets/250226_kotodaman_material/material/release_icon_01.png",
          "assets/250226_kotodaman_material/material/finger_icon_01.png",
          "assets2/250303_kotodaman_material_02/material_compressed/background_x0,y0.png",
          "assets2/250303_kotodaman_material_02/material_compressed/text_drop_object_x-6,1081 px.png",
          "assets2/250303_kotodaman_material_02/material_compressed/title_big_x-73,y57.png",
          "assets2/250303_kotodaman_material_02/material_compressed/title_text_x11,y643.png",
          "assets2/250303_kotodaman_material_02/material_compressed/logo_small_effect_x164,y23.png",
          "assets2/250303_kotodaman_material_02/material_compressed/text_drug&drop_01_x26,y469.png",
          "assets2/250303_kotodaman_material_02/material_compressed/text_drug&drop_02_x24,y467.png",
          "assets2/250303_kotodaman_material_02/material_compressed/release_icon_x,y1095.png",
          "assets2/250303_kotodaman_material_02/material_compressed/dot_line_x408, y1157.png",
          "assets2/250303_kotodaman_material_02/material_compressed/finger_01_x,y.png",
          "assets2/250303_kotodaman_material_02/material_compressed/tap_game_start_x295,y1688.png",
          "assets2/250303_kotodaman_material_02/material_compressed/catch_icon_x430,y1487.png",
          "assets2/250303_kotodaman_material_02/material_compressed/ready_x11,y587.png",
          "assets2/250303_kotodaman_material_02/material_compressed/start_text_x16,y499.png",
        ].forEach(path => {
          console.log(`load: ${path}`)
          imgs[path] = p.loadImage(getAssetPath(path));
        })
      }
      p.windowResized = function () {
        // const canvas = this._canavs
        // canvas.style('width', `${p.windowWidth}px`)
        // canvas.style('height', `${p.windowHeight}px`)
      }
      p.setup = function () {

        // https://www.fontspace.com/category/opentype
        // https://fonts.google.com/noto/specimen/Noto+Sans+JP
        //const font = p.loadFont(getAssetPath("assets/NotoSansJP-VariableFont_wght.ttf"))
        const canvas = p.createCanvas(CANVAS_W, CANVAS_H, p.WEBGL);
        // 先移動攝像機讓mouse座標和物件位置能對上
        // https://p5js.org/reference/p5/camera/
        p.camera(CANVAS_W / 2, CANVAS_H / 2, 800, CANVAS_W / 2, CANVAS_H / 2, 0)
        p.frameRate(60)
        p.ortho()
        // ortho後才能設定width, height
        canvas.style('width', "100%")
        canvas.style('height', "100%")
        //p.textFont(font)
        p.textAlign(p.CENTER)
        // 一次性的就呼叫complete
        onSetup.next(p)
        onSetup.complete()
        // https://cssbud.com/css-generator/css-glow-generator/
        // https://stackoverflow.com/questions/40393497/text-outer-glow-effect-using-css
        let div = p.createDiv('<h3>p5*js</h3>');
        div.style("-webkit-text-stroke", "1px black")
        div.style("text-shadow", "#FC0 1px 0px 20px")
        div.style("font-size", 48)
        div.style("text-align", "center")
        div.style("color", "fff")
        div.style("background", "111")
        // https://cssgradient.io/blog/css-gradient-text/
        // div.style("background", "linear-gradient(red, blue)")
        // div.style("color", "transparent")
        // div.style("background-clip", "text")
        div.position(100, 100);

        // Convert the div to an image
        html2canvas(div.elt, { backgroundColor: null }).then(function (canvas) {
          let img = p.createImage(canvas.width, canvas.height);
          img.drawingContext.globalCompositeOperation = 'destination-over';
          img.drawingContext.drawImage(canvas, 0, 0);
          //p.image(img, 200, 200);
          imgs.glow = img
          div.remove()
        });

        // https://www.youtube.com/watch?v=iIWH3IUYHzM
        let img = p.createGraphics(200, 50)
        // img.colorMode(p.HSB, 360, 100, 100, 100)
        // img.rectMode(p.CENTER)
        //img.noFill()
        img.stroke(207, 7, 99)
        img.strokeWeight(3)
        img.fill(0)
        //img.background(230, 50, 15, 0)
        img.drawingContext.shadowBlur = 10
        img.drawingContext.shadowOffsetX = 0
        img.drawingContext.shadowOffsetY = 0
        img.drawingContext.shadowColor = p.color(255, 255, 0)
        // https://www.youtube.com/watch?v=-MUOweQ6wac
        // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasGradient/addColorStop
        // https://www.w3schools.com/graphics/canvas_gradients.asp
        const gradient = img.drawingContext.createLinearGradient(0, 0, 0, 50)
        gradient.addColorStop(0.5, p.color(0, 0, 255))
        gradient.addColorStop(0.8, p.color(0, 255, 0))
        img.drawingContext.fillStyle = gradient
        //img.drawingContext.strokeStyle = gradient
        //img.rect(480, 270, 300, 300, 30)
        img.textSize(25)
        img.textAlign(p.CENTER, p.CENTER)
        img.text("そなう,粗名雨", 100, 25)
        // img.text("Wow HA", 480, 270)
        //img.text("Wow HA", 480, 270)

        imgs.box = img
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
    getImage,
    getWidth, getHeight, getScaleX, getScaleY
  }
}()