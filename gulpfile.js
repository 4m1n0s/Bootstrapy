/**
 * Gulp Packages
 */

// General
var { src, dest, watch, series } = require('gulp');
var nunjucks = require('gulp-nunjucks');
var htmlBeautify = require('gulp-html-beautify');
var removeEmptyLines = require('gulp-remove-empty-lines');
var sourcemaps = require('gulp-sourcemaps');
var scss = require('gulp-sass');
var csscomb = require('gulp-csscomb');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');
var browserSync = require('browser-sync');

/**
 * Paths to project folders
 */

var paths = {
    input: 'src/',
    output: 'dist/',

    html: {
        input: 'src/*.html',
        watch: 'src/**/*.html',
        output: 'dist/',
    },
    styles: {
        input: 'src/assets/scss/**/*.scss',
        output: 'dist/assets/css/',
    },
    scripts: {
        input: 'src/assets/js/**/*.js',
        output: 'dist/assets/js/',
    },
    images: {
        input: 'src/assets/images/**/*.*',
        output: 'dist/assets/images/',
    },
    fonts: {
        input: 'src/assets/fonts/**/*.*',
        output: 'dist/assets/fonts/',
    }
};

// Build HTML
var buildHtml = function () {
    return src(paths.html.input)
        .pipe(
            nunjucks.compile(
                {
                    version: '1.0.0',
                    siteName: 'Bootstrapy Theme',
                    cssPrefix: 'app'
                },
                {
                    trimBlocks: true,
                    lstripBlocks: true
                }
            )
        )
        .pipe(htmlBeautify({ indentSize: 4, indentWithTabs: true }))
        .pipe(removeEmptyLines())
        .pipe(dest(paths.html.output));
}

// Build Styles
var buildStyles = function () {

    return src(paths.styles.input)
        .pipe(sourcemaps.init())
        .pipe(
            scss(
                {
                    outputStyle: 'expanded',
                    sourceComments: true
                }
            )
        )
        .pipe(
            autoprefixer(
                {
                    overrideBrowserslist: ['last 2 versions'],
                    cascade: true,
                    remove: true
                }
            )
        )
        .pipe(csscomb())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.styles.output));
}

// Minify Styles
var minifyStyles = series(buildStyles, function () {
    return src(paths.styles.output + '/**/*.css')
        .pipe(cleanCss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(paths.styles.output));
});

// Build Scripts
var buildScripts = function () {
    return src(paths.scripts.input)
        .pipe(dest(paths.scripts.output));
}

// Minify Scripts
var minifyScripts = series(buildScripts, function () {
    return src(paths.scripts.output + '/**/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(paths.scripts.output));
});

// Build Images
var buildImages = function () {
    return src(paths.images.input)
        .pipe(dest(paths.images.output));
}

// Build Fonts
var buildFonts = function () {
    return src(paths.fonts.input)
        .pipe(dest(paths.fonts.output));
}

// Start live server
var startServer = function (done) {
    browserSync.init({
        server: {
            baseDir: paths.output
        },
    });

    done();
};

// Reload the browser when files change
var reloadBrowser = function (done) {
    browserSync.reload();

    done();
};

// Watch for changes
var watchSource = function (done) {
    watch([ 
        paths.html.watch,
        paths.styles.input,
        paths.scripts.input,
        paths.images.input,
        paths.fonts.input
    ], series(buildHtml, buildStyles, buildScripts, buildImages, buildFonts, reloadBrowser));

    done();
};

// Clean dist
var cleanDist = function () {
    return del(paths.output);
}

exports.default = series(
    buildHtml,
    buildStyles,
    buildScripts,
    buildImages,
    watchSource,
    startServer
);

exports.watch = series(
    buildHtml,
    buildStyles,
    buildScripts,
    buildImages,
    buildFonts,
    watchSource,
    startServer
);

exports.build = series(
    cleanDist, 
    buildHtml,
    minifyStyles,
    minifyScripts,
    buildImages,
    buildFonts
);

exports.html = series(buildHtml);
exports.scss = series(buildStyles);
exports.minifyCss = series(minifyStyles);
exports.js = series(buildScripts);
exports.minifyJs = series(minifyScripts);
exports.images = series(buildImages);
exports.fonts = series(buildFonts);

exports.clean = series(cleanDist);