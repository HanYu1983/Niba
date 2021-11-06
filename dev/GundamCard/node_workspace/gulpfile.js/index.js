// https://gulpjs.com/docs/en/getting-started/quick-start
const { series, watch, parallel, dest, src } = require("gulp");
const shell = require("gulp-shell");
const browserify = require("gulp-browserify");
const wisp = require('gulp-wisp')
const gulpPlumber = require('gulp-plumber');
const gulpLiveScript = require('gulp-livescript');


const through = require("through2");
const tap = (callbackWrap) => {
    return through.obj(function (vinylFile, encoding, callback) {
        callbackWrap(vinylFile, encoding, callback);
    });
};
// ps: show use port
// kill <pid>: kill use port
const serveHttp = shell.task("http-server -c-1 build");

// can not use
const buildWisp = async () => {
    src('app/**/*.wisp')
        .pipe(gulpPlumber({
            errorHandler: function (err) {
                console.log(err)
                this.emit('end');
            }
        }))
        .pipe(wisp().on('error', console.log))
        .pipe(dest(function (file) {
            return file.base;
        }))
}
const watchBuildWisp = async () => {
    // 回傳promise讓這個watchBuild可以結束
    watch("app/**/*.wisp", { delay: 500 }, buildWisp);
};

const buildLiveScript = async () => {
    src('app/**/*.ls')
        .pipe(gulpLiveScript({ bare: true }).on('error', console.log))
        .pipe(dest(function (file) {
            return file.base;
        }))
}
const watchLiveScript = async () => {
    // 回傳promise讓這個watchBuild可以結束
    watch("app/**/*.ls", { delay: 500 }, buildLiveScript);
};


const buildNode = async () => {
    // 回傳promise讓build可以結束
    src("app/index.js")
        // use on error to catch error
        .pipe(browserify().on("error", console.log))
        .pipe(dest("build"))
        .pipe(
            tap((file, encoding, cb) => {
                //console.log("done");
                cb();
            })
        );
}
const watchBuildNode = async () => {
    // 回傳promise讓這個watchBuild可以結束
    watch("app/**/*.js", { delay: 500 }, buildNode);
};
exports.default = parallel(watchBuildNode, watchLiveScript, serveHttp);
