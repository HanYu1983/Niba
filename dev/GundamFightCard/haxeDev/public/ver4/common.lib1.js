exports.__esModule = true;
var common = common || {};
(function (module) {
    var lib1 = {
        doB: function (p) {
            var script = "".concat(common.lib1.doC);
            console.log(script);
            eval(script);
            // @ts-ignore
            console.log(fn.bind({})());
        },
        doC: function fn() {
            var a = "";
            return a + "2";
        }.toString()
    };
    module.lib1 = lib1;
})(common);
