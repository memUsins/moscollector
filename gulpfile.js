const {
    src,
    dest,
    series,
    watch
} = require('gulp')
const less = require('gulp-less')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin')
const del = require('del')
const sync = require('browser-sync').create()
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');

const html = () => {
    return src('src/pages/**.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('dist'))
}

const css = () => {
    return src('src/less/**.less')
        .pipe(less())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 version']
        }))
        .pipe(csso())
        .pipe(concat('index.css'))
        .pipe(dest('dist'))
}

const image = () => {
    return src('src/assets/img/*')
        .pipe(imagemin([
            imagemin.mozjpeg({
                quality: 75,
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imagemin.svgo({
                plugins: [{
                        removeViewBox: true
                    },
                    {
                        cleanupIDs: false
                    }
                ]
            })
        ]))
        .pipe(dest('dist/assets/img'))
}

const fonts = () => {
    return src('src/fonts/**/*')
        .pipe(dest('dist/assets/fonts'))
}

const icons = () => {
    return src('src/icons/**/*')
        .pipe(dest('dist/assets/icons'))
}

const clear = () => del('dist')


const serve = () => {
    sync.init({
        server: './dist'
    })

    watch('src/pages/**.html', series(html)).on('change', sync.reload)
    watch('src/less/**.less', series(css)).on('change', sync.reload)
    watch('src/assets/img/*', series(image)).on('change', sync.reload)
}

exports.build = series(clear, css, html, image, fonts, icons);
exports.serve = series(clear, css, html, image, fonts, icons, serve);