/**
 * Dependencies
 *
 * INSTALL:
 * $npm install gulp, gulp-less, gulp-autoprefixer, gulp-minify-css, gulp-jshint, gulp-imagemin, gulp-rename, gulp-clean, gulp-concat, gulp-notify, gulp-cache, gulp-livereload, tiny-lr --savedev
 *
 * INFO:
 * http://markgoodyear.com/2014/01/getting-started-with-gulp/
 * https://gist.github.com/jonkemp/8244266
 * https://gist.github.com/floatdrop/8269868
 *
 */

var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

/**
 * Process CSS
 */

// Gulp allows us to pipe the output forward
// so we can build a task that has the steps
// to do everything we need to do:
//
var lessFiles = [
  'public/less/bootstrap-build.less',
  'public/less/font-awesome-build.less',
  'public/layouts/core.less'
];

gulp.task('styles', function() {          // Styles processing
  return gulp.src(lessFiles)              // Read Less files
    .pipe(less({}))                       // Compile Less files
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./public/layouts'))  // Save CSS here
    .pipe(rename({suffix: '.min'}))       // Add .min suffix
    .pipe(minifycss())                    // Minify the CSS
    .pipe(gulp.dest('dist/assets/css'))   // Save minified CSS here
    .pipe(livereload(server))             // Initiate a reload
    .pipe(notify({ message: 'Styles task complete' }));
});

/**
 * Process Scripts
 */

gulp.task('scripts', function() {         // Scripts processing
  return gulp.src('src/scripts/**/*.js')  // Read .js files
    .pipe(jshint('.jshintrc'))            // Lint .js files
    .pipe(jshint.reporter('default'))     // Specify a reporter for JSHint
    .pipe(concat('main.js'))              // Concatenate .js files into "main.js"
    .pipe(gulp.dest('dist/assets/js'))    // Save main.js here
    .pipe(rename({suffix: '.min'}))       // Add .min suffix
    .pipe(uglify())                       // Minify the .js
    .pipe(gulp.dest('dist/assets/js'))    // Save minified .js
    .pipe(livereload(server))             // Initiate a reload
    .pipe(notify({ message: 'Scripts task complete' }));
});

/**
 * Process Images
 */

gulp.task('images', function() {          // Image processing
  return gulp.src('src/images/**/*')      // Read images
    // NOTE: utilising caching to avoid re-compressing already compressed images `pipe(cache(imagemin`
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))) // Process images
    .pipe(gulp.dest('dist/assets/img'))   // Write images
    .pipe(livereload(server))             // Initiate a reload
    .pipe(notify({ message: 'Images task complete' }));
});

/**
 * Clean
 */

gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
    .pipe(clean());
});

/**
 * Default task
 */

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

/**
 * Nodemon (reload node)
 */

// Run your code with nodemon and lint it when your make changes.
// Watch .js files, but don't watch ignored.js.

gulp.task('develop', function () {
  nodemon({ script: 'app.js', options: '-e js -i ignored.js' })
    .on('restart', ['lint'])
});

/**
 * Watch (reload browser)
 */

gulp.task('watch', function() {
    var server = livereload();

    // Watch .html files
    gulp.watch('*.html', function(evt) {
        server.changed(evt.path);
    });

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

  });

});