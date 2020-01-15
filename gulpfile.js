var async = require('async');
var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
 

gulp.task('Iconfont', function(done){
  var iconStream = gulp.src(['icons/*.svg'])
   .pipe(iconfont({
      normalize: true,
      fontName: 'font-icon',
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
      appendCodepoints: true,
      fontHeight: 1001
    }))
  async.parallel([
    function handleGlyphs (cb) {
      iconStream.on('glyphs', function(glyphs, options) {
        gulp.src('templates/font-icon.css')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'font-icon',
            fontPath: '../fonts/',
            className: 'ficon'
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

//-------------------------------------------------------------------------

var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
 
var spritesmith = require('gulp.spritesmith');
 
gulp.task('sprite', function () {
  // Generate our spritesheet
  var spriteData = gulp.src('sprite-images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
 
  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest('images/'));
 
  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    //.pipe(csso())
    .pipe(gulp.dest('css/'));
 
  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

// 기본 구동 task
gulp.task('default', ['Iconfont', 'sprite']);
