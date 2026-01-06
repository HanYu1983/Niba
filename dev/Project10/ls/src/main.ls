{onSwap, onMouseMove, createOnSwapAnim} = app.Event


update = (ctx, evt)->
    console.log(evt)
    ctx

onSwapAnim = createOnSwapAnim((evt)-> rxjs.of(evt).pipe(rxjs.delay(10))).pipe do
    rxjs.map (rc)-> ["onSwapAnim", rc]

onModel = onSwapAnim.pipe(rxjs.scan(update, {}))

onModel.subscribe (evt)->
    console.log(evt)

startP5 = ->
    new p5 do 
        (p)->
            p.setup = ->
                p.createCanvas(800, 600, p.WEBGL)
            p.draw = ->
                onMouseMove.next [p.mouseX, p.mouseY]
                p.circle p.mouseX-400, p.mouseY-300, 50
        "canvas"

startP5!