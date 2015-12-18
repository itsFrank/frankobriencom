var gulp = require('gulp')
var sass = require('gulp-ruby-sass')
var connect = require('gulp-connect')
// requires browserify and vinyl-source-stream
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var concat = require('gulp-concat')
var templateCache = require('gulp-angular-templatecache')
var open = require('gulp-open')

// Connect task - launch local dev server
gulp.task('connect', function () {
    connect.server({
        root: 'public',
        port: 4000
    })
})

gulp.task('open', function(){
    gulp.src('')
        .pipe(open({
            app: 'chrome',
            uri: 'http://localhost:4000'
        }));
})

// Browserfy task - Concat js files with require syntax
gulp.task('browserify', function() {
    // Grabs the app.js file
    return browserify('./app/app.js')
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./public/js/'));
})

//Concatenate all sass files in style.scss
gulp.task('sass-concat', function(){
    return gulp.src([
        'app/globals/colors.scss',
        'app/globals/**/*.scss',
        'app/directives/**/*.scss',
        'app/services/**/*.scss',
        'app/views/**/*.scss'
    ]).pipe(concat('style.scss'))
        .pipe(gulp.dest('./app'))
})

//Compile concatenated scss files
gulp.task('sass-compile', function() {
    return sass('app/style.scss')
        .pipe(gulp.dest('public/css'))
})

//Complete sass task
gulp.task('sass', ['sass-concat', 'sass-compile'])

gulp.task('vendor-css', function(){
    return gulp.src([
        'node_modules/purecss/build/pure-min.css'
        ,
        'node_modules/font-awesome/css/font-awesome.min.css'
    ]).pipe(concat('vendor.css'))
        .pipe(gulp.dest('public/css'))
})

//Cache all html templates
gulp.task('html', function () {
    return gulp.src('app/**/*.html')
        .pipe(templateCache('templates.js', { module:'templates', standalone:true }))
        .pipe(gulp.dest('./app'));
});

//Check for changes in all js and scss files
gulp.task('watch', function() {
    gulp.watch('app/**/*.js', ['browserify'])
    gulp.watch('app/**/*.scss', ['sass'])
    gulp.watch('app/**/*.html', ['html'])
})

//default task
gulp.task('default', ['connect', 'html', 'vendor-css', 'browserify', 'sass', 'watch', 'open'])
