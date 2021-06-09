
import { _decorator, Component, Node, Vec2 } from 'cc';
import { DebugModel } from './DebugModel';
import { ActionType, ChessModel, ActionModel, PlayerModel, DirectType, ItemName } from './Type';
const { ccclass, property } = _decorator;

@ccclass('Model')
export class Model extends DebugModel {

    seqId = 0

    activePlayer = 0

    table = [
        { id: this.seqId++, type: 0, pos: new Vec2(5, 5), player: 0 },
        { id: this.seqId++, type: 1, pos: new Vec2(7, 6), player: 1 },
        { id: this.seqId++, type: 1, pos: new Vec2(8, 8), player: 1 }
    ]

    players: PlayerModel[] = [
        { id: 0, name: 'vic', score: 5, money: 4, itemValids: [true, true, false, false] },
        { id: 1, name: 'han', score: 5, money: 4, itemValids: [true, true, false, false] },
        { id: 2, name: 'john', score: 5, money: 4, itemValids: [true, true, false, false] },
        { id: 3, name: 'marry', score: 5, money: 4, itemValids: [true, true, false, false] }
    ]

    startGame() {

    }

    getTable(): ChessModel[] {
        return this.table
    }

    getGridModel(x: number, y: number): ChessModel | null {
        const find = this.table.filter(chess => {
            return chess.pos.x == x && chess.pos.y == y
        })
        if (find.length == 0) {
            return null
        }
        return find[0]
    }

