app.spec = async function () {
  const { spec, valid, explainStr } = window['js.spec']
  return {
    config: spec.map("config", {
      words: spec.collection("words", spec.string)
    }),
    assert: function (s, o) {
      if (valid(s, o)) {
        return
      }
      throw new Error(explainStr(s, o))
    }
  }
}()