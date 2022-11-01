var main = main || {};

var tool = {
    test: function _() {
        console.log("test")
    }
}; // 必須下分號，不然eval時找不到這個物件

(function (module) {

    function doA(script) {
        console.log(script)
        eval(`var _fn = ${script}`)
        _fn();
    }

    function doB() {
        console.log("doB")
    }

    doA(function _() {
        doB();
        console.log(tool);
        tool.test();
    }.toString())

}(this));