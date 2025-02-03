
async function loadConfig() {
  return {
    words: [
      "かさ", "ぞう", "うみ", "みつき", "つき"
    ]
  }
}
async function main() {
  const config = await loadConfig()
  app.game.assertCheckWords(config)
  app.spec.assert(app.spec.config, config)
  app.view.create("canvas")
  app.game.startGame()
}

main().catch(console.error)