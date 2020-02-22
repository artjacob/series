////////////////////////////////////////////////////////////////////////////////////////////////////
// gulp / config ///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
let config = { };

// CSS
config["css"] = {
	"color": "cyan",
	"dir": "./source/css/",
	"watch": ["**/**.scss"],
	"source": ["./source/css/series.scss"],
	"destination": {
		"development": "./dist/",
		"production": "./dist/"
	}
};

// JS
config["js"] = {
	"color": "yellow",
	"dir": "./source/js/",
	"watch": ["**/**.js", "**/**.json"],
	"source": ["./source/js/series.js"],
	"destination": {
		"development": "./dist/",
		"production": "./dist/"
	}
};

// Data
config["data"] = {
	"color": "green",
	"dir": "./source/data/",
	"watch": ["**/**.json"],
	"source": ["./source/data/.series.json"],
	"destination": {
		"development": "./",
		"production": "./"
	}
};

module.exports = config;
