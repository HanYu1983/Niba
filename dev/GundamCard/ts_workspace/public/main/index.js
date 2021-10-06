import { mapCard } from './table';
const DefaultContext = {
    table: {
        cardStack: {},
        tokens: [],
    },
    paymentTable: {
        action: null,
        requires: [],
        currents: [],
        snapshot: null,
    },
};
function handCardStackID(playerID) {
    return `${playerID}/hand`;
}
function GCardStackID(playerID) {
    return `${playerID}/G`;
}
function queryAction(ctx, playerID) {
    var _a;
    const ret = [];
    if (((_a = ctx.paymentTable.action) === null || _a === void 0 ? void 0 : _a.playerID) == playerID) {
        // 支付狀態
        const gs = askPlayerG(ctx, playerID);
        const actions = gs
            .filter((card) => card.tap == false)
            .flatMap((card) => {
            return {
                id: 'TapCardToGenG',
                cardID: card.id,
                playerID: playerID,
            };
        });
        ret.push(...actions);
        // cancel
        ret.push({
            id: 'CancelPayment',
            cardID: ctx.paymentTable.action.cardID,
            playerID: playerID,
        });
    }
    else {
        // 正常狀態
        const hands = ctx.table.cardStack[handCardStackID(playerID)] || [];
        const actions = hands.flatMap((card) => {
            return {
                id: 'PlayCardAction',
                cardID: card.id,
                playerID: playerID,
            };
        });
        ret.push(...actions);
    }
    return ret;
}
function onCardStage(ctx, cardID) {
    return ctx;
}
function applyAction(ctx, playerID, action) {
    switch (action.id) {
        case 'ApplyPayment':
            if (ctx.paymentTable.action == null) {
                throw new Error('no payment');
            }
            if (ctx.paymentTable.action.playerID != playerID) {
                throw new Error('your are not owner');
            }
            // TODO: play card
            switch (ctx.paymentTable.action.id) {
                case 'PlayCardAction':
                    {
                        // TODO: move card to position
                        // TODO: 觸發卡牌進場事件
                        ctx = onCardStage(ctx, ctx.paymentTable.action.cardID);
                    }
                    break;
                case 'PlayCardAbilityAction':
                    break;
                default:
                    throw new Error('unknown action');
            }
            return Object.assign(Object.assign({}, ctx), { paymentTable: Object.assign(Object.assign({}, ctx.paymentTable), { action: null, snapshot: null }) });
        case 'CancelPayment':
            if (ctx.paymentTable.action == null) {
                return ctx;
            }
            if (ctx.paymentTable.snapshot == null) {
                throw new Error('snapshot not found');
            }
            if (ctx.paymentTable.action.playerID != playerID) {
                throw new Error('your are not owner');
            }
            return ctx.paymentTable.snapshot;
        case 'PlayCardAction':
            {
                // TODO: change to payment mode
                ctx = Object.assign(Object.assign({}, ctx), { paymentTable: {
                        action: action,
                        requires: queryPlayCardPayment(ctx, playerID, action.cardID),
                        currents: [],
                        snapshot: ctx,
                    } });
            }
            break;
        case 'PlayCardAbilityAction':
            {
                // TODO: change to payment mode
                ctx = Object.assign(Object.assign({}, ctx), { paymentTable: {
                        action: action,
                        requires: [],
                        currents: [],
                        snapshot: ctx,
                    } });
            }
            break;
        case 'TapCardToGenG':
            {
                ctx = Object.assign(Object.assign({}, ctx), { table: mapCard(ctx.table, (card) => {
                        if (card.id != action.cardID) {
                            return card;
                        }
                        if (card.tap) {
                            throw new Error(`G已經橫置，不能使用: ${card}`);
                        }
                        return Object.assign(Object.assign({}, card), { tap: true });
                    }), paymentTable: Object.assign(Object.assign({}, ctx.paymentTable), { currents: [
                            ...ctx.paymentTable.currents,
                            {
                                id: 'ColorPayment',
                                color: 'blue',
                                cardID: action.cardID,
                            },
                        ] }) });
            }
            break;
    }
    return ctx;
}
function queryPlayCardPayment(ctx, playerID, cardID) {
    const payments = [];
    payments.push(...[
        {
            id: 'ColorPayment',
            color: 'blue',
            cardID: '',
        },
        {
            id: 'GCountPayment',
            gCount: 2,
        },
    ]);
    return payments;
}
function askPlayerG(ctx, playerID) {
    return ctx.table.cardStack[GCardStackID(playerID)];
}
function checkPayment(ctx) {
    if (ctx.paymentTable.action == null) {
        throw new Error('要確認支付，但找不到action。請確定有呼叫');
    }
    const passed = {};
    const consumed = {};
    for (const requireID in ctx.paymentTable.requires) {
        const require = ctx.paymentTable.requires[requireID];
        if (require.id == 'GCountPayment') {
            if (askPlayerG(ctx, ctx.paymentTable.action.playerID).length <
                require.gCount) {
                break;
            }
            passed[requireID] = true;
            break;
        }
        for (const currentID in ctx.paymentTable.currents) {
            if (consumed[currentID]) {
                continue;
            }
            const current = ctx.paymentTable.currents[currentID];
            console.log(require, current);
            if (require.id == 'ColorPayment' &&
                current.id == 'ColorPayment' &&
                require.color == current.color) {
                passed[requireID] = true;
                consumed[currentID] = true;
                break;
            }
        }
    }
    const isPass = Object.keys(passed).length == ctx.paymentTable.requires.length;
    const reasons = ctx.paymentTable.requires.filter((_, i) => passed[i] != true);
    return [isPass, reasons];
}
function test1() {
    const playerID = 'a';
    let ctx = Object.assign(Object.assign({}, DefaultContext), { table: Object.assign(Object.assign({}, DefaultContext.table), { cardStack: Object.assign(Object.assign({}, DefaultContext.table.cardStack), { [handCardStackID(playerID)]: [
                    { id: '1', faceDown: true, protoId: '', tap: false },
                ], [GCardStackID(playerID)]: [
                    { id: '2', faceDown: true, protoId: '', tap: false },
                    { id: '3', faceDown: true, protoId: '', tap: false },
                ] }) }) });
    let actions = queryAction(ctx, playerID);
    const unitAction = actions[0];
    console.log(actions);
    ctx = applyAction(ctx, playerID, unitAction);
    console.log(ctx);
    actions = queryAction(ctx, playerID);
    console.log(actions);
    const tapGAction = actions[0];
    if (tapGAction.id != 'TapCardToGenG') {
        throw new Error('must TapCardToGenG');
    }
    ctx = applyAction(ctx, playerID, tapGAction);
    console.log(ctx);
    const [passed, reason] = checkPayment(ctx);
    console.log(passed, reason);
    if (ctx.paymentTable.action == null) {
        throw new Error('must have payment action');
    }
    console.log(ctx);
}
test1();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFlLE9BQU8sRUFBRSxNQUFNLFNBQVMsQ0FBQztBQXNFL0MsTUFBTSxjQUFjLEdBQVk7SUFDOUIsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFLEVBQUU7UUFDYixNQUFNLEVBQUUsRUFBRTtLQUNYO0lBQ0QsWUFBWSxFQUFFO1FBQ1osTUFBTSxFQUFFLElBQUk7UUFDWixRQUFRLEVBQUUsRUFBRTtRQUNaLFFBQVEsRUFBRSxFQUFFO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtDQUNGLENBQUM7QUFFRixTQUFTLGVBQWUsQ0FBQyxRQUFnQjtJQUN2QyxPQUFPLEdBQUcsUUFBUSxPQUFPLENBQUM7QUFDNUIsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLFFBQWdCO0lBQ3BDLE9BQU8sR0FBRyxRQUFRLElBQUksQ0FBQztBQUN6QixDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsR0FBWSxFQUFFLFFBQWdCOztJQUNqRCxNQUFNLEdBQUcsR0FBYSxFQUFFLENBQUM7SUFDekIsSUFBSSxDQUFBLE1BQUEsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLDBDQUFFLFFBQVEsS0FBSSxRQUFRLEVBQUU7UUFDakQsT0FBTztRQUNQLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsRUFBRTthQUNmLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUM7YUFDbkMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFVLEVBQUU7WUFDeEIsT0FBTztnQkFDTCxFQUFFLEVBQUUsZUFBZTtnQkFDbkIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNmLFFBQVEsRUFBRSxRQUFRO2FBQ25C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