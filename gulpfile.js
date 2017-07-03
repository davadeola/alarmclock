//Remember to restart the server after changing the gulpfile.using gulp serve

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var del = require('del');

var jshint = require('gulp-jshint');
var lib = require('bower-files')(
  {
    "overrides":{
      "bootstrap" : {
        "main": [
          "less/bootstrap.less",
          "dist/css/bootstrap.css",
          "dist/js/bootstrap.js"
        ]
      }
    }
  }
);

var browserSync = require('browser-sync').create();//create() creates our server

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');//for sass in css

var buildProduction = utilities.env.production;//initiates a production environment

gulp.task('concatInterface', function() {
  return gulp.src(['./js/*-interface.js'])
  .pipe(concat('allConcat.js'))
  .pipe(gulp.dest('./tmp'));
});

gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({ entries: ['./tmp/allConcat.js'] })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./build/js'));
});

gulp.task("minifyScripts", ["jsBrowserify"], function(){
  return gulp.src("./build/js/app.js")
  .pipe(uglify())
  .pipe(gulp.dest("./build/js"));
});

gulp.task('bowerJS', function () {
  return gulp.src(lib.ext('js').files)//takes all javascriptfiles in the project
  .pipe(concat('vendor.min.js'))//joins them to one file in vendor.min.js
  .pipe(uglify())//minify it
  .pipe(gulp.dest('./build/js'));//save the vendor.min.js in the build/js folder
});

gulp.task('bowerCSS', function(){

  return gulp.src(lib.ext('css').files)
  .pipe(concat('vendor.css'))

  .pipe(gulp.dest('./build/css'));
});


gulp.task('bower', ['bowerJS', 'bowerCSS']);//combine both these 2 Bower tasks into one, since they can run in parallel
//these tasks run concurrently and this is not a callback function.

gulp.task("clean", function(){
  return del(['build', 'tmp']);
});

gulp.task("build", ["clean"], function(){
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
  gulp.start('cssBuild');//will compile our scss file regardless of the environment.
  gulp.start('bower');//this will run our bower files no matter the environment we may be in
});



gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function(){
  browserSync.reload();//reloads the browser
});

gulp.task('bowerBuild', ['bower'], function(){
  browserSync.reload();
});

gulp.task('htmlBuild', function(){
  browserSync.reload();
});

gulp.task('cssBuild', function() {//to sass the CSS
  return gulp.src(['scss/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());//auto injects our new CSS into the browser
});


gulp.task('jshint', function(){
  return gulp.src(['js/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('serve', function() {
  browserSync.init({//this will start our server
    server: {
      baseDir: "./",//tells the browser to launch the server from the local directory that we are creating.
      index: "index.html"//tells the browser that the entry point to our app is index.html
    }
  });
  gulp.watch(['js/*.js'], ['jsBuild']);//this will automatically update all js files in the js folder once changed and run jsBuild
  gulp.watch(['bower.json'], ['bowerBuild']);
  gulp.watch(['*.html'], ['htmlBuild']);//watches for changes in all html pages and makes live changes to all of them
gulp.watch(["scss/*.scss"], ['cssBuild']);//watches for changes in all sass tasks
});
