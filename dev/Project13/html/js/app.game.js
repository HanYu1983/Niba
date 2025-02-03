app.game = function () {
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
  const DRAG_WORD_START_ENTITY = { type: "DRAG_WORD_START_ENTITY", word: "O", pos: [100, 100], radius: 50 }
  const DRAG_WORD_LAYER = { type: "DRAG_WORD_LAYER" }
  const DRAG_WORD_END_ENTITY = { type: "DRAG_WORD_END_ENTITY", pos: [50, 50], word: "O" }
  let entities = [
    { ...DRAG_WORD_START_ENTITY, word: "か", pos: [100, 200] },
    { ...DRAG_WORD_START_ENTITY, word: "う", pos: [200, 200] },
    { ...DRAG_WORD_START_ENTITY, word: "み", pos: [300, 100] },
    { ...DRAG_WORD_START_ENTITY, word: "み", pos: [400, 100] },
    { ...DRAG_WORD_END_ENTITY, pos: [50, 50] },
    { ...DRAG_WORD_END_ENTITY, pos: [150, 50] },
    { ...DRAG_WORD_LAYER }
  ]
  function removeEntity(entity) {
    entity.unsubscribe?.()
    entities = entities.filter(entity2 => entity != entity2)
  }
  function addEntity(entity) {
    setupEntity(entity)
    entities.push(entity)
  }
  const onEntityMouseDown = new rxjs.Subject
  const onWordDragStart = new rxjs.Subject
  const onWordDrag = new rxjs.Subject
  const onWordDragEnd = new rxjs.Subject
  const onWordHitWordSlot = new rxjs.Subject
  function setupEntity(entity) {
    if (entity.radius && entity.pos) {
      entity.dragStartSubscription = app.view.onSetup.pipe(
        rxjs.switchMap(p => {
          return app.view.onMouseDown.pipe(
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
        const [x, y] = this.pos
        // p.fill('white');
        // p.circle(x, y, this.radius)
        // p.fill('yellow');
        // p.textSize(100);
        // p.text(this.word, x, y);
        p.push()
        p.translate(x, y)
        p.fill('white');
        p.box()
        p.fill('yellow');
        p.textSize(100);
        p.text(this.word, 0, 0);
        p.pop()
      }
      entity.draggingSubscription = onEntityMouseDown.pipe(
        rxjs.filter(entity2 => entity == entity2),
        rxjs.tap(() => {
          onWordDragStart.next(entity)
        }),
        rxjs.switchMap(() => {
          return app.view.onMouseDrag.pipe(
            rxjs.takeUntil(app.view.onMouseUp)
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
      entity.onWordEndSubscription = app.view.onMouseUp.subscribe(() => {
        if (dragObj) {
          onWordDragEnd.next(dragObj)
          removeEntity(dragObj)
          dragObj = null
        }
      })
    }
    if (entity.type == "DRAG_WORD_END_ENTITY") {
      entity.onDrawP5 = function (p) {
        const [x, y] = this.pos
        p.push()
        p.translate(x, y)
        p.fill('blue');
        p.box()
        p.fill('yellow');
        p.textSize(100);
        p.text(this.word, 0, 0);
        p.pop()
      }
      entity.onWordEndSubscription = app.view.onSetup.pipe(
        rxjs.switchMap(p => {
          return onWordDragEnd.pipe(
            rxjs.map(entity => [p, entity])
          )
        })
      ).subscribe(([p, wordEntity]) => {
        const p1 = p.createVector(entity.pos[0], entity.pos[1])
        const p2 = p.createVector(wordEntity.pos[0], wordEntity.pos[1])
        if (p1.dist(p2) < wordEntity.radius) {
          onWordHitWordSlot.next([wordEntity, entity])
        }
      })
    }
    entity.unsubscribe = function () {
      this.dragStartSubscription?.unsubscribe()
      this.draggingSubscription?.unsubscribe()
      this.onWordDragStartSubscription?.unsubscribe()
      this.onWordDragSubscription?.unsubscribe()
      this.onWordEndSubscription?.unsubscribe()
    }
  }
  entities.forEach(setupEntity)
  onWordHitWordSlot.subscribe(console.log)
  // render
  const onDrawP5 = app.view.onSetup.pipe(
    rxjs.switchMap(p => {
      return app.view.onDraw.pipe(
        rxjs.map(() => p)
      )
    })
  )
  onDrawP5.subscribe(p => {
    p.background(200)
    entities.forEach(entity => entity.onDrawP5?.(p))
  })

  return {
    checkWords,
    assertCheckWords,
    getEntities() {
      return entities
    }
  }
}()