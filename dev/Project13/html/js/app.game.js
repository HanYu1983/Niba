function delay(d) {
  return new Promise((res, rej) => {
    setTimeout(res, d)
  })
}

app.game = async function () {
  const view = await app.view
  const config = await app.config
  const spec = await app.spec
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
  const BACKGROUND = { type: "BACKGROUND" }
  const DRAG_WORD_START_ENTITY = { type: "DRAG_WORD_START_ENTITY", word: "O", pos: [100, 100], radius: 60 }
  const DRAG_WORD_LAYER = { type: "DRAG_WORD_LAYER" }
  const DRAG_WORD_END_ENTITY = { type: "DRAG_WORD_END_ENTITY", pos: [50, 50], word: null, isSlot: false }
  const DRAG_WORD_HIT_LAYER = { type: "DRAG_WORD_HIT_LAYER" }
  const DRAG_WORD_SUCCESS_EFFECT_LAYER = { type: "DRAG_WORD_SUCCESS_EFFECT_LAYER", words: 'かさぞうみつき', successWords: ['かさ', 'ぞう', 'うみ', 'みつき', 'つき'] }
  const DRAG_WORD_END_OFFSET = 100
  const DRAG_WORD_END_X = 60
  const DRAG_WORD_END_Y = 650
  const DRAG_WORD_START_Y = 1120

  spec.assert(spec.DRAG_WORD_START_ENTITY, DRAG_WORD_START_ENTITY)
  spec.assert(spec.DRAG_WORD_END_ENTITY, DRAG_WORD_END_ENTITY)

  let entities = [
    { ...BACKGROUND },
    { ...DRAG_WORD_START_ENTITY, word: "か", pos: [90, DRAG_WORD_START_Y] },
    { ...DRAG_WORD_START_ENTITY, word: "う", pos: [260, DRAG_WORD_START_Y] },
    { ...DRAG_WORD_START_ENTITY, word: "み", pos: [440, DRAG_WORD_START_Y] },
    { ...DRAG_WORD_START_ENTITY, word: "み", pos: [628, DRAG_WORD_START_Y] },
    { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 0 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
    { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 1 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
    { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 2 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
    { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 3 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
    { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 4 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
    { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 5 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
    { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 6 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
    { ...DRAG_WORD_LAYER },
    { ...DRAG_WORD_HIT_LAYER },
    { ...DRAG_WORD_SUCCESS_EFFECT_LAYER }
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
    return ends.map(i => i.word)
  }

  let dragWordEnds = []
  function setDragWordEnds(words) {
    spec.assert(
      spec.lib.spec.collection("setDragWordEndsArgs", spec.lib.spec.map("setDragWordEndsArg", {
        word: spec.lib.spec.nilable("word", spec.lib.spec.string),
        [spec.lib.symbol.optional]: {
          isSlot: spec.lib.spec.boolean
        }
      })),
      words
    )
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
      entity.subscriptions.push(view.onSetup.pipe(
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
      }))
    }
    if (entity.type == DRAG_WORD_START_ENTITY.type) {
      entity.onDrawP5 = function (p) {
        if (this.buffer == null) {
          const img = view.getImage("assets/word_background.png")
          const buffer = p.createGraphics(img.width, img.height)
          buffer.image(img, 0, 0, buffer.width, buffer.height, 0, 0, img.width, img.height, p.CONTAIN);
          buffer.textSize(buffer.height / 2)
          buffer.stroke(255)
          buffer.textAlign(p.CENTER)
          buffer.strokeWeight(10)
          buffer.text(this.word, buffer.width / 2 + 5, buffer.height - 40)
          this.buffer = buffer
        }
        const [x, y] = this.pos
        p.push()
        p.translate(x, y)
        p.texture(this.buffer)
        p.noStroke()
        p.plane(this.radius * 2)
        p.pop()
      }
      entity.subscriptions.push(onEntityMouseDown.pipe(
        rxjs.filter(entity2 => entity == entity2),
        rxjs.tap(() => {
          onWordDragStart.next(entity)
        }),
        rxjs.switchMap(() => {
          return view.onMouseMove.pipe(
            rxjs.takeUntil(view.onMouseUp)
          )
        })
      ).subscribe(pos => {
        onWordDrag.next([entity, pos])
      }))
    }
    if (entity.type == DRAG_WORD_LAYER.type) {
      let dragObj
      entity.subscriptions.push(onWordDragStart.subscribe(entity => {
        dragObj = {
          ...DRAG_WORD_START_ENTITY,
          word: entity.word,
          pos: [entity.pos[0], entity.pos[1]],
        }
        addEntity(dragObj)
      }))
      entity.subscriptions.push(onWordDrag.subscribe(([_, pos]) => {
        if (dragObj) {
          dragObj.pos[0] = pos[0]
          dragObj.pos[1] = pos[1]
        }
      }))
      entity.subscriptions.push(view.onMouseUp.subscribe(() => {
        if (dragObj) {
          onWordDragEnd.next(dragObj)
          removeEntity(dragObj)
          dragObj = null
        }
      }))
    }
    if (entity.type == DRAG_WORD_END_ENTITY.type) {
      entity.onDrawP5 = function (p) {
        if (this.buffer == null) {
          const img = view.getImage("assets/word_background.png")
          const buffer = p.createGraphics(img.width, img.height)
          this.img = img
          this.buffer = buffer
        }
        const [x, y] = this.pos
        p.push()
        p.translate(x, y)
        if (this.word == null) {

        } else {
          const buffer = this.buffer
          const img = this.img
          buffer.image(img, 0, 0, buffer.width, buffer.height, 0, 0, img.width, img.height, p.CONTAIN);
          buffer.textSize(buffer.height / 2)
          buffer.stroke(255)
          buffer.textAlign(p.CENTER)
          buffer.strokeWeight(10)
          buffer.text(this.word, buffer.width / 2 + 5, buffer.height - 40)
          p.texture(buffer)
          p.noStroke()
          p.plane(100)
        }
        p.pop()
      }
      entity.subscriptions.push(view.onSetup.pipe(
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
      }))
    }
    if (entity.type == DRAG_WORD_HIT_LAYER.type) {
      entity.subscriptions.push(onWordDragStartEndHit.subscribe(([start, end]) => {
        if (end.isSlot != true) {
          return
        }
        end.word = start.word
        const currentWord = getCurrentWords()
        if (isPrepareForCheck(currentWord)) {
          const wins = checkWords(config.words, currentWord.join(""))
          console.log(wins)
        }
      }))
    }
    if (entity.type == BACKGROUND.type) {
      entity.onDrawP5 = function (p) {
        if (this.buffer == null) {
          const img = view.getImage("assets/background.png")
          const buffer = p.createGraphics(img.width, img.height)
          buffer.image(img, 0, 0, buffer.width, buffer.height, 0, 0, img.width, img.height, p.CONTAIN);
          this.buffer = buffer
        }
        const img = view.getImage("assets/background.png")
        p.push()
        p.translate(img.width / 2, img.height / 2)

        p.texture(this.buffer)
        p.noStroke()
        p.plane(img.width, img.height)

        p.pop()
      }
    }
    if (entity.type == DRAG_WORD_SUCCESS_EFFECT_LAYER.type) {
      const showWordEffects = rxjs.from(entity.successWords).pipe(
        rxjs.concatMap(str => rxjs.from(str)),
        rxjs.concatMap(word => {
          return view.onSetup.pipe(
            rxjs.switchMap(p => {
              return view.onDraw.pipe(
                rxjs.takeUntil(rxjs.timer(200)),
                rxjs.scan((a, c) => a + c, 0),
                rxjs.map((delta) => {
                  // const tmp = getEntities().find(i => i.type == DRAG_WORD_END_ENTITY.type)
                  // tmp.pos[0] = 100 + 100 * (delta / 1000.0)
                  console.log(`showWordEffects: ${word} delta: ${delta}`)
                  return word
                })
              )
            })
          )
        }),
        // rxjs.concatMap(word => rxjs.from(async function () {
        //   console.log(`showWordEffects: ${word}`)
        //   await delay(100)
        //   return word
        // }()))
      )
      const showAttackEffects = rxjs.from(["A", "B"]).pipe(
        rxjs.concatMap(word => rxjs.from(async function () {
          console.log(`showAttackEffects: ${word}`)
          await delay(100)
          return word
        }()))
      )
      const animation = rxjs.concat(showWordEffects, showAttackEffects)
      entity.subscriptions.push(animation.subscribe())
    }
    entity.unsubscribe = function () {
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
    p.text(`${p.mouseX}, ${p.mouseY}`, p.mouseX, p.mouseY)
  })
  function startGame() {
    getEntities().forEach(setupEntity)
    onWordDragStartEndHit.subscribe(console.log)
    setDragWordEnds([
      { word: "か" },
      { word: null, isSlot: true },
      { word: "ぞ" },
      { word: null, isSlot: true },
      { word: "み" },
      { word: null, isSlot: true },
      { word: null, isSlot: true }
    ])
  }
  return {
    checkWords,
    assertCheckWords,
    getEntities,
    startGame
  }
}()