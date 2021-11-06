// https://gulpjs.com/docs/en/getting-started/quick-start
const { series, watch, parallel, dest, src } = require("gulp");
const shell = require("gulp-shell");
const browserify = require("gulp-browserify");
const through = require("through2");
const tap = (callbackWrap) => {
    return through.obj(function (vinylFile, encoding, callback) {
        callbackWrap(vinylFile, encoding, callback);
    });
};
const serveHttp = shell.task("http-server -c-1 build");
const build = async () => {
    // 回傳promise讓build可以結束
    src("app/index.js")
        .pipe(browserify().on("error", console.log))
        .pipe(dest("build"))
        .pipe(
            tap((file, encoding, cb) => {
                //console.log("done");
                cb();
            })
        );
}
const watchBuild = async () => {
    // 回傳promise讓這個watchBuild可以結束
    watch("app/**/*.js", { delay: 500 }, build);
};
exports.default = parallel(watchBuild, serveHttp);
