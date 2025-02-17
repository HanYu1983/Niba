async function main() {
  const config = await app.config
  const view = await app.view
  const game = await app.game
  const spec = await app.spec
  view.create("canvas")
  // game.assertCheckWords(config)
  // spec.assert(spec.config, config)
  game.startGame()
}

main().catch(console.error)