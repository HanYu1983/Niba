
import { _decorator, Component, Node } from 'cc';
import { DebugModel } from './DebugModel';
const { ccclass, property } = _decorator;

@ccclass('Model')
export class Model extends DebugModel {

    seqId = 0

    activePlayer = 0

    table = [
        { id: this.seqId++, type: 0, pos: [5, 5], player: 0 },
        { id: this.seqId++, type: 1, pos: [19, 19], player: 1 },
        { id: this.seqId++, type: 1, pos: [18, 19], player: 1 }
    ]

    startGame() {

    }

    getTable() {
        return this.table
    }

    getGridModel(x: number, y: number) {
        const find = this.table.filter(chess => {
            return chess.pos[0] == x && chess.pos[1] == y
        })
        if (find.length == 0) {
            return null
        }
        return find[0]
    }

    getChessMoveRangeById(id: number) {
        const chess = this.getChessById(id)
        return [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([ox, oy]) => {
            return [chess.pos[0] + ox, chess.pos[1] + oy]
        })
    }

    getPlayerAllChessMoveRange(playerId: number) {
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

    isValidMove(playerId: number, x: number, y: number) {
        const posList = this.getPlayerAllChessMoveRange(playerId)
        const findPos = posList.filter(pos => {
            return pos[0] == x && pos[1] == y
        })
        if (findPos.length == 0) {
            return false
        }
        return true
    }

    isPlayer(id: number) {
        try {
            const chess = this.getChessById(id)
            return chess.player == 0
        } catch (e) {
            console.log(e)
            return false
        }
    }

    getCurrentPlayerId() {
        return this.activePlayer;
    }

    playerMoveChess(id: number, x: number, y: number) {
        const chess = this.getChessById(id)
        const moveRange = this.getChessMoveRangeById(id)
        const findPos = moveRange.filter(pos => {
            return pos[0] == x && pos[1] == y
        })
        if (findPos.length == 0) {
            throw new Error(`chess(${id}) can not move to [${x}, ${y}]`)
        }
        const newChess = {
            ...chess,
            pos: [x, y],
            id: this.seqId++,
        }
        this.table.push(newChess)
        return this.table
    }

    playerEndTurn() {
        const findChess = this.table.filter(chess => {
            return chess.player == 1
        })
        const actions = []
        if (findChess.length) {
            const activeChess = findChess[findChess.length - 1]
            const newChess = {
                ...activeChess,
                pos: [activeChess.pos[0], activeChess.pos[1] - 1],
                id: this.seqId++,
            }
            this.table.push(newChess)
            actions.push({
                ...newChess,
                action: 0,
                from: activeChess.pos, to: newChess.pos,
                table: [...this.table]
            })
        }
        actions.push({ action: 1, player: 0, table: [...this.table] })
        return actions
    }

    getChessById(id: number) {
        console.log(id)
        const findChess = this.table.filter(chess => {
            return chess.id == id
        })
        if (findChess.length == 0) {
            throw new Error(`chess(${id}) not found`)
        }
        return findChess[0]
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
