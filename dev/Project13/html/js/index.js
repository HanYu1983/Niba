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
// 這行不加就可以成功上傳tiktok playable ads
//main().catch(console.error)