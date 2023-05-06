var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

var styleSRC = './src/sass/main.scss';
var styleDIST = './src/public/css/';

gulp.task('style', function(){
    gulp.src( styleSRC )
        .pipe( sass({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }) )
        .on( 'error', console.error.bind( console ) )
        .pipe( rename( { suffix: '.min' } ) )
        .pipe( gulp.dest( styleDIST ) );
});

gulp.task('watch:style', function() {
    gulp.watch('./src/sass/*.scss', ['style']);
});