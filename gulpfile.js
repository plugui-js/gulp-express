const { series, src, dest, watch } = require('gulp'),
browserSync = require('browser-sync').create(),
gls = require('gulp-live-server'),
sass = require('gulp-sass')(require('sass')),
minify = require('gulp-minify'),
concat = require('gulp-concat'),
plumber = require('gulp-plumber'),
notify = require('gulp-notify'),
postcss = require('gulp-postcss');


const paths = {
    scripts: {
        src: './src/js/**/*.js',
        dest: './public/js'
    },
    styles: {
        src: './src/styles/**/*.scss',
        dest: './public/css'
    },
    templates: {
        src: './src/views/**/*.hbs'
    }
};


const  serve = (done) => {
    const ls = gls.new('./src/server.js');

    browserSync.init({
        proxy: 'localhost:2000',
        open: false
    });

    watch([ paths.styles.src ], series([ styles_pipe ]), browserSync.reload);
    watch([  paths.templates.src ], browserSync.reload);
    watch([ paths.scripts.src ], series([ scripts_pipe ]), browserSync.reload);

    ls.start();
    done();
}

const styles_pipe = (done) => {
    src([ paths.styles.src])
    .pipe(plumber({ errorHandler }))
    .pipe(postcss())
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
    done();
}


const scripts_pipe = (done) => {
    src([ paths.scripts.src])
    .pipe(plumber({ errorHandler }))
    .pipe(minify())
    .pipe(dest(paths.scripts.dest));
    done();
}


const errorHandler = (error) => {
    notify.onError({
        title: 'Error',
        message: error.toString()
    })(error);
}



exports.default = series([ scripts_pipe, styles_pipe, serve ]);