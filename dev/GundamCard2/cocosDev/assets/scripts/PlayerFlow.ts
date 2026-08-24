import { callWeb, callWebPromise } from "./PostMessageCallback";

class PlayerFlow implements IInstanceGame<string> {
    async sync(game: IGame, relative: string): Promise<void> {
        const flows = game.playerCommands[relative] || [];
        if (flows.length) {
            let flow: any | null = null
            if (relative === 'PlayerA') {
                flow = await callWebPromise('onMethodCall', { method: 'getPlayerFlowAuto', args: [game.model.gameState, relative, flows] });
            } else {
                flow = await callWebPromise('onMethodCall', { method: 'thinkVer2', args: [game.model.gameState, relative, flows] });
            }
            if (flow) {
                setTimeout(() => {
                    callWeb("onCocosGameFlow", { clientId: relative, flow: flow, versionID: game.model.versionID });
                }, 50)
            }
        }
        return Promise.resolve();
    }
}

export { PlayerFlow }