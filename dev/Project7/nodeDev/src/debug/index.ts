import { testGetClientCommand } from "../game/gameStateWithFlowMemory/getClientCommand";
import { testBattleBonus, testFlow1, testFlow2 } from "./testFlow";

export async function tests() {
    return [testFlow1, testBattleBonus, testGetClientCommand].reduce((worker, testF) => {
        return worker.then(async () => {
            console.log(
                `================================================================`
            );
            console.log(`${testF.name}`);
            console.log(
                `================================================================`
            );
            return testF()
        })
    }, Promise.resolve())
}