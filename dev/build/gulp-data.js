////////////////////////////////////////////////////////////////////////////////////////////////////
// gulp / data /////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
const { src, dest, watch } = require("gulp");
const log = require("fancy-log");
const color = require("ansi-colors");
const plumber = require("gulp-plumber");
const config = require("./gulp-config.js");

// Módulos específicos para Data
const fs = require("fs-extra");

let tasks = { };

////////////////////////////////////////////////////////////////////////////////////////////////////

// Watch
tasks["watch"] = function watchData(done) {
    watch(config["data"]["watch"], { cwd: config["data"]["dir"], ignoreInitial: false }, tasks["stage"]);
    done();
};

// Stage
tasks["stage"] = function stageData(done) {
    const data = [ ];
    const source = fs.readJsonSync(config["data"]["source"][0]);

    source.forEach(series => {
        const seriesData = fs.readJsonSync(`${config["data"]["dir"]}${series}.json`);
        data.push(seriesData);
    });

    fs.outputJsonSync(config["data"]["destination"]["production"] + "data.json", data);

    log(color.green("Data !!"));
    done();
};

module.exports = tasks;
