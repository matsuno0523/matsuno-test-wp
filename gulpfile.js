const { src, dest } = require('gulp');
const $ = require('gulp-load-plugins')();
const avif = require('gulp-avif');
const del = require('del');

const paths = {
  src: './src/',
  dist: './public_html/assets/'
};

function svgSprite() {
  return src(`${paths.src}svg/*.svg`)
    .pipe($.svgSprite({
      mode: {
        symbol: {
          dest: '.',
          sprite: 'svg/sprite.symbol.svg',
          inline: true
        }
      },
      shape: {
        transform: [{
          svgo: {
            plugins: [
              { 'removeTitle': true },
              { 'removeAttrs': { 'attrs': 'fill' } }
            ]
          }
        }]
      }
    }))
    .pipe(dest(paths.dist));
}

function convertAvif(done) {
  src(`${paths.src}avif_source/**/*.{jpg,jpeg,png}`)
    .pipe(avif({ quality: 50 }))
    .pipe(dest(paths.dist + 'img/avif'));
  done();
}

exports.svgSprite = svgSprite;
exports.avif = convertAvif;

function copyFonts() {
  return src('./node_modules/@fortawesome/fontawesome-free/webfonts/**/*')
    .pipe(dest('./public_html/wp/wp-content/themes/block/assets/webfonts'));
}
exports.copyFonts = copyFonts;