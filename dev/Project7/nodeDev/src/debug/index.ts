import { testGetPlayCardEffect } from "../game/gameState/getPlayCardEffect";
import { testGetPlayEffects } from "../game/gameState/getPlayEffects";
import { testBattleBonus, testFlow1, testFlow2 } from "./testFlow";
import { tests as itemGroupTests } from "../tool/ItemGroup"

export async function tests() {
    return [
        itemGroupTests,
        testFlow1,
        testBattleBonus,
        testGetPlayEffects,
        testGetPlayCardEffect,
    ].reduce((worker, testF) => {
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