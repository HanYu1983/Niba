var tool = tool || {};
tool.card = tool.card || {};
(function (module) {
    const { spec, assert, valid } = window["js.spec"]
    const SPEC_CARD = spec.map("SPEC_CARD", {
        id: spec.int,
        faceUp: spec.boolean,
        tap: spec.boolean,
        protoId: spec.nilable("protoId", spec.string),
        owner: spec.nilable("owner", spec.string)
    })
    module.SPEC_CARD = SPEC_CARD

    const SPEC_CARDS = spec.collection("SPEC_CARDS", SPEC_CARD)
    module.SPEC_CARDS = SPEC_CARDS

    const SPEC_CARD_STACK = spec.collection("SPEC_CARD_STACK", spec.int)
    module.SPEC_CARD_STACK = SPEC_CARD_STACK

    // const SPEC_CARD_STACKS = spec.and("SPEC_CARD_STACKS", spec.obj, x => {
    //     return Object.values(x).map(v => {
    //         return valid(SPEC_CARD_STACK, v)
    //     }).reduce((a, c) => a & c, true)
    // })
    const SPEC_CARD_STACKS = spec.collection("SPEC_CARD_STACKS", SPEC_CARD_STACK)
    module.SPEC_CARD_STACKS = SPEC_CARD_STACKS

    const SPEC_TABLE = spec.map("SPEC_TABLE", {
        cards: SPEC_CARDS,
        cardStacks: SPEC_CARD_STACKS
    });
    module.SPEC_TABLE = SPEC_TABLE
    // 
    const CARD = {
        id: 0,
        faceUp: false,
        tap: false,
        protoId: null,
        owner: null
    }
    module.CARD = CARD

    const TABLE = {
        cards: [],
        cardStacks: [],
    }
    module.TABLE = TABLE

    function getCardStack(table, cardStackId){
        return table.cardStacks[cardStackId] || []
    }
    module.getCardStack = getCardStack

    function moveCard(table, cardId, fromId, toId) {
        if (getCardStack(table, fromId).includes(cardId) == false) {
            throw new Error(`card not found: ${fromId} > ${cardId}`)
        }
        table = {...table}
        table.cardStacks[fromId] = getCardStack(table, fromId).filter(c => c != cardId)
        table.cardStacks[toId] = getCardStack(table, toId).concat([cardId])
        return table
    }
    module.moveCard = moveCard

    function test() {
        let table = TABLE
        assert(SPEC_TABLE, table)
        const homeId = 0
        let card1 = { ...CARD, id: 0 }
        table.cards = [card1]
        table.cardStacks[homeId] = getCardStack(table, homeId).concat([card1.id])
        assert(SPEC_TABLE, table)
        const handId = 1
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
    }
    test()
})(tool.card);