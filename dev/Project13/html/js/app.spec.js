app.spec = async function () {
  // https://github.com/prayerslayer/js.spec/blob/master/test/types/types-test.ts
  const lib = window['js.spec']
  const { spec, valid, explainStr, symbol } = lib
  const pos = spec.tuple("pos", spec.number, spec.number)
  const word = spec.string
  const nilableWord = spec.nilable("nilableWord", word)
  return {
    lib,
    config: spec.map("config", {
      words: spec.collection("words", word)
    }),
    WORD_ENTITY: spec.map("WORD_ENTITY", {
      pos: pos,
      word: nilableWord,
      [symbol.optional]: {
        scale: spec.number,
        isBright: spec.boolean,
        isDark: spec.boolean,
      }
    }),
    DRAG_WORD_START_ENTITY: spec.map("DRAG_WORD_START_ENTITY", {
      "type": obj => obj == "DRAG_WORD_START_ENTITY",
      idx: spec.number,
      pos: pos,
      word: word,
      radius: spec.number,
      hitRadius: spec.number,
      [symbol.optional]: {
        isHide: spec.boolean
      }
    }),
    DRAG_WORD_END_ENTITY: spec.map("DRAG_WORD_END_ENTITY", {
      "type": obj => obj == "DRAG_WORD_END_ENTITY",
      pos: pos,
      word: nilableWord,
      isSlot: spec.boolean
    }),
    DRAG_WORD_SUCCESS_EFFECT_LAYER: spec.map("DRAG_WORD_SUCCESS_EFFECT_LAYER", {
      "type": obj => obj == "DRAG_WORD_SUCCESS_EFFECT_LAYER",
      currentWord: spec.string,
      successWords: spec.collection("successWords", spec.collection("successWordsIdxAry", spec.number))
    }),
    assert: function (s, o) {
      if (valid(s, o)) {
        return
      }
      throw new Error(explainStr(s, o))
    }
  }
}()