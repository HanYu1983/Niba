import { testBattleBonus, testFlow1, testFlow2 } from "./testFlow";

export function tests() {
    // [
    //     testFlow1,
    //     //testFlow2,
    //     testBattleBonus
    // ].forEach((testF: Function) => {
    //     console.log(
    //         `================================================================`
    //     );
    //     console.log(`${testF.name}`);
    //     console.log(
    //         `================================================================`
    //     );
    //     testF();
    // });
    [testFlow1, testBattleBonus].reduce((worker, testF) => {
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