    getChessMoveRangeById(id: number): Vec2[] {
        const chess = this.getChessById(id)
        const myChesses = this.table.filter(c => {
            return c.player == chess.player
        })
        return [[2, 1], [2, -1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [1, -2], [-1, -2]].map(([ox, oy]) => {
            return new Vec2(chess.pos.x + ox, chess.pos.y + oy)
        }).filter(pos => {
            const occupy = myChesses.filter(c => {
                return c.pos.equals(pos)
            })
            return occupy.length == 0
        })
    }

    getPlayerAllChessMoveRange(playerId: number): Vec2[] {
        const find = this.table.filter(chess => {
            return chess.player == playerId
        })
        const posStrSet = find
            .map(chess => this.getChessMoveRangeById(chess.id))
            .reduce((acc, c) => { return [...acc, ...c] }, [])
            .map(pos => JSON.stringify(pos))
            .reduce((acc, c) => { acc[c] = 1; return acc }, {} as any)
        const posStrSetNotContainChess = this.table
            .map(chess => chess.pos)
            .map(pos => JSON.stringify(pos))
            .reduce((acc, c) => {
                delete acc[c]
                return acc
            }, posStrSet)
        const posList = Object.keys(posStrSetNotContainChess).map(posStr => JSON.parse(posStr))
        return posList
    }

    isValidMove(playerId: number, x: number, y: number): boolean {
        const posList = this.getPlayerAllChessMoveRange(playerId)
        const findPos = posList.filter(pos => {
            return pos.x == x && pos.y == y
        })
        if (findPos.length == 0) {
            return false
        }
        return true
    }

    isValidMoveByChess(chessId: number, x: number, y: number): boolean {
        const moveRange = this.getChessMoveRangeById(chessId)
        const findPos = moveRange.filter(pos => {
            return pos.x == x && pos.y == y
        })
        if (findPos.length == 0) {
            return false
        }
        return true
    }

    isPlayer(id: number): boolean {
        try {
            const chess = this.getChessById(id)
            return chess.player == 0
        } catch (e) {
            console.log(e)
            return false
        }
    }

    getCurrentPlayerId(): number {
        return this.activePlayer;
    }

    playerMoveChess(id: number, x: number, y: number): ActionModel[] {
        const chess = this.getChessById(id)
        const moveRange = this.getChessMoveRangeById(id)
        const findPos = moveRange.filter(pos => {
            return pos.x == x && pos.y == y
        })
        if (findPos.length == 0) {
            throw new Error(`chess(${id}) can not move to [${x}, ${y}]`)
        }
        const occupy = this.table.filter(c => {
            return c.pos.equals(new Vec2(x, y))
        })
        if (occupy.length) {
            if (occupy[0].player == chess.player) {
                throw new Error(`you can not eat your self. chess(${id}) move to (${x}, ${y})`)
            }
        }
        const actions: ActionModel[] = []
        const newChess = {
            ...chess,
            pos: new Vec2(x, y),
            id: this.seqId++,
        }
        this.table.push(newChess)
        actions.push({
            action: ActionType.MoveChess,
            id: newChess.id,
            from: chess.pos,
            to: newChess.pos,
            player: newChess.player,
            table: [...this.table]
        })
        if (occupy.length) {
            this.table = this.table.filter(c => {
                return c.id != occupy[0].id
            })
            actions.push({
                action: ActionType.KillChess,
                id: occupy[0].id,
                to: occupy[0].pos,
                player: occupy[0].player,
                table: [...this.table]
            })
        }
        return actions
    }

    playerEndTurn(): ActionModel[] {
        const findChess = this.table.filter(chess => {
            return chess.player == 1
        })
        const actions = []
        if (findChess.length) {
            const activeChess = findChess[findChess.length - 1]
            const newChess = {
                ...activeChess,
                pos: new Vec2(activeChess.pos.x, activeChess.pos.y - 1),
                id: this.seqId++,
            }
            this.table.push(newChess)
            actions.push({
                action: ActionType.MoveChess,
                id: activeChess.id,
                from: activeChess.pos,
                to: newChess.pos,
                player: newChess.player,
                table: [...this.table]
            })
        }
        actions.push({
            action: ActionType.ChangeTurn,
            player: 0,
            table: [...this.table]
        })
        return actions
    }

    getChessById(id: number): ChessModel {
        const findChess = this.table.filter(chess => {
            return chess.id == id
        })
        if (findChess.length == 0) {
            throw new Error(`chess(${id}) not found`)
        }
        return findChess[0]
    }

    getPlayerInfoById(id: number): PlayerModel {
        const plyr = this.players[id]
        if (plyr == null) {
            throw new Error(`player(${id}) not found`)
        }
        return plyr
    }

    getItemCostById(id: number): number {
        return [3, 4, 5, 8][id];
    }

    getItemAttackRangeById(id: number, grid: Vec2, dir: DirectType): Vec2[] {
        switch (ItemName[id]) {
            case '炸彈':
            case '轟爆炸彈':
                {
                    let limit = 2
                    if (ItemName[id] == '轟爆炸彈') {
                        limit = 3
                    }
                    const result: Vec2[] = [grid]
                    const stacks: number[][] = [[grid.x, grid.y, 0]]
                    const opened: number[][] = [[grid.x, grid.y, 0]]
                    while (stacks.length > 0) {
                        const [cx, cy, step] = stacks[0];
                        if (step == limit) {
                            break
                        }
                        [[0, 1], [1, 0], [0, -1], [-1, 0]].forEach(([ox, oy]) => {
                            const nextStep = [cx + ox, cy + oy, step + 1]
                            if (opened.filter(v => v[0] == nextStep[0] && v[1] == nextStep[1]).length == 0) {
                                result.push(new Vec2(nextStep[0], nextStep[1]))
                                stacks.push(nextStep)
                                opened.push(nextStep)
                            }
                        })
                        stacks.shift()
                    }
                    return result
                }
            case '鐳射':
            case '聚能光束':
                {
                    const result: Vec2[] = []
                    for (let i = 0; i < 20; ++i) {
                        switch (dir) {
                            case DirectType.Vertical:
                                result.push(new Vec2(grid.x, i))
                                if (ItemName[id] == '聚能光束') {
                                    result.push(new Vec2(grid.x + 1, i))
                                }
                                break
                            case DirectType.Horizontal:
                                result.push(new Vec2(i, grid.y))
                                if (ItemName[id] == '聚能光束') {
                                    result.push(new Vec2(i, grid.y + 1))
                                }
                                break
                            default:
                                throw new Error(`dir(${dir}) not found`)
                        }
                    }
                    return result
                }
            default:
                throw new Error(`ItemName[${id}] not found`)
        }
    }

    usingItemAtGrid(itemId: number, grid: Vec2, dir: DirectType): ActionModel[] {
        return [
            { action: ActionType.Item, id: 0, to: new Vec2(2, 5), table: [{ id: 0, type: 0, pos: new Vec2(5, 5), player: 1 }] }
        ]
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
