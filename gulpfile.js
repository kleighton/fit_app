// Load plugins
const gulp = require("gulp");

const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const header = require("gulp-header");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");


// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function (cb) {

  // Bootstrap JS
  gulp.src([
      './node_modules/bootstrap/dist/js/*',
    ])
    .pipe(gulp.dest('./vendor/bootstrap/js'))

  // Bootstrap SCSS
  gulp.src([
      './node_modules/bootstrap/scss/**/*',
    ])
    .pipe(gulp.dest('./vendor/bootstrap/scss'))

  // ChartJS
  gulp.src([
      './node_modules/chart.js/dist/*.js'
    ])
    .pipe(gulp.dest('./vendor/chart.js'))

  // DataTables
  gulp.src([
      './node_modules/datatables.net/js/*.js',
      './node_modules/datatables.net-bs4/js/*.js',
      './node_modules/datatables.net-bs4/css/*.css'
    ])
    .pipe(gulp.dest('./vendor/datatables/'))

  // Font Awesome
  gulp.src([
      './node_modules/@fortawesome/**/*',
    ])
    .pipe(gulp.dest('./vendor'))

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))

  // jQuery Easing
  gulp.src([
      './node_modules/jquery.easing/*.js'
    ])
    .pipe(gulp.dest('./vendor/jquery-easing'))

  cb();

});

// CSS task
function css() {
  return gulp
    .src("./scss/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded"
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest("./css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./css"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    .src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browsersync.stream());
}

// Tasks
gulp.task("css", css);
gulp.task("js", js);

// BrowserSync
function browserSync() {
  browsersync.init({
    injectChanges: false,
    server: true
  });
}

// BrowserSync Reload
function browserSyncReload() {
  browsersync.reload();
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/*.scss", css);
  gulp.watch(["./js/**/*.js", "!./js/*.min.js"], js);
  gulp.watch("./*.html", browserSyncReload);
}

gulp.task("default", gulp.parallel(css, js));

// watch
gulp.task("dev", gulp.parallel(watchFiles, browserSync));