import { DEFAULT_GAME_STATE_WITH_FLOW_MEMORY } from "./game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import * as LogicTree from "./tool/logicTree"

function main() {
    const ctx = DEFAULT_GAME_STATE_WITH_FLOW_MEMORY;
    console.log(ctx)
    //LogicTree.tests();
}

main()