
// requires
var gulp            = require('gulp');
var sourcemaps      = require('gulp-sourcemaps');
var plumber         = require('gulp-plumber');
var connect         = require('gulp-connect');
var concat          = require('gulp-concat');
var jasmine         = require('gulp-jasmine');
var sass            = require('gulp-sass');
var merge           = require('merge-stream');
var kss             = require('gulp-kss');
var config          = require('./config.json');
var cmq             = require('gulp-group-css-media-queries');
var autoprefixer    = require('gulp-autoprefixer');
var yuidoc          = require('gulp-yuidoc');
var babel           = require('gulp-babel');
var jslint          = require('gulp-jslint');
var zip             = require('gulp-zip');
var csscomb         = require('gulp-csscomb');

// options/ params

var autoprefixerParams = {
    browsers: ['> 5%','last 2 versions'],
    cascade: false
};

var jslintParams = {
    node: true,
    evil: true,
    nomen: true,
    errorsOnly: false
};


// error handler
function handleError(err) {
    
    console.log("ERROR: " + err);
}

// gulp task for parsing CSS files

gulp.task('styles', function () {

    gulp.src([
            'src/css/**/*.*',
            '!src/css/vendor/**/*.*'
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerParams))
        .pipe(cmq())
        .pipe(csscomb())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .on('error', handleError)
        .pipe(connect.reload());
});


// gulp task for parsing javascript files

gulp.task('scripts', function () {

    //todo : to be rewritten
    //need to be copied
    var _vendors =  gulp.src([
            'src/js/vendor/**/*.*'
        ])
        .pipe(gulp.dest('public/js/vendor'));

    var _scripts = gulp.src([
            'src/js/**/*.*',
            '!src/js/vendor/**/*.*'
        ])
        .pipe(plumber(handleError))
        .pipe(jslint(jslintParams))
        .pipe(concat('app.js'))
        .on('error', handleError)
        .pipe(sourcemaps.write())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('public/js'))
        .pipe(connect.reload());

    return merge(_vendors, _scripts);
});

//gulp task for building CSS documentation ( using KSS )

gulp.task('kss', function(){

    gulp.src([
        'src/css/**/*.*',
        '!src/css/vendor/**/*.*'
    ])
    .pipe(kss({
        overview: './styleguide.md'
    }))
    .pipe(gulp.dest('styleguide/'));
});

// gulp task for fonts

gulp.task('fonts', function () {

    return gulp.src([
            'src/fonts/**/*.*'
        ])
        .pipe(gulp.dest('public/fonts'))
        .pipe(connect.reload());
});

// gulp task for for images

gulp.task('img', function () {

    return gulp.src([
            'src/images/**/*.*'
        ])
        .pipe(gulp.dest('public/images'))
        .pipe(connect.reload());
});

// gulp task for for icons

gulp.task('icons', function () {

    return gulp.src([
            'src/icons/**/*.*'
        ])
        .pipe(gulp.dest('public/icons'))
        .pipe(connect.reload());
});

// gulp task for htmls

gulp.task('html', function () {
    return gulp.src([
            'src/html/**/*.*'
        ])
        .pipe(gulp.dest('public/'))
        .pipe(connect.reload());
});

// gulp task for building zip package from public/ folder

gulp.task('zip', () => {

    return gulp.src([
            'public/*'
        ])
        .pipe(zip('public.zip'))
        .pipe(gulp.dest('public/'));
});

// gulp task for vendor one time copy

gulp.task('vendors', function(){

    var foundationJS = gulp.src([
            'node_modules/foundation/js/foundation/**/*.*'
        ])
        .pipe(gulp.dest('src/js/vendor/foundation'));

    var foundationCSS = gulp.src([
            'node_modules/foundation/scss/**/*.*'
        ])
        .pipe(gulp.dest('src/css/vendor/foundation'));

    var jquery = gulp.src([
                'node_modules/jquery/dist/**/*.*'
        ])
        .pipe(gulp.dest('src/js/vendor/jquery'));

    return merge(foundationJS, foundationCSS, jquery);
});

// gulp task for Jasmine

gulp.task('jasmine', function () {

    return gulp.src(['src/tests/**/*.js'])
            .pipe(jasmine());
});

// gulp task for javascript documenting ( using yuidoc )

gulp.task('yuidoc', function () {

    return gulp.src([
            'src/js/**/*.*',
            '!src/js/vendor/**/*.*'
        ])
        .pipe(yuidoc())
        .pipe(gulp.dest("./doc"));
});

gulp.task('watch', ['vendors','build', 'connect'], function () {

    // UGLY code, todo: rewrite:
    //console.log(config.tasks);
    for(var index in config.tasks) { 
       
       if (config.tasks.hasOwnProperty(index)) {
       
           gulp.watch(config.tasks[index], [index]);
       }
    }
});

gulp.task('connect', function () {

    connect.server({
        root: ['public'],
        port: 8080,
        livereload: true
    })
});

gulp.task('build',['vendors'], function () {

    gulp.run(Object.keys(config.tasks));
});

gulp.task('default', function () {

    gulp.run([ 
        'vendors',
        'build', 
        'watch'
    ]);
});




// var cssnano = require('cssnano');
// var uglify = require('gulp-uglify');
// var fileinclude = require('gulp-file-include');
// var prettify = require('gulp-prettify');
// var $ = require('gulp-load-plugins')();

// gulp.task('fileinclude', function () {
//  return gulp.src(['src/index.html'])
//      .pipe(fileinclude({
//          prefix: '@@',
//          basepath: '@file'
//      }))
//      .pipe(gulp.dest('./public'))
//      .pipe(connect.reload());
// });
// gulp.task('prettify', ['fileinclude'], function () {
//  return gulp.src('public/*.html')
//      .pipe(prettify({indent_size: 2}))
//      .pipe(gulp.dest('public'))
//      .pipe(connect.reload());
// });

// gulp.task('clean', function() {
//     gulp.src('public/*', {read: false})
//         .pipe(clean({force: true}));
// })

// gulp.task('minify', function() {

//     gulp.run(['minify:styles', 'minify:scripts'])
// });