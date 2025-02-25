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
  function assertCheckWords(config) {
    {
      const inputWord = "ななしゅうねん"
      const target = [[0, 1], [2, 3, 4], [5, 6]]
      const result = config.checkWordsAndGetIdxAryList(inputWord)
      console.log(result)
      result.forEach(idxAry => {
        const word = config.convertIdxAryToWord(inputWord, idxAry)
        const kanzi = config.lookupKanji(word)
        console.log(word, kanzi)
      })
      // if (JSON.stringify(target) != JSON.stringify(result)) {
      //   console.log(result, target)
      //   throw new Error()
      // }
    }
  }
  // model
  // 背景
  const BACKGROUND = { type: "BACKGROUND" }
  // 拖字起點
  const DRAG_WORD_START_ENTITY = { type: "DRAG_WORD_START_ENTITY", idx: 0, word: "O", pos: [100, 100], hitRadius: 60, radius: 60 }
  // 拖移中的圖層
  const DRAG_WORD_LAYER = { type: "DRAG_WORD_LAYER" }
  // 拖字終點
  const DRAG_WORD_END_ENTITY = { type: "DRAG_WORD_END_ENTITY", pos: [50, 50], word: null, isSlot: false }
  // 計算拖字到終點的碰撞層
  const DRAG_WORD_HIT_LAYER = { type: "DRAG_WORD_HIT_LAYER" }
  // 成功組成字的特效層
  const DRAG_WORD_SUCCESS_EFFECT_LAYER = { type: "DRAG_WORD_SUCCESS_EFFECT_LAYER", currentWord: "", successWords: [[0, 1], [2, 3], [3, 4], [4, 5, 6], [5, 6]] }
  //
  const TIMESUP_COUNTING_LAYER = { type: "TIMESUP_COUNTING_LAYER", timer: 0 }
  // 
  const TEXT_STARTER = { type: "TEXT_STARTER", scale: 1, pos: [350, 500] }
  // 
  const SCORE_LAYER = { type: "SCORE_LAYER" }
  //
  const NEWS_TICKER = { type: "NEWS_TICKER", text: "setDragWordEndsArgsetDragWordEndsArgsetDragWordEndsArg         setDragWordEndsArg", pos: [0, 100], speed: 200, size: [2400, 100] }
  const DRAG_WORD_END_X = 65
  const DRAG_WORD_END_Y = 845
  const DRAG_WORD_END_OFFSET = 99
  const DRAG_WORD_END_SCALE = 0.61
  const DRAG_WORD_START_Y = 1110

  spec.assert(spec.DRAG_WORD_START_ENTITY, DRAG_WORD_START_ENTITY)
  spec.assert(spec.DRAG_WORD_END_ENTITY, DRAG_WORD_END_ENTITY)
  spec.assert(spec.DRAG_WORD_SUCCESS_EFFECT_LAYER, DRAG_WORD_SUCCESS_EFFECT_LAYER)

  function getStartPageEntities() {
    return [
      { ...BACKGROUND },
      { ...TEXT_STARTER },
      { ...NEWS_TICKER }
    ]
  }

  function getPlayPageEntities() {
    return [
      { ...BACKGROUND },
      { ...DRAG_WORD_START_ENTITY, idx: 0, word: "な", pos: [105, DRAG_WORD_START_Y] },
      { ...DRAG_WORD_START_ENTITY, idx: 1, word: "し", pos: [275, DRAG_WORD_START_Y] },
      { ...DRAG_WORD_START_ENTITY, idx: 2, word: "ゅ", pos: [440, DRAG_WORD_START_Y] },
      { ...DRAG_WORD_START_ENTITY, idx: 3, word: "ね", pos: [615, DRAG_WORD_START_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 0 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 1 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 2 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 3 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 4 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 5 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_END_ENTITY, pos: [DRAG_WORD_END_X + 6 * DRAG_WORD_END_OFFSET, DRAG_WORD_END_Y] },
      { ...DRAG_WORD_LAYER },
      { ...DRAG_WORD_HIT_LAYER },
      //{ ...DRAG_WORD_SUCCESS_EFFECT_LAYER },
      { ...TIMESUP_COUNTING_LAYER }
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
  function swapEntites(_entities) {
    removeEntities()
    addEntites(_entities)
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
  function setStartDragWordEnds() {
    setDragWordEnds([
      { word: null, isSlot: true },
      { word: "な" },
      { word: null, isSlot: true },
      { word: null, isSlot: true },
      { word: "う" },
      { word: null, isSlot: true },
      { word: "ん" },
    ])
  }

  let nextWords = ["ん", "こ", "き", "そ"]
  function getNextWord() {
    if (hasNaxtWord() != true) {
      throw new Error(`no next word`)
    }
    return nextWords.shift()
  }
  function hasNaxtWord() {
    return nextWords.length > 0
  }
  //
  function setScorePopup() {
    getEntities().filter(i => i.type == DRAG_WORD_START_ENTITY.type).forEach(i => i.unsubscribe())
    getEntities().filter(i => i.type == TIMESUP_COUNTING_LAYER.type).forEach(i => i.unsubscribe())
    addEntity({ ...SCORE_LAYER })
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
        if (this.isHide) {
          return
        }
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
      entity.subscriptions.push(onWordDragStart.pipe(
        rxjs.filter(entity2 => entity == entity2)
      ).subscribe(() => {
        entity.isHide = true
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
          idx: entity.idx,
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
          removeEntity(dragObj)
          onWordDragEnd.next(dragObj)
          dragObj = null
        }
      }))
    }
    if (entity.type == DRAG_WORD_END_ENTITY.type) {
      entity.onDrawP5 = function (p) {
        drawWord(p, { pos: this.pos, scale: DRAG_WORD_END_SCALE, word: this.word })
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
        const isHit = p1.dist(p2) < dragWordStartEntity.hitRadius
        // 這裡會發出N次事件，N為DRAG_WORD_END_ENTITY的數量
        onWordDragStartEndHit.next([dragWordStartEntity, entity, isHit])
      }))
    }
    if (entity.type == DRAG_WORD_HIT_LAYER.type) {
      const onWordDragStartEndHitResult = onWordDragStartEndHit.pipe(
        // 先把所有發出的DRAG_WORD_END_ENTITY事件收集起來一起判斷
        rxjs.bufferCount(getEntities().filter(e => e.type == DRAG_WORD_END_ENTITY.type).length),
        rxjs.map(bufs => {
          const isHitOneOfEntity = bufs.find(([_, endEntity, isHit]) => isHit && endEntity.isSlot && endEntity.word == null)
          if (isHitOneOfEntity) {
            const [startEntity, endEntity] = isHitOneOfEntity
            spec.assert(spec.DRAG_WORD_START_ENTITY, startEntity)
            spec.assert(spec.DRAG_WORD_END_ENTITY, endEntity)
            return [startEntity, endEntity, true]
          }
          const [[startEntity]] = bufs
          spec.assert(spec.DRAG_WORD_START_ENTITY, startEntity)
          return [startEntity, null, false]
        })
      )
      entity.subscriptions.push(onWordDragStartEndHitResult.subscribe(([startEntity, endEntity, isHit]) => {
        const startWord = getEntities().find(e => e.type == DRAG_WORD_START_ENTITY.type && e.idx == startEntity.idx)
        if (startWord == null) {
          throw new Error(`startWord not found: ${startEntity.idx}`)
        }
        delete startWord.isHide
        if (isHit != true) {
          return
        }
        endEntity.word = startEntity.word
        startWord.word = getNextWord()
        const currentWord = getCurrentWords()
        if (isPrepareForCheck(currentWord)) {
          const wins = config.checkWordsAndGetIdxAryList(currentWord.join(""))
          if (wins.length) {
            const successEffectLayer = { ...DRAG_WORD_SUCCESS_EFFECT_LAYER, currentWord: currentWord, successWords: wins }
            addEntity(successEffectLayer)
          } else {
            setScorePopup()
          }
        }
      }))
    }
    if (entity.type == BACKGROUND.type) {
      entity.onDrawP5 = function (p) {
        if (this.buffer == null) {
          const img = view.getImage("assets/250207_kotodaman_background_01.png")
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
      if (entity.successWords == null || entity.successWords.length == 0) {
        console.warn(`successWords not found in entity: `, entity)
        return
      }
      let changes = {}
      let currentEffectWord = null
      let currentEffectOriginWord = null
      entity.onDrawP5 = function (p) {
        const wordEnds = getEntities().filter(e => e.type == DRAG_WORD_END_ENTITY.type)
        for (const i in wordEnds) {
          const wordEnd = wordEnds[i]
          const change = changes[i]
          drawWord(p, {
            pos: wordEnd.pos,
            word: wordEnd.word,
            scale: change?.scale || DRAG_WORD_END_SCALE,
            isBright: change?.isBright || false
          })
        }
        if (currentEffectWord) {
          p.push()
          p.translate(400, 300)
          drawGText(p, currentEffectWord, 600, 100, -20)
          p.pop()
        }
        if (currentEffectOriginWord) {
          p.push()
          p.translate(400, 400)
          drawGText(p, currentEffectOriginWord, 600, 100, -20)
          p.pop()
        }
      }
      const showWordEffects = rxjs.from(entity.successWords).pipe(
        rxjs.concatMap(idxAry => rxjs.from(idxAry.map(idx => {
          return { idx, idxAry }
        }))),
        rxjs.concatMap(({ idx, idxAry }) => {
          return view.onSetup.pipe(
            rxjs.switchMap(p => {
              const totalDuration = 300
              const time1 = 250
              const anim1 = view.onDraw.pipe(
                rxjs.takeUntil(rxjs.timer(totalDuration)),
                rxjs.scan((a, c) => a + c, 0),
                rxjs.map((delta) => {
                  if (delta < time1) {
                    const startTime = 0
                    const endTime = time1
                    const currentDuration = endTime - startTime
                    const currentDelta = delta - startTime
                    return {
                      idx: idx,
                      scale: DRAG_WORD_END_SCALE + 0.5 * Easing.easeInSine(currentDelta / currentDuration),
                      isBright: true,
                      idxAry: idxAry,
                    }
                  }
                  const startTime = time1
                  const endTime = totalDuration
                  const currentDuration = endTime - startTime
                  const currentDelta = delta - startTime
                  return {
                    idx: idx,
                    scale: DRAG_WORD_END_SCALE + 0.5 * Easing.easeInSine((currentDuration - currentDelta) / currentDuration),
                    isBright: false,
                    idxAry: idxAry,
                  }
                })
              )
              // revert
              const anim2 = rxjs.of({
                idx: idx,
                scale: DRAG_WORD_END_SCALE,
                isBright: false,
                idxAry: idxAry,
              })
              return rxjs.concat(anim1, anim2)
            }),
          )
        }),
      )
      // const showAttackEffects = rxjs.from(["A", "B"]).pipe(
      //   rxjs.concatMap(word => rxjs.from(async function () {
      //     console.log(`showAttackEffects: ${word}`)
      //     await delay(100)
      //     return {
      //       scale: 1,
      //       isBright: false,
      //     }
      //   }()))
      // )
      const onAnimation = rxjs.concat(
        showWordEffects.pipe(
          rxjs.tap(params => {
            const { idx, scale, isBright, idxAry } = params
            changes[idx] = {
              ...changes[idx],
              scale,
              isBright
            }
          }),
        )
      )
      const firstNullIdxAryForFilterCompare = rxjs.of({})
      const onCurrentEffectWordChange = rxjs.merge(firstNullIdxAryForFilterCompare, onAnimation).pipe(
        rxjs.bufferCount(2, 1),
        rxjs.filter(([a, b]) => JSON.stringify(a.idxAry) != JSON.stringify(b.idxAry)),
        rxjs.tap(([a, b]) => {
          const idxAry = b.idxAry
          if (idxAry == null) {
            return
          }
          const originWord = config.convertIdxAryToWord(entity.currentWord, idxAry)
          currentEffectOriginWord = originWord
          currentEffectWord = config.lookupKanji(originWord)
        })
      )

      entity.subscriptions.push(onAnimation.subscribe(_ => {
        // nothing to do
      }, err => { }, () => {
        removeEntity(entity)
        setScorePopup()
      }))
      entity.subscriptions.push(onCurrentEffectWordChange.subscribe())
    }
    if (entity.type == TIMESUP_COUNTING_LAYER.type) {
      const COUNT_DURATION = 30000
      entity.onDrawP5 = function (p) {
        p.push()
        p.translate(650, 240)
        const timerStr = ((COUNT_DURATION - this.timer) / 1000).toFixed(2) + ""
        drawGText(p, timerStr, 250, 60, -10)
        p.pop()
      }
      entity.subscriptions.push(view.onDraw.pipe(
        rxjs.takeUntil(rxjs.timer(COUNT_DURATION)),
        rxjs.scan((a, c) => a + c, 0)
      ).subscribe(
        delta => {
          entity.timer = delta
        },
        err => { },
        () => {
          entity.timer = COUNT_DURATION
        }
      ))
    }
    if (entity.type == TEXT_STARTER.type) {
      entity.onDrawP5 = function (p) {
        if (this.buffer == null) {
          const img = view.getImage("assets/kotoba-wo-tsukurou_01.png")
          const buffer = getBuffer(p, "kotoba-wo-tsukurou_01.png", img.width, img.height)
          buffer.image(img, 0, 0, buffer.width, buffer.height, 0, 0, img.width, img.height, p.CONTAIN)
          this.buffer = buffer
        }
        p.push()
        const [x, y] = this.pos
        p.translate(x, y)
        p.scale(this.scale)
        p.texture(this.buffer)
        p.noStroke()
        p.plane(this.buffer.width, this.buffer.height)
        p.pop()
      }
      entity.subscriptions.push(view.onDraw.pipe(
        rxjs.scan((a, c) => a + c, 0),
      ).subscribe(delta => {
        entity.scale = 1 + 0.1 * Math.sin(delta / 200.0)
      }))
      entity.subscriptions.push(view.onMouseUp.subscribe(() => {
        const tickers = getEntities().filter(i => i.type == NEWS_TICKER.type)
        swapEntites([...getPlayPageEntities(), ...tickers])
        setStartDragWordEnds()
      }))
    }
    if (entity.type == SCORE_LAYER.type) {
      entity.onDrawP5 = function (p) {
        p.push()
        p.fill(255)
        p.translate(500, 500)
        p.noStroke()
        p.plane(500, 500)
        drawGText(p, "SCORE: 0", 500, 100, -20)
        p.pop()
      }
    }

    if (entity.type == NEWS_TICKER.type) {
      entity.onDrawP5 = function (p) {
        let [x, y] = this.pos
        const [w, h] = this.size

        p.push()
        p.fill(0, 0, 0, h)
        p.translate(view.getWidth() / 2, y)
        p.noStroke()
        p.plane(view.getWidth(), h)
        p.pop()

        p.push()
        this.timer = (this.timer || 0) + p.deltaTime
        const offsetX = (this.timer / 1000.0) * this.speed
        x += offsetX
        x = x % (w * 2)
        const startX = view.getWidth() + w / 2
        p.translate(startX - x, y)
        drawGText(p, this.text, w, h, -20)
        p.pop()
        this.x = x
      }
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
    p.push()
    p.translate(p.mouseX, p.mouseY)
    drawGText(p, `${Math.round(p.mouseX)}, ${Math.round(p.mouseY)}`, 250, 50, -10)
    p.pop()
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
    buffer.strokeWeight(10)
    buffer.textAlign(p.CENTER)
    buffer.text(word, buffer.width / 2, buffer.height - 48)
    imagePool[word] = buffer
    return buffer
  }

  function getBuffer(p, key, w, h) {
    const finalKey = `${key}_${w}_${h}`
    const ret = imagePool[finalKey]
    if (ret) {
      return ret
    }
    const buffer = p.createGraphics(w, h)
    imagePool[finalKey] = buffer
    return buffer
  }

  function drawGText(p, text, w, h, yoffset) {
    const buffer = getBuffer(p, "score_text", w, h)
    buffer.clear()
    buffer.textSize(buffer.height)
    buffer.textAlign(p.LEFT)
    buffer.fill(0)
    buffer.text(text, 0, buffer.height + yoffset + 5)

    buffer.stroke(0)
    buffer.strokeWeight(5)
    buffer.fill(255)
    buffer.text(text, 0, buffer.height + yoffset)
    p.texture(buffer)
    p.noStroke()
    p.plane(w, h)
  }

  function drawWord(p, params) {
    spec.assert(spec.WORD_ENTITY, params)
    if (params.word == null) {
      return
    }
    const { pos: [x, y], word, isBright, isDark } = params
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
    if (isDark) {
      // p.fill(50, 50, 50, 255)
      // p.blendMode(p.SUBSTRACT)
      // p.plane(img1.width * scale, img1.height * scale)
    }
    p.pop()
  }

  function startGame() {
    assertCheckWords(config)
    addEntites(getStartPageEntities())
  }
  return {
    assertCheckWords,
    getEntities,
    startGame
  }
}()