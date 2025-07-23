const { src, dest, watch, series, parallel } = require('gulp');
const browser = require('browser-sync');
const autoprefixer = require("autoprefixer");
const $ = require('gulp-load-plugins')();
const del = require('del');
const cssnano = require('cssnano');
const path = require('path');
const avif = require('gulp-avif');

const sass = require('gulp-sass');
const dartSass = require('sass');
const sassCompiler = sass(dartSass);

// path設定
const paths = {
  src: './src/',
  publish: './public_html',
  dist: './public_html/assets/'
};

// ==========================================================
// タスク定義
// ==========================================================

function sassCompile() {
  return src([
      `${paths.src}scss/*.scss`,
      `${paths.src}scss/*.sass`,
  ], { base: `${paths.src}/scss` })
    .pipe($.sassGlob())
    .pipe($.sourcemaps.init())
    .pipe(sassCompiler({
      includePaths: [path.join(__dirname, 'node_modules')]
    }).on('error', sassCompiler.logError))
    .pipe($.postcss([
      autoprefixer({
        grid: true,
        cascade: false
      }),
      cssnano({
        preset: ['default', {
          svgo: false,
        }],
        autoprefixer: false,
        discardComments: { removeAll: true },
        reduceIdents: false,
      })
    ]))
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.sourcemaps.write('./maps/'))
    .pipe(dest(paths.dist + '/css'))
    .pipe(browser.reload({ stream: true }));
}

function svgSprite() {
  return src(`${paths.src}svg/**/*.svg`)
    .pipe($.svgSprite({
      mode: {
        symbol: {
          dest: './',
          inline: true
        }
      },
      shape: {
        transform: [
          {
            svgo: {
              plugins: [
                { 'removeTitle': true },
                { 'removeStyleElement': true },
                { 'removeAttrs': { 'attrs': 'fill' } }
              ]
            }
          }
        ]
      },
    }))
    .pipe(dest(paths.dist));
}

function convertAvif(done) {
  del([paths.dist + 'img/avif'], { force: true });
  src([
    `${paths.src}avif_source/*.{jpg,jpeg,png}`,
    `${paths.src}avif_source/**/*.{jpg,jpeg,png}`,
  ])
    .pipe(avif({
      quality: 50
    }))
    .pipe(dest(paths.dist + 'img/avif'));
  done();
}

function copyFaFonts() {
  return src('node_modules/@fortawesome/fontawesome-free/webfonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(dest(`${paths.dist}webfonts/`));
}

function cleanFaFonts() {
  return del(`${paths.dist}webfonts/**/*`, { force: true });
}

function reloadBrowser(done) {
  browser.reload();
  done();
}

function watchFiles() {
  watch([`${paths.src}scss/**/*.scss`, `${paths.src}scss/**/*.sass`], sassCompile);
  watch([
    `${paths.publish}**/*.tpl`,
    `${paths.publish}**/*.php`,
    `${paths.publish}**/*.xml`,
    `${paths.dist}js/**/*.js`,
  ], reloadBrowser);
}

// ==========================================================
// タスクのエクスポート (Gulp 4.0以降の推奨形式)
// ==========================================================

exports.sass = sassCompile;
exports.svgSprite = svgSprite;
exports.avif = convertAvif;
exports.copyFaFonts = copyFaFonts;
exports.cleanFaFonts = cleanFaFonts;
// exports.browserSync = browserSyncServe;

exports.dev = series(
  cleanFaFonts,
  copyFaFonts,
  parallel(
    sassCompile,
    watchFiles 
  )
);

exports.default = series(
  cleanFaFonts,
  copyFaFonts,
  sassCompile,
  convertAvif,
  watchFiles
);