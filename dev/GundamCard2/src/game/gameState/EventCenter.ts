import { Table } from "../../tool/table"
import { ItemState } from "../define/ItemState"
import { PlayerState } from "../define/PlayerState"
import { Phase } from "../define/Timing"

export const EventCenterFn = {
    onItemStateChange(ctx: any, old: ItemState, curr: ItemState): any {
        return ctx
    },
    onPlayerStateChange(ctx: any, old: PlayerState, curr: PlayerState): any {
        return ctx
    },
    onSetSetGroupParent(ctx: any, parentId: string, itemId: string): any {
        return ctx
    },
    onSetPhase(ctx: any, old: Phase, curr: Phase): any {
        return ctx
    },
    onTableChange(ctx: any, old: Table, curr: Table): any {
        return ctx
    },
}