const gulp = require('gulp');
const cheerio = require('gulp-cheerio');
const fs = require('fs');
const path = require('path');

function addScriptCheerio(scriptPath) {
    return cheerio(($, file, done) => {
        const script = `<script src="${scriptPath}"></script>`;
        $('head').append(script);
        done();
    });
}

function htmlImageEmbededCheerio() {
    return cheerio(($, file, done) => {
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            if (src && !src.startsWith('data:')) {
                const imgPath = path.resolve(path.dirname(file.path), src);
                try {
                    const imgBuffer = fs.readFileSync(imgPath);
                    const type = path.extname(imgPath).substring(1)
                    $(el).attr('src', `data:${type};base64,${imgBuffer.toString('base64')}`);
                } catch (err) {
                    throw new Error(`Error processing image "${src}": ${err}`);
                }
            }
        });
        done();
    })
}

function htmlJsEmbededCheerio() {
    return cheerio(($, file, done) => {
        $('script').each((i, el) => {
            const ignoreList = ["mraid.js"]
            const src = $(el).attr('src');
            if (src && ignoreList.includes(src) == false) {
                const jsPath = path.resolve(path.dirname(file.path), src);
                try {
                    const jsBuffer = fs.readFileSync(jsPath);
                    $(el).text(jsBuffer.toString());
                    $(el).removeAttr('src');
                    const fileName = path.basename(jsPath);
                    $(el).attr('id', fileName);
                } catch (err) {
                    throw new Error(`Error processing script "${src}": ${err}`);
                }
            }
        });
        done();
    })
}

function buildGoogleHtml() {
    return gulp.src('template/index.html')
        .pipe(htmlImageEmbededCheerio())
        .pipe(htmlJsEmbededCheerio())
        .pipe(addScriptCheerio('https://tpc.googlesyndication.com/pagead/gadgets/html5/api/exitapi.js'))
        .pipe(gulp.dest('deploy/template/google'));
}
exports.buildGoogleHtml = buildGoogleHtml

function buildMraidHtml() {
    return gulp.src('template/index.html')
        .pipe(htmlImageEmbededCheerio())
        .pipe(htmlJsEmbededCheerio())
        .pipe(addScriptCheerio('mraid.js'))
        .pipe(gulp.dest('deploy/template/mraid'));
}
exports.buildMraidHtml = buildMraidHtml

function buildTiktokHtml() {
    return gulp.src('template/index.html')
        .pipe(htmlImageEmbededCheerio())
        .pipe(htmlJsEmbededCheerio())
        .pipe(addScriptCheerio('https://sf16-muse-va.ibytedtos.com/obj/union-fe-nc-i18n/playable/sdk/playable-sdk.js'))
        .pipe(gulp.dest('deploy/template/tiktok'));
}
exports.buildTiktokHtml = buildTiktokHtml

function buildOtherHtml() {
    return gulp.src('template/index.html')
        .pipe(htmlImageEmbededCheerio())
        .pipe(htmlJsEmbededCheerio())
        .pipe(gulp.dest('deploy/template/others'));
}
exports.buildOtherHtml = buildOtherHtml
