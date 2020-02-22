////////////////////////////////////////////////////////////////////////////////////////////////////
// gulp ////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
const { task, series, parallel } = require("gulp");
const browserSync = require("browser-sync").create("gulp");

// CSS
const css = require("./dev/build/gulp-css.js");
task("watch-css", series(css["watch"]));
task("stage-css", series(css["stage"]));

// JS
const js = require("./dev/build/gulp-js.js");
task("watch-js", series(js["watch"]));
task("stage-js", series(js["stage"]));

// Data
const data = require("./dev/build/gulp-data.js");
task("watch-data", series(data["watch"]));
task("stage-data", series(data["stage"]));

////////////////////////////////////////////////////////////////////////////////////////////////////

task("watch", parallel(css["watch"], js["watch"], data["watch"]));
task("stage", series(parallel(css["stage"], js["stage"], data["stage"])));
task("default", parallel("stage"));

task("serve", parallel("watch", function serve(done) {
	browserSync.init({
		"logFileChanges": false,
		"notify": false,
		"open": (process.argv.includes("-s") ? false : true),
		"server": "./"
	});
	done();
}));
