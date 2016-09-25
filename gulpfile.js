var gulp          = require("gulp"),
	include       = require("gulp-include"),
	minCss        = require("gulp-clean-css"),
	concat        = require("gulp-concat"),
	plumber		  = require("gulp-plumber"),
	cached		  = require("gulp-cached"),
	remember	  = require("gulp-remember"),
	browserSync	  = require("browser-sync").create()
	del 		  = require("del");

// Sources.
var src = {
	index : "src/index.html",
	root : "src/",
	dist : "dist/"
}

gulp.task("clear", function(){
	return del(["dist"])
})

// Include all components
gulp.task("include-html", ["clear"], function() {
  console.log("-- gulp is running task 'include-html'");

  gulp.src(src.index)
    .pipe(include())
      .on('error', console.log)
    .pipe(gulp.dest(src.dist));
});

// Concat and minify css.
gulp.task("css", ["clear"],	 function(){
	console.log("Compiling css")

	gulp.src([
		src.root + "components/reset-css/reset.css", // Reset comes first.
		src.root + "**/*.css"]) // Then the rest.
		.pipe(plumber())
		.pipe(cached("css"))
		.pipe(minCss())
		.pipe(remember("css"))
		.pipe(concat("style.css"))
		.pipe(gulp.dest(src.dist))
		.pipe(browserSync.stream());
})




// Watch for changes.
gulp.task("watch", function(){

	var css = gulp.watch(src.root + "**/*.css", ["css"]),
		html = gulp.watch(src.root + "**/*.html", ["include-html"]);

	html.on("change", function(event){
		browserSync.reload();
	})

})

// Static server
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });
});


gulp.task("build-html-css", ["clear", "css","include-html"]);

gulp.task("default", ["build-html-css", "watch", "serve"]);