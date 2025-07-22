// 必要プラグインの読み込み (var gulp = ~ でも可)
const gulp = require("gulp"),
      browser = require('browser-sync'),
      autoprefixer = require('autoprefixer'),
      $ = require('gulp-load-plugins')();
const paths = {
        src: 'src',
        publish: 'public_html',
        themepath: 'public_html/wp/wp-content/theme',
        dist: 'public_html/assets'
      };

gulp.task('watch', done => {
  gulp.watch([ `${paths.src}/scss/**/*.scss`, `${paths.src}/scss/**/*.sass`],gulp.task('sass'));
  gulp.watch([
    paths.publish+'/**/*.html',
    paths.publish+'/**/*.php',
    paths.publish+'/**/*.xml',
    paths.themepath+'/**/*.html',
    paths.themepath+'/**/*.php',
    paths.dist+'/js/**/*.js',
    paths.dist+'/html/**/*.html'
  ], browser.reload );
  done()
});


gulp.task('sass', () => {
  return gulp.src([
      `${paths.src}/scss/*.scss`,
      `${paths.src}/scss/*.sass`,
      `${paths.src}/scss/page/*.scss`,
      `${paths.src}/scss/page/*.sass`
    ],{ base: `${paths.src}/scss`})
    .pipe($.sassGlob())
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss([
      autoprefixer({
        grid: true,
        cascade: false
      })
    ]))
    .pipe($.cssnano({
      discardComments: { removeAll: true},
      reduceIdents: false
    }))
    .pipe($.rename({suffix:'.min'}))
    .pipe($.sourcemaps.write('./maps/'))
    .pipe(gulp.dest(paths.dist+'/css'))
    .pipe(browser.reload({ stream: true }));
});

gulp.task('svgSprite',() => {
  return gulp.src(`${paths.src}/svg/**/*.svg`)
  .pipe($.svgSprite({
    mode: {
      symbol:{
        dest: './',
        inline: true
      }
    },
    shape: {
      transform: [
        {
          svgo: { // svgのスタイルのオプション
            plugins: [
              { 'removeTitle': true }, // titleを削除
              { 'removeStyleElement': true }, // <style>を削除
              { 'removeAttrs': { 'attrs': 'fill' } } // fill属性を削除
            ]
        }}
      ]
    },
  }))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('default', gulp.series('watch'));