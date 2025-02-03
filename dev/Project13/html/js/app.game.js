app.game = async function () {
  const view = await app.view
  const config = await app.config
  // helper
  function isPrepareForCheck(wordWantCheck) {
    return wordWantCheck.filter(i => i == null).length == 0
  }
  function checkWords(words, wordWantCheck) {
    const ret = []
    for (let i = 0; i < wordWantCheck.length; ++i) {
      const subWorkWantCheck = wordWantCheck.substr(i)
      const matchedWord = words.filter(word => subWorkWantCheck.startsWith(word))?.[0]
      if (matchedWord) {
        ret.push(matchedWord)
      }
    }
    return ret
  }
  function assertCheckWords(config) {
    const target = ['かさ', 'ぞう', 'うみ', 'みつき', 'つき']
    const result = checkWords(config.words, "かさぞうみつき")
    if (JSON.stringify(target) != JSON.stringify(result)) {
      throw new Error()
    }
  }
  // model
  const DRAG_WORD_START_ENTITY = { type: "DRAG_WORD_START_ENTITY", word: "O", pos: [100, 100], radius: 50 }
  const DRAG_WORD_LAYER = { type: "DRAG_WORD_LAYER" }
  const DRAG_WORD_END_ENTITY = { type: "DRAG_WORD_END_ENTITY", pos: [50, 50], word: "O", mask: false }
  const DRAG_WORD_HIT_LAYER = { type: "DRAG_WORD_HIT_LAYER" }
  const DRAG_WORD_END_OFFSET = 100
  let entities = [
    { ...DRAG_WORD_START_ENTITY, word: "か", pos: [100, 100] },
    { ...DRAG_WORD_START_ENTITY, word: "う", pos: [200, 100] },
    { ...DRAG_WORD_START_ENTITY, word: "み", pos: [300, 100] },
    { ...DRAG_WORD_START_ENTITY, word: "み", pos: [400, 100] },
    { ...DRAG_WORD_END_ENTITY, pos: [0 * DRAG_WORD_END_OFFSET, 0] },
    { ...DRAG_WORD_END_ENTITY, pos: [1 * DRAG_WORD_END_OFFSET, 0] },
    { ...DRAG_WORD_END_ENTITY, pos: [2 * DRAG_WORD_END_OFFSET, 0] },
    { ...DRAG_WORD_END_ENTITY, pos: [3 * DRAG_WORD_END_OFFSET, 0] },
    { ...DRAG_WORD_END_ENTITY, pos: [4 * DRAG_WORD_END_OFFSET, 0] },
    { ...DRAG_WORD_END_ENTITY, pos: [5 * DRAG_WORD_END_OFFSET, 0] },
    { ...DRAG_WORD_END_ENTITY, pos: [6 * DRAG_WORD_END_OFFSET, 0] },
    { ...DRAG_WORD_LAYER },
    { ...DRAG_WORD_HIT_LAYER }
  ]
  function removeEntity(entity) {
    entity.unsubscribe?.()
    entities = entities.filter(entity2 => entity != entity2)
  }
  function addEntity(entity) {
    setupEntity(entity)
    entities.push(entity)
  }
  function getEntities() {
    return entities
  }
  function getCurrentWords() {
    const ends = entities.filter(e => e.type == "DRAG_WORD_END_ENTITY")
    return ends.map(i => i.mask ? null : i.word)
  }

  let dragWordEnds = []
  function setDragWordEnds(words) {
    const ends = entities.filter(e => e.type == "DRAG_WORD_END_ENTITY")
    if (ends.length != 7) {
      throw new Error("ends.length must 7")
    }
    for (let i = 0; i < words.length; ++i) {
      Object.assign(ends[i], words[i])
    }
    dragWordEnds = words.map(i => i.word)
  }
  function getDragWordEnds() {
    return dragWordEnds
  }

  // controller
  const onEntityMouseDown = new rxjs.Subject
  const onWordDragStart = new rxjs.Subject
  const onWordDrag = new rxjs.Subject
  const onWordDragEnd = new rxjs.Subject
  const onWordDragStartEndHit = new rxjs.Subject
  function setupEntity(entity) {
    entity.subscriptions = entity.subscriptions || []
    if (entity.radius && entity.pos) {
      entity.dragStartSubscription = view.onSetup.pipe(
        rxjs.switchMap(p => {
          return view.onMouseDown.pipe(
            rxjs.map(pos => [p, pos])
          )
        })
      ).subscribe(([p, [tx, ty]]) => {
        const p1 = p.createVector(tx, ty)
        const p2 = p.createVector(entity.pos[0], entity.pos[1])
        if (p1.dist(p2) < entity.radius) {
          onEntityMouseDown.next(entity)
        }
      })
    }
    if (entity.type == "DRAG_WORD_START_ENTITY") {
      entity.onDrawP5 = function (p) {
        if (this.buffer == null) {
          const buffer = p.createGraphics(50, 50)
          const img = view.getImage("../assets/word_background.png")
          buffer.image(img, 0, 0, buffer.width, buffer.height, 0, 0, img.width, img.height, p.CONTAIN);
          buffer.textSize(25)
          buffer.stroke(255)
          buffer.strokeWeight(4)
          buffer.textAlign(p.CENTER)
          buffer.text(this.word, buffer.width / 2, buffer.height / 2)
          this.buffer = buffer
        }
        const [x, y] = this.pos
        p.push()
        p.translate(x, y)
        p.texture(this.buffer)
        p.noStroke()
        p.plane(100)
        p.pop()
      }
      entity.draggingSubscription = onEntityMouseDown.pipe(
        rxjs.filter(entity2 => entity == entity2),
        rxjs.tap(() => {
          onWordDragStart.next(entity)
        }),
        rxjs.switchMap(() => {
          return view.onMouseDrag.pipe(
            rxjs.takeUntil(view.onMouseUp)
          )
        })
      ).subscribe(pos => {
        onWordDrag.next([entity, pos])
      })
    }
    if (entity.type == "DRAG_WORD_LAYER") {
      let dragObj
      entity.onWordDragStartSubscription = onWordDragStart.subscribe(entity => {
        dragObj = {
          ...DRAG_WORD_START_ENTITY,
          word: entity.word,
          pos: [entity.pos[0], entity.pos[1]],
        }
        addEntity(dragObj)
      })
      entity.onWordDragSubscription = onWordDrag.subscribe(([_, pos]) => {
        if (dragObj) {
          dragObj.pos[0] = pos[0]
          dragObj.pos[1] = pos[1]
        }
      })
      entity.onWordEndSubscription = view.onMouseUp.subscribe(() => {
        if (dragObj) {
          onWordDragEnd.next(dragObj)
          removeEntity(dragObj)
          dragObj = null
        }
      })
    }
    if (entity.type == "DRAG_WORD_END_ENTITY") {
      entity.onDrawP5 = function (p) {
        if (this.buffer == null) {
          const buffer = p.createGraphics(50, 50)
          this.buffer = buffer
        }
        const [x, y] = this.pos
        p.push()
        p.translate(x, y)
        if (this.mask) {
          p.fill('gray');
          p.box()
        } else {
          const buffer = this.buffer
          const img = view.getImage("../assets/word_background.png")
          buffer.image(img, 0, 0, buffer.width, buffer.height, 0, 0, img.width, img.height, p.CONTAIN);
          buffer.textSize(25)
          buffer.stroke(255)
          buffer.strokeWeight(4)
          buffer.textAlign(p.CENTER);
          buffer.text(this.word, buffer.width / 2, buffer.height / 2)
          p.texture(this.buffer)
          p.noStroke()
          p.plane(100)
        }
        p.pop()
      }
      entity.onWordEndSubscription = view.onSetup.pipe(
        rxjs.switchMap(p => {
          return onWordDragEnd.pipe(
            rxjs.map(entity => [p, entity])
          )
        })
      ).subscribe(([p, dragWordStartEntity]) => {
        const p1 = p.createVector(entity.pos[0], entity.pos[1])
        const p2 = p.createVector(dragWordStartEntity.pos[0], dragWordStartEntity.pos[1])
        if (p1.dist(p2) < dragWordStartEntity.radius) {
          onWordDragStartEndHit.next([dragWordStartEntity, entity])
        }
      })
    }
    if (entity.type == "DRAG_WORD_HIT_LAYER") {
      onWordDragStartEndHit.subscribe(([start, end]) => {
        if (end.mask != true) {
          return
        }
        end.word = start.word
        end.mask = false
        const currentWord = getCurrentWords()
        if (isPrepareForCheck(currentWord)) {
          const wins = checkWords(config.words, currentWord.join(""))
          console.log(wins)
        }
      })
    }
    entity.unsubscribe = function () {
      this.dragStartSubscription?.unsubscribe()
      this.draggingSubscription?.unsubscribe()
      this.onWordDragStartSubscription?.unsubscribe()
      this.onWordDragSubscription?.unsubscribe()
      this.onWordEndSubscription?.unsubscribe()
      this.subscriptions.forEach(sub => sub.unsubscribe())
    }
  }
  // render
  const onDrawP5 = view.onSetup.pipe(
    rxjs.switchMap(p => {
      return view.onDraw.pipe(
        rxjs.map(() => p)
      )
    })
  )
  onDrawP5.subscribe(p => {
    p.background(200)
    getEntities().forEach(entity => entity.onDrawP5?.(p))
    p.text(`${p.mouseX}, ${p.mouseY}`, 0, 0)
  })
  function startGame() {
    getEntities().forEach(setupEntity)
    onWordDragStartEndHit.subscribe(console.log)
    setDragWordEnds([
      { word: "か" },
      { word: "さ", mask: true },
      { word: "ぞ" },
      { word: "う", mask: true },
      { word: "み" },
      { word: "つ", mask: true },
      { word: "き", mask: true }
    ])
  }
  return {
    checkWords,
    assertCheckWords,
    getEntities,
    startGame
  }
}()