{xy2rc} = app.Alg

onMouseDown = rxjs.fromEvent(document, 'mousedown')
onMouseUp = rxjs.fromEvent(document, 'mouseup')
onMouseMove = new rxjs.Subject

# https://www.thisdot.co/blog/how-to-implement-drag-and-drop-using-rxjs
onSwap = onMouseDown.pipe do
    rxjs.switchMap ->
        onMouseMove.pipe do
            rxjs.map xy2rc
            rxjs.pairwise!
            rxjs.filter ([a, b])-> a !== b
            rxjs.takeUntil onMouseUp

createOnSwapAnim = (f)->
  onSwap.pipe do
    rxjs.concatMap f

window.app.Event = 
  * onMouseDown: onMouseDown
    onMouseUp: onMouseUp
    onMouseMove: onMouseMove
    onSwap: onSwap
    createOnSwapAnim: createOnSwapAnim