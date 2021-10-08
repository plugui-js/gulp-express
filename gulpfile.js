const { src, watch, series, dest, parallel } = require('gulp'),
{ resolve } = require('path'),
gls = require('gulp-live-server'),
browser_sync = require('browser-sync').create(),
sass = require('gulp-sass')(require('sass')),
minify = require('gulp-minify'),
concat = require('gulp-concat');

const dirs = {
    images_src_dir: resolve(__dirname, './assets/images'),
    images_dest_dir: resolve(__dirname, './public/imgs'),
    styles_src: resolve(__dirname, './src/styles/**/*.scss'),
    styles_dest: resolve(__dirname, './public/css'),
    js_src: resolve(__dirname, './src/js/**/*.js'),
    js_dest: resolve(__dirname, './public/js')
};

const serve = (done) => {
    const server = gls.new('./src/server.js');
    browser_sync.init({
        proxy: 'localhost:2000',
        open: false,
        watch: true
    });
    server.start();
    done();
}


const csspipe = (done) => {
    return src([dirs.styles_src])
    .pipe(sass())
    .pipe(dest(dirs.styles_dest))
    .pipe(browser_sync.stream());
}


const jspipe = (done) => {
    return src([dirs.js_src])
    .pipe(minify({}))
    .pipe(concat('app.js'))
    .pipe(dest(dirs.js_dest))
    .pipe(browser_sync.stream());
}

const watcher = (done) => {
    return watch([ dirs.styles_src, dirs.js_src ],
        { ignoreInitial: false, delay: 500 },
        series([ csspipe, jspipe ]));
};

exports.default = series([jspipe, csspipe, serve, watcher]);