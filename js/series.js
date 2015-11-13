(function() {
	"use strict";

	let $list, $global_stats, global_stats = { "series-count": 0, "episode-count": 0, "watched-episodes-count": 0 };

	function load_series_data() {
		$.getJSON("data.json").done(function(data) {
			draw_series(data);
		});
	}

	function draw_series(data) {
		$.each(data, function(index, series) {
			let $series = $("<section />").addClass("series card");
			let stats = { "episode-count": 0, "watched-episodes-count": 0 };

			// series title
			$("<h1 />").addClass("series-title").text(series["series-title"]).appendTo($series);
			let $series_stats = $("<div />").addClass("series-stats").appendTo($series);

			// episode grid
			let $episodes = $("<div />").addClass("episode-grid");
			if(series["seasons"]) {
				draw_seasons(series["seasons"], $episodes, stats);
			}
			$episodes.appendTo($series);

			// series stats
			let percent_watched = ((stats["watched-episodes-count"] / stats["episode-count"]) * 100).toFixed(0);
			$series_stats.text(stats["episode-count"] + " episodes, " + stats["watched-episodes-count"] + " watched (" + percent_watched + "%)");

			global_stats["series-count"]++;
			global_stats["episode-count"] += stats["episode-count"];
			global_stats["watched-episodes-count"] += stats["watched-episodes-count"];
			let global_percent_watched = ((global_stats["watched-episodes-count"] / global_stats["episode-count"]) * 100).toFixed(0);
			$global_stats.text(global_stats["episode-count"] + " episodes from " + global_stats["series-count"] + " series, " + global_stats["watched-episodes-count"] + " watched (" + global_percent_watched + "%)");

			// append to page
			$list.append($series).masonry("appended", $series).masonry("layout");
		});
	}

	function draw_seasons(data, $episodes, stats) {
		$.each(data, function(index, season) {
			let $season = $("<div />").addClass("season");

			$("<span />").addClass("season-number").text(season["season-number"]).appendTo($season);
			for(let episode_number = 1; episode_number <= season["episode-count"]; episode_number++) {
				let $episode = $("<span />").addClass("episode").attr("title", "Season " + season["season-number"] + ", Episode " + episode_number).appendTo($season);
				stats["episode-count"]++;

				if(season["watched-episodes"] && (season["watched-episodes"] == "all" || season["watched-episodes"].indexOf(episode_number) >= 0)) {
					$episode.addClass("watched");
					stats["watched-episodes-count"]++;
				}
			}

			$season.appendTo($episodes);
		});
	}

	$(function() {
		$global_stats = $(".global-stats");

		$list = $(".series-list").masonry({
			"itemSelector": ".series",
			"columnWidth": ".series",
			"gutter": 16
		});

		load_series_data();
	});

	WebFont.load({
		google: { families: ["Roboto:400,500:latin"] },
		active: function() { $list.masonry("layout"); }
	});
})();
