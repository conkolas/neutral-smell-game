var gulp = require('gulp'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    autoprefix = require('gulp-autoprefixer'),
    watch = require("gulp-watch"),
    browserSync = require('browser-sync'),
    csslint = require('gulp-csslint'),
    jshint = require('gulp-jshint'),
    jade = require('gulp-jade'),
    minifyCss = require('gulp-minify-css'),
    jsmin = require('gulp-jsmin'),
    rename = require('gulp-rename'),
    Imagemin = require('imagemin');



gulp.task('img', function () {
    var img = new Imagemin()
        .src('img/*.{gif,jpg,png,svg}')
        .dest('img/build/')
        .use(Imagemin.jpegtran({progressive: true}));
        
    img.run(function (err, files) {
        console.log(files[0]);
    });

});

gulp.task('css', function () {
    gulp.src('public_html/less/style.less')
        .pipe(less())
        .on('error', function(err) { gutil.log(err.message); })
        .pipe(autoprefix('last 2 version', 'ie 10'))
        .pipe(minifyCss({compatibility: 'ie10'}))
        .pipe(gulp.dest('public_html/'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('lint', function() {
  return gulp.src('public_html/js/*.js')
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('js', function() {
  gulp.src('public_html/js/*.js')
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public_html/js/build/'))
    .pipe(browserSync.reload({stream:true}));;
});

gulp.task('jade', function() {
  var YOUR_LOCALS = {};
  gulp.src('./public_html/jade/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./public_html/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', ['css'], function(){
    gulp.watch('./public_html/less/**/*.less', ['css']);
    gulp.watch('./public_html/js/**/*.js', ['js']);
    gulp.watch('./public_html/jade/**/*.jade', ['jade']);
});



gulp.task('browser-sync', function () {
    browserSync({
        proxy: "neutral-game.localhost"
    });
});

gulp.task('default', ['browser-sync', 'watch', 'jade', 'img' ]);
