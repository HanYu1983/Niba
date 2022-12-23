var tool = tool || {};
tool.card = tool.card || {};
(function (module) {
    const { spec, assert } = window["js.spec"]
    const SPEC_CARD = spec.map("SPEC_CARD", {
        id: spec.string,
        faceUp: spec.boolean,
        tap: spec.boolean,
        protoId: spec.nilable("protoId", spec.string),
        owner: spec.nilable("owner", spec.string)
    })
    module.SPEC_CARD = SPEC_CARD

    const SPEC_CARD_STACK = spec.collection("SPEC_CARD_STACK", SPEC_CARD)
    module.SPEC_CARD_STACK = SPEC_CARD_STACK

    const SPEC_TABLE = spec.map("SPEC_TABLE", {
        cardStacks: spec.collection("SPEC_CARD_STACKS", SPEC_CARD_STACK)
    });
    module.SPEC_TABLE = SPEC_TABLE
    // 
    const CARD = {
        id: "",
        faceUp: false,
        tap: false,
        protoId: null,
        owner: null
    }
    module.CARD = CARD

    const TABLE = {
        cardStacks: [],
    }
    module.TABLE = TABLE
    //
    function getNextCardStackId(table) {
        return table.cardStacks.length
    }
    module.getNextCardStackId = getNextCardStackId

    function addCardStack(table) {
        return {
            ...table,
            cardStacks: [...table.cardStacks, []]
        }
    }
    module.addCardStack = addCardStack

    function moveCard(table, cardId, fromId, toId, mapF) {
        let card = table.cardStacks[fromId].find(c => c.id == cardId)
        if (card == null) {
            throw new Error(`card not found: ${fromId} > ${cardId}`)
        }
        card = mapF(card)
        table = { ...table }
        table.cardStacks[fromId] = table.cardStacks[fromId].filter(c => c.id != cardId)
        table.cardStacks[toId] = table.cardStacks[toId].concat([card])
        return table
    }
    module.moveCard = moveCard

    function getCards(table) {
        return table.cardStacks.reduce((a, c) => a.concat(c))
    }
    module.getCards = getCards

    function test() {
        let table = { ...TABLE }
        assert(SPEC_TABLE, table)
        const homeId = getNextCardStackId(table)
        table = addCardStack(table)
        let card1 = { ...CARD, id: "1" }
        table.cardStacks[homeId] = table.cardStacks[homeId].concat([card1])
        assert(SPEC_TABLE, table)
        const handId = getNextCardStackId(table)
        table = addCardStack(table)
        table = moveCard(table, card1.id, homeId, handId, c => {
            return {
                ...c,
                tap: true
            }
        })
        assert(SPEC_TABLE, table)
        if (table.cardStacks[homeId].length != 0) {
            throw new Error("card must move form home")
        }
        if (table.cardStacks[handId].length != 1) {
            throw new Error("card must move to hand")
        }
        card1 = getCards(table).find(c => c.id == card1.id)
        if (card1 == null) {
            throw new Error("card1 is gone")
        }
        if (card1.tap == false) {
            throw new Error("card1 must tap")
        }
    }
    test()
})(tool.card);