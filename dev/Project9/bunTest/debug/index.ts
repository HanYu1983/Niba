import { testGetPlayEffects } from "../game/gameState/getPlayEffects";
import { testBattleBonus, testFlow1, testFlow2 } from "./testFlow";
import { tests as itemGroupTests } from "../tool/ItemGroup"
import { test179028_10D_U_WT181N_white } from "./test179028_10D_U_WT181N_white";
import { test179024_03B_U_WT042U_white } from "./test179024_03B_U_WT042U_white";

export async function tests() {
    return [
        itemGroupTests,
        testFlow1,
        testFlow2,
        testBattleBonus,
        testGetPlayEffects,
        test179028_10D_U_WT181N_white,
        test179024_03B_U_WT042U_white,
    ].reduce((worker, testF) => {
        return worker.then(async () => {
            console.log(`==============================${testF.name}==================================`);
            return testF()
        })
    }, Promise.resolve()).then(()=>console.log("DONE!"))
}