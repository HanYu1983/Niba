var app = app || {};
app.cardEffect = app.cardEffect || {};
(function (module) {
    const { spec, assert, valid, conform } = window["js.spec"]
    // const CARD_EFFECT_CAUSE_SYSTEM = 0;
    // const CARD_EFFECT_CAUSE_CARD = 1;
    // const SPEC_CARD_EFFECT_CAUSE = spec.map("SPEC_CARD_EFFECT_CAUSE")
    const SPEC_CARD_EFFECT_CAUSE_SYSTEM = spec.map("SPEC_CARD_EFFECT_REASON", {
        id: spec.predicate("id", x => x == "system"),
        responsePlayerId: spec.int,
    })
    const CARD_EFFECT_CAUSE_SYSTEM = {
        id: "system",
        responsePlayerId: 0
    }
    assert(SPEC_CARD_EFFECT_CAUSE_SYSTEM, CARD_EFFECT_CAUSE_SYSTEM)

    const SPEC_CARD_EFFECT_CAUSE_CARD = spec.map("SPEC_CARD_EFFECT_REASON", {
        id: spec.predicate("id", x => x == "card"),
        cardId: spec.int,
    })
    const CARD_EFFECT_CAUSE_CARD = {
        id: "card",
        cardId: 0
    }
    assert(SPEC_CARD_EFFECT_CAUSE_CARD, CARD_EFFECT_CAUSE_CARD)

    const SPEC_CARD_EFFECT_CAUSE = spec.or("SPEC_CARD_EFFECT_CAUSE", {
        system: SPEC_CARD_EFFECT_CAUSE_SYSTEM,
        card: SPEC_CARD_EFFECT_CAUSE_CARD,
    })

    const SPEC_CARD_EFFECT = spec.map("SPEC_CARD_EFFECT", {
        id: spec.str,
        description: spec.str,
        cause: SPEC_CARD_EFFECT_CAUSE,
        selection: spec.obj,
        requires: spec.and("requires", spec.obj, x => {
            return Object.values(x).map(v => {
                return valid(spec.nilable("require", spec.str), v)
            }).reduce((a, c) => a & c, true)
        }),
        action: spec.nilable("action", spec.str),
        onEvent: spec.nilable("onEvent", spec.str),
    })
    const CARD_EFFECT = {
        id: "",
        description: "",
        cause: CARD_EFFECT_CAUSE_SYSTEM,
        selection: {},
        requires: {},
        action: null,
        onEvent: null,
    }
    assert(SPEC_CARD_EFFECT, CARD_EFFECT)

    function test() {
        const effect = CARD_EFFECT
        if (valid(SPEC_CARD_EFFECT_CAUSE_SYSTEM, effect.cause)) {
            console.log("SPEC_CARD_EFFECT_CAUSE_SYSTEM")
        } else if (valid(SPEC_CARD_EFFECT_CAUSE_CARD, effect.cause)) {
            console.log("SPEC_CARD_EFFECT_CAUSE_CARD")
        }
        //console.log(type, value)
    }
    // test()
})(app.cardEffect)