var app = app || {};
app.core = app.core || {};
(function (module) {
    const { spec, assert, valid } = window["js.spec"]
    const SPEC_PLAYER = spec.map("SPEC_PLAYER", {
        id: spec.int,
        handId: spec.int,
    })
    // const SPEC_PLAYERS = spec.and("SPEC_PLAYERS", spec.obj, x => {
    //     return Object.values(x).map(v => {
    //         return valid(SPEC_PLAYER, v)
    //     }).reduce((a, c) => a & c, true)
    // })
    const SPEC_PLAYERS = spec.collection("SPEC_PLAYERS", SPEC_PLAYER)

    const SPEC_APP = spec.map("SPEC_APP", {
        table: tool.card.SPEC_TABLE,
        players: SPEC_PLAYERS,
    })
    //
    const APP = {
        table: tool.card.TABLE,
        players: []
    }
    assert(SPEC_APP, APP)
    const PLAYER = {
        id: 0,
        handId: 0
    }
    assert(SPEC_PLAYER, PLAYER)
    //
    let app = APP
    function getApp() {
        return app
    }
    module.getApp = getApp

    function debugInit() {
        var playerId = 0
        var cardStackId = 0;
        var cardId = 0
        app = {
            ...APP,
            players: [{ ...PLAYER, id: playerId++, handId: cardStackId++ }],
            table: {
                cards: [{ ...tool.card.CARD, id: cardId++ }],
                cardStacks: [[0]]
            }
        }
        assert(SPEC_APP, app)
    }
    debugInit()

})(app.core)