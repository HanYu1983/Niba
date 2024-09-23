import { Table, TableFns } from "../../tool/table"
import { ItemState } from "../define/ItemState"
import { PlayerState } from "../define/PlayerState"
import { Phase } from "../define/Timing"
import { GameState } from "./GameState"

type EventCenter = GameState

export const EventCenterFn = {
    onItemStateChange(_ctx: any, old: ItemState, curr: ItemState): any {
        let ctx = _ctx as EventCenter
        return ctx
    },
    onPlayerStateChange(_ctx: any, old: PlayerState, curr: PlayerState): any {
        let ctx = _ctx as EventCenter
        return ctx
    },
    onSetSetGroupParent(_ctx: any, parentId: string, itemId: string): any {
        let ctx = _ctx as EventCenter
        return ctx
    },
    onSetPhase(_ctx: any, old: Phase, curr: Phase): any {
        let ctx = _ctx as EventCenter
        return ctx
    },
    onItemAdd(_ctx: any, itemId: string): any {
        let ctx = _ctx as EventCenter
        return ctx
    },
    onItemMove(_ctx: any, from: string, to: string, itemId: string): any {
        let ctx = _ctx as EventCenter
        return ctx
    },
    onItemDelete(_ctx: any, itemId: string): any {
        let ctx = _ctx as EventCenter
        return ctx
    },
    onTableChange(_ctx: any, old: Table, curr: Table): any {
        for (const oldBasyouStr in old.cardStack) {
            for (const itemId of old.cardStack[oldBasyouStr]) {
                const newBasyouStr = TableFns.getCardPosition(curr, itemId)
                if (newBasyouStr == null) {
                    _ctx = this.onItemDelete(_ctx, itemId)
                } else if (newBasyouStr != oldBasyouStr) {
                    _ctx = this.onItemMove(_ctx, oldBasyouStr, newBasyouStr, itemId)
                }
            }
        }
        for (const newBasyouStr in curr.cardStack) {
            for (const itemId of curr.cardStack[newBasyouStr]) {
                const oldBasyouStr = TableFns.getCardPosition(curr, itemId)
                if (oldBasyouStr == null) {
                    _ctx = this.onItemAdd(_ctx, itemId)
                } else if (newBasyouStr != oldBasyouStr) {
                    _ctx = this.onItemMove(_ctx, oldBasyouStr, newBasyouStr, itemId)
                }
            }
        }
        return _ctx
    },
}