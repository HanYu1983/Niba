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
  // 取代rxjs.timer, 讓時間的計算較為正確
  function createP5Timer(duration) {
    // return rxjs.timer(duration)
    return new rxjs.Observable(observable => {
      const onTimer = view.onDraw.pipe(
        rxjs.scan((a, c) => a + c, 0),
      )
      const subscriber = onTimer.subscribe(totalDelta => {
        if (totalDelta < duration) {
          return
        }
        observable.next(0)
        observable.complete()
        subscriber.unsubscribe()
        return 0
      })
      return () => {
        subscriber.unsubscribe()
      }
    });
  }
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
  // 這個的width設定大於1500後，手機就會畫成全黑，看不到文字
  // 1200就行
  const NEWS_TICKER = { type: "NEWS_TICKER", values: [{ text: "Section 1 Section 1 Section 1", width: 1200 }, { text: "Section 2", width: 500 }], pos: [0, 100], speed: 200, height: 100 }
  const DRAG_WORD_END_X = 65
  const DRAG_WORD_END_Y = 845
  const DRAG_WORD_END_OFFSET = 99
  const DRAG_WORD_END_SCALE = 0.61
  const DRAG_WORD_START_Y = 1110

  spec.assert(spec.DRAG_WORD_START_ENTITY, DRAG_WORD_START_ENTITY)
  spec.assert(spec.DRAG_WORD_END_ENTITY, DRAG_WORD_END_ENTITY)
  spec.assert(spec.DRAG_WORD_SUCCESS_EFFECT_LAYER, DRAG_WORD_SUCCESS_EFFECT_LAYER)
  spec.assert(spec.NEWS_TICKER, NEWS_TICKER)

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
  function removeEntities(filterF) {
    filterF = filterF || ((entity) => true)
    const willRemoved = entities.filter(filterF)
    for (const entity of willRemoved) {
      removeEntity(entity)
    }
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
  function swapEntites(_entities, filterF) {
    removeEntities(filterF)
    addEntites(_entities)
  }
  function oerderEntites(orderF) {
    entities.sort((a, b) => orderF(a) - orderF(b))
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

        p.push()

        const img = view.getImage("assets2/250303_kotodaman_material_02/material_compressed/background_x0,y0.png")
        //const img = view.getImage("assets/250207_kotodaman_background_01.png")
        p.translate(img.width / 2, img.height / 2)
        p.texture(img)
        p.noStroke()
        p.plane(img.width, img.height)
        p.pop()
        {
          p.push()
          const img = view.getImage("assets2/250303_kotodaman_material_02/material_compressed/text_drop_object_x-6,1081 px.png")
          const [x, y] = [-6 + img.width / 2, 1081 + img.height / 2]
          p.texture(img)
          p.translate(x, y)
          p.noStroke()
          p.plane(img.width, img.height)
          p.pop()
        }
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
                rxjs.takeUntil(createP5Timer(totalDuration)),
                rxjs.scan((a, c) => a + c, 0),
                rxjs.map((totalDelta) => {
                  if (totalDelta < time1) {
                    const startTime = 0
                    const endTime = time1
                    const currentDuration = endTime - startTime
                    const currentDelta = totalDelta - startTime
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
                  const currentDelta = totalDelta - startTime
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
        rxjs.takeUntil(createP5Timer(COUNT_DURATION)),
        rxjs.scan((a, c) => a + c, 0)
      ).subscribe(
        totalDelta => {
          entity.timer = totalDelta
        },
        err => { },
        () => {
          entity.timer = COUNT_DURATION
        }
      ))
    }
    if (entity.type == TEXT_STARTER.type) {
      const state1 = {
        id: "state1",
        img1: null,
        img2: null
      }
      const state2 = {
        id: "state2",
        img1: null,
        img2: null
      }
      const state3 = {
        id: "state3",
        img1: null,
        scale: 1
      }
      let currentState = null
      function setCurrentState(state) {
        currentState = state
      }
      const handState = {
        totalDelta: 0
      }
      let currentHandState = null
      function setCurrentHandState(state) {
        currentHandState = state
      }
      entity.onDrawP5 = function (p) {
        p.push()
        p.fill(0, 0, 0, 200)
        p.translate(view.getWidth() / 2, view.getHeight() / 2)
        p.noStroke()
        p.plane(view.getWidth(), view.getHeight())
        p.pop()

        if (currentState) {
          if (currentState.id == state1.id) {
            const img1 = view.getImage(currentState.img1)
            if (img1 == null) {
              throw new Error(`${currentState.id}.img1 not found`)
            }
            p.push()
            p.noStroke()
            let [x, y] = [0 + img1.width / 2, 57 + img1.height / 2]
            p.translate(x, y)
            p.texture(img1)
            p.plane(img1.width, img1.height)
            p.pop()

            p.push()
            const img2 = view.getImage(currentState.img2)
            if (img2 == null) {
              throw new Error(`${currentState.id}.img2 not found`)
            }
            x = 11 + img2.width / 2
            y = 643 + img2.height / 2
            p.translate(x, y)
            p.noStroke()
            p.texture(img2)
            p.plane(img2.width, img2.height)
            p.pop()
          }

          if (currentState.id == state2.id) {
            const img1 = view.getImage(currentState.img1)
            if (img1 == null) {
              throw new Error(`${currentState.id}.img1 not found`)
            }
            p.push()
            p.noStroke()
            let [x, y] = [164 + img1.width / 2, 23 + img1.height / 2]
            p.translate(x, y)
            p.texture(img1)
            p.plane(img1.width, img1.height)
            p.pop()

            const img2 = view.getImage(currentState.img2)
            if (img2 == null) {
              throw new Error(`${currentState.id}.img2 not found`)
            }
            p.push()
            p.noStroke()
            x = 26 + img2.width / 2
            y = 469 + img2.height / 2
            p.translate(x, y)
            p.texture(img2)
            p.plane(img2.width, img2.height)
            p.pop()
          }

          if (currentState.id == state3.id) {
            const img1 = view.getImage(currentState.img1)
            if (img1 == null) {
              throw new Error(`${currentState.id}.img1 not found`)
            }
            p.push()
            p.noStroke()
            let [x, y] = [11 + img1.width / 2, 587 + img1.height / 2]
            p.translate(x, y)
            p.texture(img1)
            p.scale(currentState.scale)
            p.plane(img1.width, img1.height)
            p.pop()
          }
        }

        if (currentHandState) {
          {
            const img = view.getImage("assets2/250303_kotodaman_material_02/material_compressed/tap_game_start_x295,y1688.png")
            p.push()
            p.noStroke()
            p.translate(295 + img.width / 2, 1688 + img.height / 2)
            p.texture(img)
            p.plane(img.width, img.height)
            p.pop()
          }
          {
            const img = view.getImage("assets2/250303_kotodaman_material_02/material_compressed/release_icon_x,y1095.png")
            p.push()
            p.noStroke()
            p.translate(525 + img.width / 2, 1095 + img.height / 2)
            p.texture(img)
            p.plane(img.width, img.height)
            p.pop()
          }
          {
            const img = view.getImage("assets2/250303_kotodaman_material_02/material_compressed/dot_line_x408, y1157.png")
            p.push()
            p.noStroke()
            p.translate(408 + img.width / 2, 1157 + img.height / 2)
            p.texture(img)
            p.plane(img.width, img.height)
            p.pop()
          }
          {
            const img = view.getImage("assets2/250303_kotodaman_material_02/material_compressed/catch_icon_x430,y1487.png")
            p.push()
            p.noStroke()
            p.translate(430 + img.width / 2, 1487 + img.height / 2)
            p.texture(img)
            p.plane(img.width, img.height)
            p.pop()
          }
          {
            const img = view.getImage("assets2/250303_kotodaman_material_02/material_compressed/finger_01_x,y.png")
            p.push()
            p.noStroke()
            const [cx, cy] = [(525 - 430) / 2, (1095 - 1487) / 2]
            p.translate(430 + cx + img.width / 2, 1487 + cy + img.height / 2)
            const xoffset = cx * Math.sin(currentHandState.totalDelta / 200.0)
            const yoffset = cy * Math.sin(currentHandState.totalDelta / 200.0)
            p.translate(xoffset, yoffset)
            p.texture(img)
            p.plane(img.width, img.height)
            p.pop()
          }
        }
      }
      const onAnimation = rxjs.concat(
        // onSetup之後才能使用preload的圖片
        view.onSetup,
        // 大標
        rxjs.of(0).pipe(
          rxjs.tap(() => {
            state1.img1 = "assets2/250303_kotodaman_material_02/material_compressed/title_big_x-73,y57.png"
            state1.img2 = "assets2/250303_kotodaman_material_02/material_compressed/title_text_x11,y643.png"
            setCurrentState(state1)
          })
        ),
        view.onDraw.pipe(
          rxjs.takeUntil(createP5Timer(1000)),
          rxjs.tap(delta => {
            handState.totalDelta += delta
            setCurrentHandState(handState)
          })
        ),
        rxjs.merge(
          rxjs.concat(
            // 小標&drag
            rxjs.of(0).pipe(
              rxjs.tap(() => {
                state2.img1 = "assets2/250303_kotodaman_material_02/material_compressed/logo_small_effect_x164,y23.png"
                state2.img2 = "assets2/250303_kotodaman_material_02/material_compressed/text_drug&drop_01_x26,y469.png"
                setCurrentState(state2)
              })
            ),
            createP5Timer(500),
            // drop
            rxjs.of(0).pipe(
              rxjs.tap(() => {
                state2.img2 = "assets2/250303_kotodaman_material_02/material_compressed/text_drug&drop_02_x24,y467.png"
              })
            ),
            createP5Timer(500),
          ),
          // 同時手移動
          view.onDraw.pipe(
            rxjs.takeUntil(createP5Timer(1000)),
            rxjs.tap(delta => {
              handState.totalDelta += delta
            })
          ),
        ),
        // ok?
        rxjs.of(0).pipe(
          rxjs.tap(() => {
            state3.img1 = "assets2/250303_kotodaman_material_02/material_compressed/ready_x11,y587.png"
            setCurrentState(state3)
            setCurrentHandState(null)
          })
        ),
        createP5Timer(500),
        // start
        rxjs.of(0).pipe(
          rxjs.tap(() => {
            state3.img1 = "assets2/250303_kotodaman_material_02/material_compressed/start_text_x16,y499.png"
          })
        ),
        // start縮放動畫
        view.onDraw.pipe(
          rxjs.takeUntil(createP5Timer(3000)),
          rxjs.scan((a, c) => a + c, 0),
          rxjs.tap(totalDelta => {
            state3.scale = 1 + 0.1 * Math.sin(totalDelta / 200.0)
          })
        ),
      )
      function startGame() {
        swapEntites(getPlayPageEntities(), entity => entity.type != NEWS_TICKER.type)
        oerderEntites(entity => {
          if (entity.type == NEWS_TICKER.type) {
            return 1
          }
          return 0
        })
        setStartDragWordEnds()
      }
      entity.subscriptions.push(onAnimation.subscribe(() => { }, err => { }, startGame))
      //entity.subscriptions.push(view.onMouseUp.subscribe(startGame))
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
      let currentWidth = 0
      let currentText = null
      entity.onDrawP5 = function (p) {
        let [x, y] = this.pos
        const h = this.height
        p.push()
        p.fill(0, 0, 0, h)
        p.translate(view.getWidth() / 2, y)
        p.noStroke()
        p.plane(view.getWidth(), h)
        p.pop()

        p.push()
        if (currentText) {
          p.translate(x, y)
          //p.plane(50, 50)
          p.translate(currentWidth / 2, 0)
          drawGText(p, currentText, currentWidth, h, -20)
        }
        p.pop()
      }
      const onAnimation = rxjs.from(entity.values).pipe(
        rxjs.concatMap(({ text, width }) => {
          const step1DurationSeconds = view.getWidth() / entity.speed
          const step2DurationSeconds = width / entity.speed
          return rxjs.concat(
            // 每段初始值
            rxjs.of(0).pipe(
              rxjs.tap(() => {
                entity.pos[0] = view.getWidth()
                currentText = text
                currentWidth = width
              })
            ),
            // 先移到x為0
            view.onDraw.pipe(
              rxjs.takeUntil(createP5Timer(step1DurationSeconds * 1000)),
              rxjs.tap(delta => {
                const offsetX = (delta * entity.speed / 1000.0)
                entity.pos[0] -= offsetX
              })
            ),
            // 停一段時間
            createP5Timer(2000),
            // 移動剩下的部分
            view.onDraw.pipe(
              rxjs.takeUntil(createP5Timer(step2DurationSeconds * 1000)),
              rxjs.tap(delta => {
                const offsetX = (delta * entity.speed / 1000.0)
                entity.pos[0] -= offsetX
              })
            ),
          )
        }),
        rxjs.repeat()
      )
      entity.subscriptions.push(onAnimation.subscribe())
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
    p.push()
    p.scale(1 / view.getScaleX(), 1 / view.getScaleY())
    p.background(200)

    getEntities().forEach(entity => entity.onDrawP5?.(p))
    p.push()
    p.translate(p.mouseX * view.getScaleX(), p.mouseY * view.getScaleY())
    drawGText(p, `${Math.round(p.mouseX * view.getScaleX())}, ${Math.round(p.mouseY * view.getScaleY())}`, 250, 50, -10)
    // p.texture(view.getImage("box"))
    // p.plane(500, 500)
    p.pop()

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
    // buffer.textFont(config.getFontStr())
    // buffer.textStyle(p.BOLD)
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
    const buffer = getBuffer(p, "text_key", w, h)
    // buffer.textFont(config.getFontStr())
    // buffer.textStyle(p.BOLD)

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
    // tmp
    p.translate(x * view.getScaleX(), y * view.getScaleY())
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