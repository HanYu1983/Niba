export type A = {
    name: string
}

export type doB = (playerId: string) => void;
export type Lib1 = {
    doB: doB,
    doC: string
}


var common = common || {};
(function (module) {


    const lib1: Lib1 = {
        doB: (p: string) => {
            const script = `${common.lib1.doC}`;
            console.log(script);
            eval(script);
            // @ts-ignore
            console.log(fn.bind({})());
        },
        doC: function fn() {
            const a: string = "";
            return a + "2";
        }.toString()
    }

    module.lib1 = lib1

})(common);