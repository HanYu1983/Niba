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
  // 背景
  const BACKGROUND = { type: "BACKGROUND" }
  // 拖字起點
  const DRAG_WORD_START_ENTITY = { type: "DRAG_WORD_START_ENTITY", word: "O", pos: [100, 100], hitRadius: 60, radius: 60 }
  // 拖移中的圖層
  const DRAG_WORD_LAYER = { type: "DRAG_WORD_LAYER" }
  // 拖字終點
  const DRAG_WORD_END_ENTITY = { type: "DRAG_WORD_END_ENTITY", pos: [50, 50], word: null, isSlot: false }
  // 計算拖字到終點的碰撞層
  const DRAG_WORD_HIT_LAYER = { type: "DRAG_WORD_HIT_LAYER" }
  // 成功組成字的特效層
  const DRAG_WORD_SUCCESS_EFFECT_LAYER = { type: "DRAG_WORD_SUCCESS_EFFECT_LAYER", words: 'かさぞうみつき', successWords: [[0, 1], [2, 3], [3, 4], [4, 5, 6], [5, 6]] }
  // 
  const DRAG_WORD_END_OFFSET = 100
  const DRAG_WORD_END_X = 60
  const DRAG_WORD_END_Y = 650
  const DRAG_WORD_START_Y = 1120

  spec.assert(spec.DRAG_WORD_START_ENTITY, DRAG_WORD_START_ENTITY)
  spec.assert(spec.DRAG_WORD_END_ENTITY, DRAG_WORD_END_ENTITY)

  function getPlayPageEntities() {
    return [
      { ...BACKGROUND },
      { ...DRAG_WORD_START_ENTITY, word: "さ", pos: [90, DRAG_WORD_START_Y] },
      { ...DRAG_WORD_START_ENTITY, word: "う", pos: [260, DRAG_WORD_START_Y] },
      { ...DRAG_WORD_START_ENTITY, word: "つ", pos: [440, DRAG_WORD_START_Y] },
      { ...DRAG_WORD_START_ENTITY, word: "き", pos: [628, DRAG_WORD_START_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 0 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 1 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 2 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 3 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 4 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 5 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 6 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_LAYER },
      { ...DRAG_WORD_HIT_LAYER },
    ]
  }

  let entities = []
  function removeEntity(entity) {
    entity.unsubscribe?.()
    entities = entities.filter(entity2 => entity != entity2)
  }
  function removeEntities() {
    for (const entity of entities) {
      entity.unsubscribe?.()
    }
    entities = []
  }
  function addEntity(entity) {
    setupEntity(entity)
    entities.push(entity)
  }
  function addEntites(_entities) {
    for (const entity of _entities) {
      addEntity(entity)
    }
  }
  function getEntities() {
    return entities
  }
  function getCurrentWords() {
    const ends = entities.filter(e => e.type == DRAG_WORD_END_ENTITY.type)
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
    const ends = entities.filter(e => e.type == DRAG_WORD_END_ENTITY.type)
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
    if (entity.hitRadius && entity.pos) {
      entity.subscriptions.push(view.onSetup.pipe(
        rxjs.switchMap(p => {
          return view.onMouseDown.pipe(
            rxjs.map(pos => [p, pos])
          )
        })
      ).subscribe(([p, [tx, ty]]) => {
        const p1 = p.createVector(tx, ty)
        const p2 = p.createVector(entity.pos[0], entity.pos[1])
        if (p1.dist(p2) < entity.hitRadius) {
          onEntityMouseDown.next(entity)
        }
      }))
    }
    if (entity.type == DRAG_WORD_START_ENTITY.type) {
      entity.onDrawP5 = function (p) {
        drawWord(p, { pos: this.pos, word: this.word })
      }
      entity.subscriptions.push(onEntityMouseDown.pipe(
        rxjs.filter(entity2 => entity == entity2),
        rxjs.tap(() => {
          onWordDragStart.next(entity)
        }),
        rxjs.exhaustMap(() => {
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
        if (dragObj) {
          return
        }
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
        drawWord(p, { pos: this.pos, scale: 0.8, word: this.word })
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
        if (p1.dist(p2) < dragWordStartEntity.hitRadius) {
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
          const img = view.getImage("assets/touhoku_01.jpg")
          const buffer = p.createGraphics(img.width, img.height)
          buffer.image(img, 0, 0, buffer.width, buffer.height, 0, 0, img.width, img.height, p.CONTAIN);
          this.buffer = buffer
          this.img = img
        }
        const img = this.img
        p.push()
        p.translate(img.width / 2, img.height / 2)

        p.texture(this.buffer)
        p.noStroke()
        p.plane(img.width, img.height)

        p.pop()
      }
    }
    if (entity.type == DRAG_WORD_SUCCESS_EFFECT_LAYER.type) {
      let changes = {}
      entity.onDrawP5 = function (p) {
        const wordEnds = getEntities().filter(e => e.type == DRAG_WORD_END_ENTITY.type)
        for (const i in wordEnds) {
          const wordEnd = wordEnds[i]
          const change = changes[i]
          drawWord(p, {
            pos: wordEnd.pos,
            word: wordEnd.word,
            scale: change?.scale || 0.8,
            isBright: change?.isBright || false
          })
        }
      }
      const showWordEffects = rxjs.from(entity.successWords).pipe(
        rxjs.concatMap(str => rxjs.from(str)),
        rxjs.concatMap(word => {
          return view.onSetup.pipe(
            rxjs.switchMap(p => {
              const totalDuration = 300
              const time1 = 250
              return view.onDraw.pipe(
                rxjs.takeUntil(rxjs.timer(totalDuration)),
                rxjs.scan((a, c) => a + c, 0),
                rxjs.map((delta) => {
                  if (delta < time1) {
                    const startTime = 0
                    const endTime = time1
                    const currentDuration = endTime - startTime
                    const currentDelta = delta - startTime
                    return {
                      idx: word,
                      scale: 0.8 + 0.5 * Easing.easeInSine(currentDelta / currentDuration),
                      isBright: true
                    }
                  }
                  const startTime = time1
                  const endTime = totalDuration
                  const currentDuration = endTime - startTime
                  const currentDelta = delta - startTime
                  return {
                    idx: word,
                    scale: 0.8 + 0.5 * Easing.easeInSine((currentDuration - currentDelta) / currentDuration),
                    isBright: false
                  }
                })
              )
            })
          )
        }),
      )
      const showAttackEffects = rxjs.from(["A", "B"]).pipe(
        rxjs.concatMap(word => rxjs.from(async function () {
          console.log(`showAttackEffects: ${word}`)
          await delay(100)
          return {
            scale: 1,
            isBright: false,
          }
        }()))
      )
      const animation = rxjs.concat(showWordEffects)
      entity.subscriptions.push(animation.subscribe(params => {
        const { idx, scale, isBright } = params
        changes[idx] = {
          ...changes[idx],
          scale, isBright
        }
      }, err => { }, () => {
        removeEntity(entity)
      }))
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
  // render helper
  const imagePool = {}
  function getWordAndBackgroundImage(p, word) {
    const ret = imagePool[word]
    if (ret) {
      return ret
    }
    const img = view.getImage("assets/circle_background_01.png")
    const buffer = p.createGraphics(img.width, img.height)
    buffer.image(img, 0, 0, buffer.width, buffer.height, 0, 0, img.width, img.height);
    buffer.textSize(buffer.height / 2)
    buffer.stroke(255)
    buffer.textAlign(p.CENTER)
    buffer.strokeWeight(10)
    buffer.text(word, buffer.width / 2 + 5, buffer.height - 40)
    imagePool[word] = buffer
    return buffer
  }

  function drawWord(p, params) {
    spec.assert(spec.WORD_ENTITY, params)
    if (params.word == null) {
      return
    }
    const { pos: [x, y], word, isBright } = params
    const scale = params.scale == null ? 1 : params.scale
    p.push()
    p.translate(x, y)
    const img1 = getWordAndBackgroundImage(p, word)
    p.texture(img1)
    p.noStroke()
    p.plane(img1.width * scale, img1.height * scale)
    if (isBright) {
      p.blendMode(p.ADD)
      const img2 = view.getImage("assets/circle_background_bright_01.png")
      p.texture(img2)
      p.plane(img2.width * scale, img2.height * scale)
    }
    p.pop()
  }

  function startGame() {
    addEntites(getPlayPageEntities())
    onWordDragStartEndHit.subscribe(() => {
      const wordEnds = getEntities().filter(e => e.type == DRAG_WORD_END_ENTITY.type)
      if (wordEnds.filter(i => i.word).length == 7) {
        addEntity({ ...DRAG_WORD_SUCCESS_EFFECT_LAYER })
      }
    })
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