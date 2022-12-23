var app = app || {};
app.core = app.core || {};
(function (module) {
    const { spec, assert } = window["js.spec"]
    const SPEC_PLAYER = spec.map("SPEC_PLAYER", {
        id: spec.string,
        handId: spec.number,
    })
    const SPEC_APP = spec.map("SPEC_APP", {
        table: tool.card.SPEC_TABLE,
        players: spec.collection("SPEC_PLAYERS", SPEC_PLAYER),
    })
    //
    const APP = {
        table: tool.card.TABLE,
        players: []
    }
    assert(SPEC_APP, APP)
    const PLAYER = {
        id: "",
        handId: 0
    }
    assert(SPEC_PLAYER, PLAYER)
    //
    let app = APP
    function getApp() {
        return app
    }
    module.getApp = getApp

    function addPlayer(app, player) {
        let table = app.table
        player = { ...player }
        player.handId = tool.card.getNextCardStackId(app.table)
        table = tool.card.addCardStack(table)
        return {
            ...app,
            players: app.players.concat([player]),
            table: table
        }
    }
    module.addPlayer = addPlayer

    function debugInit() {
        app = addPlayer(app, { ...PLAYER, id: "1" })
        let player1 = app.players.find(p => p.id == "1")
        app.table.cardStacks[player1.handId] = [{ ...tool.card.CARD, id: "1" }]
        assert(SPEC_APP, app)
    }
    debugInit()

    function test() {
        let app = { ...APP }
        let player1 = { ...PLAYER, id: "1" }
        app = addPlayer(app, player1)
        assert(SPEC_APP, app)
    }
    test()
})(app.core)