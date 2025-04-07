const gulp = require('gulp');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const cheerio = require('gulp-cheerio');
const fs = require('fs');
const path = require('path');

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

function compileJs() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/index.js'],
        cache: {},
        packageCache: {}
    })
        //.plugin(tsify)    // for TypeScript
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('deploy'));
}

function main() {
    const prefix = "html/"
    return gulp.src(prefix + 'index.html')
        .pipe(htmlImageEmbededCheerio())
        .pipe(htmlJsEmbededCheerio())
        .pipe(gulp.dest('deploy'));
}

exports.default = main

