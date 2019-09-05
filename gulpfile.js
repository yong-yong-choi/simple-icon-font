var async = require('async');
var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
 
gulp.task('Iconfont', function(done){
  var iconStream = gulp.src(['icons/*.svg'])
    .pipe(iconfont({ fontName: 'font-icon' }));
 
  async.parallel([
    function handleGlyphs (cb) {
      iconStream.on('glyphs', function(glyphs, options) {
        gulp.src('templates/font-icon.css')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            normalize: true,
            formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
            fontName: 'font-icon',
            fontPath: '../fonts/',
            className: 'ficon',
            appendCodepoints: true,
      		fontHeight: 1001
          }))
          .pipe(gulp.dest('css/'))
          .on('finish', cb);
      });
    },
    function handleHtmlTemplate (cb) {
      iconStream.on('glyphs', function(glyphs, options) {
        // html
        gulp.src('templates/font-template.html')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'font-icon',
            className: 'ficon',
            cssPath: 'css/font-icon.css'
          }))
          .pipe(gulp.dest('./'))
          .on('finish', cb);
          console.log('Create "font-template.html" file...');
      });
    },
    function handleFonts (cb) {
      iconStream
        .pipe(gulp.dest('fonts/'))
        .on('finish', cb);
    }
  ], done);
});

// 기본 구동 task
gulp.task('default', ['Iconfont']);