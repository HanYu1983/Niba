"use strict";
exports.__esModule = true;
exports.app = void 0;
// 使用spec, html中必須先為環境建一個exports
// ex. var exports = {}
// 之後, 只要引用exports, 就可以使用別的module
var _spec = exports.spec;
exports.app = {
    main: function () {
        var a = {
            age: 0
        };
        _spec.doA(a);
    }
};
exports.app.main();
//# sourceMappingURL=app.js.map